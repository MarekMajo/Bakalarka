from flask import request, jsonify, session, redirect, url_for, render_template
import mysql.connector
import os

class Uzivatelia():
    def __init__(self, Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.adress = self.base.getSQLadress()
        self.routing_uzivatelia()
        self.mailserver = self.base.getMailServer()

    def routing_uzivatelia(self):
        self.app.route('/uzivatelia')(self.base.check_token()(self.base.check_permission([5])(self.uzivatelia)))
        self.app.route('/editUzivatelskyProfil/<int:user_id>', methods=['GET'])(self.base.check_token()(self.base.check_permission([5, 13])(self.editUzivatelskyProfil)))
        self.app.route('/odstranUzivatelov', methods=['POST'])(self.base.check_token()(self.base.check_permission([12])(self.odstranUzivatelov)))
        self.app.route('/getChild', methods=['POST'])(self.base.check_token()(self.base.check_permission([5])(self.getChild)))
        self.app.route('/updateChild', methods=['POST'])(self.base.check_token()(self.base.check_permission([13])(self.updateChild)))
        self.app.route('/pridatUzivatela', methods=['POST'])(self.base.check_token()(self.base.check_permission([11])(self.pridatUzivatela)))
        self.app.route('/getPozicie', methods=['GET'])(self.base.check_token()(self.base.check_permission([5, 1])(self.getPozicie)))
        self.app.route('/saveRole', methods=['POST'])(self.base.check_token()(self.base.check_permission([1])(self.saveRole)))

    def uzivatelia(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select osoba_id, meno, priezvisko, Pohlavie, email, telefon, p.nazov from osoba left join pokus.pozicie p on osoba.pozicia_id = p.pozicia_id")
        udaje = cursor.fetchall()
        cursor.execute("select nazov from pozicie")
        role = cursor.fetchall()
        cursor.close()
        db.close()
        return self.base.render_web("/Zoznamy/Uzivatelia.html", uzivatelia=udaje, role=role)

    def odstranUzivatelov(self):
        data = request.json["uzivatelia"]
        if type(data) == list:
            db = mysql.connector.connect(**self.adress)
            cursor = db.cursor()
            for item in data:
                cursor.execute("delete from prihlasovacie_udaje where login_id = %s", (item,))
                cursor.execute("delete from osoba where osoba_id = %s", (item,))
            db.commit()
            cursor.close()
            db.close()
        else:
            db = mysql.connector.connect(**self.adress)
            cursor = db.cursor()
            cursor.execute("delete from prihlasovacie_udaje where login_id = %s", (data,))
            cursor.execute("delete from osoba where osoba_id = %s", (data,))
            db.commit()
            cursor.close()
            db.close()
        return jsonify({'result': 'success'})

    def editUzivatelskyProfil(self, user_id):
        photo = "static/Profilovky/" + str(user_id)
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select * from osoba where osoba_id = %s", (user_id,))
        udaje = cursor.fetchall()[0]
        id = self.token.getID(session.get("token"))
        cursor.execute("select * from opravnenia_pozicie op join osoba o "
                       "on o.pozicia_id = op.pozicia_id "
                       "join opravnenia p on op.Opravnenia_id = p.opravnenie_id where o.osoba_id = %s and p.nazov = %s", (id, 'Upraviť Deti Rodica',))
        result = cursor.fetchall()
        modifyChild = False
        if result:
            modifyChild = True
        cursor.close()
        db.close()
        if os.path.exists(photo):
            return self.base.render_web("editProfil.html", udaje=udaje, editUzivatela=True, photo_url="/"+photo, modifyChild=modifyChild)
        else:
            return self.base.render_web("editProfil.html", editUzivatela=True, udaje=udaje, modifyChild=modifyChild)

    def pridatUzivatela(self):
        data = request.json
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO osoba (meno, priezvisko, rod_cislo, Pohlavie, bydlisko, telefon, email) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (data['meno'], data['priezvisko'], data['rodCislo'], data['pohlavie'], data['adresa'], data['telCislo'],
             data['email']))

        osoba_id = cursor.lastrowid
        pr_meno = self.__getuserName(data['priezvisko'])
        pr_heslo = self.__generatePassword()
        cursor.execute(
            "INSERT INTO prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES ( %s, %s, %s)",
            (osoba_id, pr_meno, pr_heslo))
        self.mailserver.sendMailNewUser(data['email'], data['meno'] + " " + data['priezvisko'], osoba_id, pr_meno, pr_heslo)
        db.commit()
        cursor.close()
        db.close()
        return jsonify({'result': 'success'})

    def __generatePassword(self):
        import random
        import string
        possible_characters = string.ascii_letters + string.digits + string.punctuation
        random_string = ''.join(random.choice(possible_characters) for _ in range(8))
        return random_string

    def __getuserName(self, priezvisko):
        db = mysql.connector.connect(**self.adress)
        pr = priezvisko
        cursor = db.cursor()
        cursor.execute("select * from prihlasovacie_udaje where pr_meno = %s", (priezvisko,))
        result = cursor.fetchone()
        if result:
            cursor.execute("SELECT pr_meno FROM prihlasovacie_udaje WHERE pr_meno = %s GROUP BY pr_meno ORDER BY LENGTH(pr_meno) DESC", (priezvisko,))
            results = cursor.fetchall()
            zoznam = list()
            if len(results) > 1:
                for result in results:
                    temp = str(result).split("'")[1].split(priezvisko)[1]
                    if len(temp) > 0:
                        zoznam.append(int(temp))
                naj = zoznam[0]
                for x in zoznam:
                    if x > naj:
                        naj = x
                pr += str(naj + 1)
            else:
                pr += str(2)
        cursor.close()
        db.close()
        return pr

    def getPozicie(self):
        return jsonify(self.sql.getPozicie())

    def saveRole(self):
        data = request.json['data']
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        for item in data:
            idUser = item['IdUzivatela']
            idPrava = item['IdPrava']
            if idPrava:
                cursor.execute("UPDATE osoba  SET pozicia_id = %s WHERE osoba_id = %s", (idPrava, idUser))
            else:
                cursor.execute("UPDATE osoba  SET pozicia_id = NULL WHERE osoba_id = %s", (idUser,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({'result': 'success'})

    def getChild(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        rok = session.get('zvolenyRok')
        cursor.execute("select o.osoba_id, concat(meno, ' ', priezvisko), p.nazov, r.nazov "
                       "from osoba o left join rocnik_osoba ro on ro.osoba_id = o.osoba_id "
                       "left join pozicie p on o.pozicia_id = p.pozicia_id "
                       "left join rocniky r on ro.rocnik_id = r.rocnik_id "
                       "where o.osoba_id != %s and r.skolsky_rok_nazov = %s order by o.osoba_id", (data, rok,))
        osoby = cursor.fetchall()
        cursor.execute("select Ziak_id from rodic_deti where Rodic_id = %s and skolsky_rok_nazov = %s", (data,rok, ))
        ziaci = [i[0] for i in cursor.fetchall()]
        cursor.close()
        db.close()
        return jsonify({'osoby': osoby, 'ziaci': ziaci})
    def updateChild(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        rok = session.get('zvolenyRok')
        rodic_id = data['id']
        ziaci = data['ziaci']
        cursor.execute("select Ziak_id from rodic_deti where Rodic_id = %s and skolsky_rok_nazov = %s", (rodic_id, rok,))
        aktualnyZiaci = [i[0] for i in cursor.fetchall()]
        vymazatZiakov = [i for i in aktualnyZiaci if i not in ziaci]
        pridatZiakov = [i for i in ziaci if i not in aktualnyZiaci]
        for i in vymazatZiakov:
            cursor.execute("delete from rodic_deti where Rodic_id = %s and Ziak_id = %s and skolsky_rok_nazov =%s", (rodic_id, i, rok,))
        for i in pridatZiakov:
            cursor.execute("insert into rodic_deti values (%s, %s, %s)", (rodic_id, i, rok,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)