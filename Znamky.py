from flask import request, jsonify, session
import mysql.connector

class Znamky:
    def __init__(self, Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.adress = self.base.getSQLadress()
        self.routing_Znamky()

    def routing_Znamky(self):
        self.app.route('/EditZnamky')(self.base.check_token()(self.base.check_permission([])(self.showEditZnamky)))
        self.app.route('/EditZnamky/GetPredmety', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.EditZnamky_GetPredmety)))
        self.app.route('/EditZnamky/GetKategoriePredmetu', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.EditZnamky_GetKategoriePredmetu)))
        self.app.route('/EditZnamky/SaveKategoriu', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.EditZnamky_SaveKategoriu)))



    def showEditZnamky(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        rok = session.get('zvolenyRok')
        cursor.execute("select trieda_id, nazov from triedy where skolsky_rok_id = %s", (rok,))
        triedy = cursor.fetchall()
        token = session.get("token")
        id = self.token.getID(token)
        cursor.close()
        db.close()
        return self.base.render_web('Znamky/EditZnamky.html', triedy=triedy)

    def EditZnamky_GetPredmety(self):
        data = request.json
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        rok = session.get('zvolenyRok')
        id = self.token.getID(session.get("token"))
        cursor.execute("select predmet_id, nazov from zoznam_predmetov zp "
                       "join predmety p on zp.zoznam_predmet_id = p.zoznam_predmet_id "
                       "join trieda_rocniky tr on p.rocnik_id = tr.rocnik_id "
                       "where p.skolsky_rok_nazov = %s and tr.trieda_id = %s", (rok, data,))
        predmety = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(predmety)

    def EditZnamky_GetKategoriePredmetu(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        rok = session.get('zvolenyRok')
        data = request.json
        cursor.execute("select * from predmet_kategorie_znamok where predmet_id = %s", (data,))
        kategorie = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(kategorie)

    def EditZnamky_SaveKategoriu(self):
        data = request.json
        nazov = data['nazov']
        typ = data['typ']
        vaha = data['vaha']
        vyhodnotenie = data['vyhodnotenie']
        predmet_id = data['predmet_id']
        max = data['max']
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        if typ is 'znamka':
            max = None
        cursor.execute("insert into predmet_kategorie_znamok (predmet_id, nazov, typ_znamky, vaha, max_body) values (%s, %s, %s, %s, %s)",
                       (predmet_id, nazov, typ, vaha, max))
        kategoria_id = cursor.lastrowid
        for i in vyhodnotenie:
            cursor.execute("insert into znamka_z_percenta values (%s,%s,%s,%s)",
                           (kategoria_id, i['znamka'], i['dolnaHranica'], i['hornaHranica'],))

        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)

