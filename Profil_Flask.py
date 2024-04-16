from flask import request, jsonify, redirect, url_for, session
from werkzeug.utils import secure_filename
import os
import mysql.connector

class Profil:
    def __init__(self, Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.adress = self.base.getSQLadress()
        self.routing_pozicie()

    def routing_pozicie(self):
        self.app.route('/profil')(self.base.check_token()(self.showProfil))
        self.app.route('/editProfil')(self.base.check_permission([3])(self.base.check_token()(self.editProfil)))
        self.app.route('/prihlasovacieUdaje')(self.base.check_token()(self.base.check_permission([6])(self.prihlasovacieUdaje)))
        self.app.route('/upload_photo', methods=['POST'])(self.base.check_token()(self.base.check_permission([2])(self.upload_photo)))
        self.app.route('/deletePhoto')(self.base.check_token()(self.base.check_permission([4])(self.deletePhoto)))
        self.app.route('/ulozUdaje', methods=['POST'])(self.base.check_token()(self.base.check_permission([3])(self.ulozUdaje)))
        self.app.route('/over_ulozHeslo', methods=['POST'])(self.base.check_token()(self.base.check_permission([6])(self.over_ulozHeslo)))

    def userInfo(self):
        id = self.token.getID(session.get("token"))
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select osoba_id, meno, priezvisko, rod_cislo, Pohlavie, bydlisko, telefon, email, pozicia_id, pr_meno "
                       "from osoba join prihlasovacie_udaje pu on osoba_id = pu.login_id where osoba_id = %s", (id,))
        udaje = cursor.fetchone()
        cursor.close()
        db.close()
        return udaje
    def showProfil(self):
        photo = "static/Profilovky/" + str(self.token.getID(session.get("token")))
        if os.path.exists(photo):
            return self.base.render_web("profil.html", udaje=self.userInfo(), photo_url=photo, editUzivatela=False)
        else:
            return self.base.render_web("profil.html", udaje=self.userInfo(), editUzivatela=False)

    def editProfil(self):
        photo = "static/Profilovky/" + str(self.token.getID(session.get("token")))
        if os.path.exists(photo):
            return self.base.render_web("editProfil.html", udaje=self.userInfo(), photo_url=photo, editUzivatela=False)
        else:
            return self.base.render_web("editProfil.html", udaje=self.userInfo(), editUzivatela=False)
    def upload_photo(self):
        photo = request.files['photo']
        if photo:
            filename = secure_filename(photo.filename)
            typ = str(filename.split('.')[1])
            if typ == "png" or typ == "jpg" or typ == "jpeg":
                upload_folder = 'static/Profilovky'
                photo_path = os.path.join(upload_folder, str(self.token.getID(session.get("token"))))
                photo.save(photo_path)
                return redirect(url_for('profil'))
            else:
                return redirect(url_for('profil'))

    def deletePhoto(self):
        photo = "static/Profilovky/" + str(self.token.getID(session.get("token")))
        if os.path.exists(photo):
            os.remove(photo)
        return jsonify({'result': True})

    def ulozUdaje(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        hodnoty = list(request.json.values())
        cursor.execute("UPDATE pokus.osoba t SET t.meno = %s, t.priezvisko = %s, "
                            "t.rod_cislo = %s, t.Pohlavie = %s ,t.bydlisko = %s, "
                            "t.telefon = %s, t.email = %s WHERE t.osoba_id = %s",
                       (hodnoty[1].split(' ')[0], hodnoty[1].split(' ')[1], hodnoty[2],
                        hodnoty[3], hodnoty[4], hodnoty[5], hodnoty[6], hodnoty[0]))
        db.commit()
        cursor.close()
        db.close()
        return jsonify({'result': True})

    def prihlasovacieUdaje(self):
        return self.base.render_web("editPrihlasenie.html", udaje=self.userInfo(), editUzivatela=False)

    def over_ulozHeslo(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        try:
            data = data["stareheslo"]
            cursor.execute("select * from prihlasovacie_udaje where login_id = %s and pr_heslo = %s",
                           (data['id_'], data['stareheslo']))
            result = cursor.fetchall()
            cursor.close()
            db.close()
            if result:
                return jsonify({'result': True})
            return jsonify({'result': False})
        except:
            try:
                data = data["formData"]
                cursor.execute("select * from prihlasovacie_udaje where login_id = %s and pr_heslo = %s",
                               (data['id_'], data['stareheslo'],))
                result = cursor.fetchall()
                if result:
                    cursor.execute("update prihlasovacie_udaje set pr_heslo = %s where login_id = %s",
                                   (data['noveheslo'], data['id_'],))
                    db.commit()
                    cursor.close()
                    db.close()
                    return jsonify({'result': True})
                else:
                    cursor.close()
                    db.close()
                    return jsonify({'result': False})
            except:
                return jsonify({'result': False})
