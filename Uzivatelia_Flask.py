from flask import request, jsonify, session, redirect, url_for, render_template
import mysql.connector
import os

class Uzivatelia():
    def __init__(self,Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.adress = self.base.getSQLadress()
        self.routing_uzivatelia()
        self.mailserver = self.base.getMailServer()

    def routing_uzivatelia(self):
        self.app.route('/uzivatelia')(self.base.check_token()(self.base.check_permission(['Zoznam pouzivatelov'])(self.uzivatelia)))
        self.app.route('/editUzivatelskyProfil/<int:user_id>', methods=['GET'])(self.base.check_token()(self.base.check_permission(['Zoznam pouzivatelov'])(self.editUzivatelskyProfil)))
        self.app.route('/odstranUzivatelov', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Zoznam pouzivatelov'])(self.odstranUzivatelov)))
        self.app.route('/pridatUzivatela', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Zoznam pouzivatelov'])(self.pridatUzivatela)))
        self.app.route('/getPozicie', methods=['GET'])(self.base.check_token()(self.base.check_permission(['Zoznam pouzivatelov','Zobraz pozicie'])(self.getPozicie)))
        self.app.route('/saveRole', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Zoznam pouzivatelov'])(self.saveRole)))

    def uzivatelia(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"select osoba_id, meno, priezvisko, Pohlavie, email, telefon, p.nazov from osoba left join pokus.pozicie p on osoba.pozicia_id = p.pozicia_id")
        udaje = cursor.fetchall()
        cursor.execute(f"select nazov from pozicie")
        role = cursor.fetchall()
        cursor.close()
        db.close()
        return self.base.render_web("/Zoznamy/Uzivatelia.html", uzivatelia=udaje, role=role)

    def odstranUzivatelov(self):
        data = request.json["uzivatelia"]
        if data:
            for item in data:
                db = mysql.connector.connect(**self.adress)
                cursor = db.cursor()
                cursor.execute(f"delete from prihlasovacie_udaje where login_id = '{item}'")
                cursor.execute(f"delete from osoba where osoba_id = '{item}'")
                db.commit()
                cursor.close()
                db.close()
        return jsonify({'result': 'success'})

    def editUzivatelskyProfil(self, user_id):
        photo = "static/Profilovky/" + str(user_id)
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"select * from osoba where osoba_id = '{user_id}'")
        udaje = cursor.fetchone()
        cursor.close()
        db.close()
        if os.path.exists(photo):
            return self.base.render_web("editProfil.html", udaje=udaje, editUzivatela=True, photo_url="/"+photo)
        else:
            return self.base.render_web("editProfil.html", editUzivatela=True, udaje=udaje)

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
        #pr_heslo = self.__generatePassword()
        pr_heslo = "123"
        cursor.execute(
            "INSERT INTO prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES ( %s, %s, %s)",
            (osoba_id, pr_meno, pr_heslo))
        db.commit()
        cursor.close()
        db.close()
        #self.mailserver.sendMailNewUser(data['email'], data['meno'] + " " + data['priezvisko'], osoba_id, pr_meno, pr_heslo)
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
        cursor.execute(f"select * from prihlasovacie_udaje where pr_meno = '{priezvisko}'")
        result = cursor.fetchone()
        if result:
            cursor.execute(f"SELECT pr_meno FROM prihlasovacie_udaje WHERE pr_meno LIKE '{priezvisko}%' GROUP BY pr_meno ORDER BY LENGTH(pr_meno) DESC")
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
                print(pr)
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
                cursor.execute(f"UPDATE osoba  SET pozicia_id = '{idPrava}' WHERE osoba_id = '{idUser}'")
            else:
                cursor.execute(f"UPDATE osoba  SET pozicia_id = NULL WHERE osoba_id = '{idUser}'")
        db.commit()
        cursor.close()
        db.close()
        return jsonify({'result': 'success'})
