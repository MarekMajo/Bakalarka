from flask import request, jsonify, redirect, url_for, session
from werkzeug.utils import secure_filename
import os
import mysql.connector

class ProfilServer:
    def __init__(self, Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.adress = self.base.getSQLadress()
        self.routing_pozicie()

    def routing_pozicie(self):
        self.app.route('/profil')(self.base.check_token()(self.profil))
        self.app.route('/editProfil')(self.base.check_permission(['Edit Osoba info'])(self.base.check_token()(self.editProfil)))
        self.app.route('/prihlasovacieUdaje')(self.base.check_token()(self.base.check_permission(['Edit Prihlasovacie Udaje'])(self.prihlasovacieUdaje)))
        self.app.route('/upload_photo', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Edit Osoba info'])(self.upload_photo)))
        self.app.route('/deletePhoto')(self.base.check_token()(self.base.check_permission(['Edit Osoba info'])(self.deletePhoto)))
        self.app.route('/ulozUdaje', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Edit Osoba info'])(self.ulozUdaje)))
        self.app.route('/over_ulozHeslo', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Edit Prihlasovacie Udaje'])(self.over_ulozHeslo)))

    def userInfo(self):
        id = self.token.getID(session.get("token"))
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"select osoba_id, meno, priezvisko, rod_cislo, Pohlavie, bydlisko, telefon, email, pozicia_id, pr_meno "
                       f"from osoba join prihlasovacie_udaje pu on osoba_id = pu.login_id where osoba_id = '{id}'")
        udaje = cursor.fetchone()
        cursor.close()
        db.close()
        return udaje
    def profil(self):
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
        print(hodnoty)
        cursor.execute(f"UPDATE pokus.osoba t SET t.meno = '{hodnoty[1].split(' ')[0]}', t.priezvisko = '{hodnoty[1].split(' ')[1]}', "
                            f"t.rod_cislo = '{hodnoty[2]}', t.Pohlavie = '{hodnoty[3]}' ,t.bydlisko = '{hodnoty[4]}', "
                            f"t.telefon = '{hodnoty[5]}', t.email = '{hodnoty[6]}' WHERE t.osoba_id = '{hodnoty[0]}'")
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
            cursor.execute(f"select * from prihlasovacie_udaje where login_id = '{data['id_']}' and pr_heslo = '{data['stareheslo']}'")
            result = cursor.fetchall()
            cursor.close()
            db.close()
            if result:
                return jsonify({'result': True})
            return jsonify({'result': False})
        except:
            try:
                data = data["formData"]
                cursor.execute(f"select * from prihlasovacie_udaje where login_id = '{data['id_']}' and pr_heslo = '{data['stareheslo']}'")
                result = cursor.fetchall()
                if result:
                    cursor.execute(f"update prihlasovacie_udaje set pr_heslo = '{data['noveheslo']}' where login_id = '{data['id_']}'")
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