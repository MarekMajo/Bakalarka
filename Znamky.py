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
        self.app.route('/EditZnamky/GetZiakovPredmetu', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.EditZnamky_GetZiakovPredmetu)))
        self.app.route('/EditZnamky/CanEditZnamky', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.EditZnamky_CanEditZnamky)))


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
        try:
            trieda = int(request.args.get('trieda'))
        except:
            trieda = None
        return self.base.render_web('Znamky/EditZnamky.html', triedy=triedy, zvTrieda=trieda)

    def EditZnamky_GetPredmety(self):
        data = request.json
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        rok = session.get('zvolenyRok')
        cursor.execute("select p.predmet_id, concat(zp.skratka, ' ', o.priezvisko) "
                       "from zoznam_predmetov zp join predmety p on zp.zoznam_predmet_id = p.zoznam_predmet_id "
                       "join trieda_rocniky tr on p.rocnik_id = tr.rocnik_id "
                       "join ucitel_predmety up on p.predmet_id = up.predmet_id "
                       "join osoba o on up.ucitel_id = o.osoba_id "
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
        cursor.execute("select * from predmet_kategorie_znamok where predmet_id = %s and trieda_id = %s", (data['id'], data['trieda_id']))
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
        trieda_id = data['trieda_id']
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        if typ is 'znamka':
            max = None
        cursor.execute("select * from predmet_kategorie_znamok where nazov = %s and predmet_id = %s and trieda_id = %s", (nazov, predmet_id, trieda_id,))
        if not cursor.fetchall():
            cursor.execute("insert into predmet_kategorie_znamok (predmet_id, nazov, typ_znamky, vaha, max_body, trieda_id) values (%s, %s, %s, %s, %s, %s)",
                          (predmet_id, nazov, typ, vaha, max, trieda_id,))
            kategoria_id = cursor.lastrowid
            for i in vyhodnotenie:
               cursor.execute("insert into znamka_z_percenta values (%s,%s,%s,%s)",
                              (kategoria_id, i['znamka'], i['dolnaHranica'], i['hornaHranica'],))

            db.commit()
            cursor.close()
            db.close()
            return jsonify(True)
        else:
            cursor.close()
            db.close()
            return jsonify(False)


    def EditZnamky_GetZiakovPredmetu(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        cursor.execute("select osoba_id, concat(meno, ' ', priezvisko), znamka_id, znamka, nazov "
                       "from osoba o join ziak_predmety zp on o.osoba_id = zp.ziak_id "
                       "left join znamky_ziakov zz on zp.ziak_id = zz.ziak_id and zp.predmet_id = zz.predmet_id "
                       "left join predmet_kategorie_znamok pkz on zz.kategoria_id = pkz.kategoria_id "
                       "where zp.predmet_id = %s ", (data['predmet'], ))
        znamky = cursor.fetchall()
        cursor.close()
        db.close()
        result = {}
        for osoba_id, meno_priezvisko, znamka_id, znamka, kategoria in znamky:
            if osoba_id not in result:
                result[osoba_id] = {'meno_priezvisko': meno_priezvisko, 'kategorie': {}}
            kategorie = result[osoba_id]['kategorie']
            if kategoria not in kategorie:
                kategorie[kategoria] = {}
            kategorie[kategoria][znamka_id] = znamka

        final_result = []
        for osoba_id, info in result.items():
            final_result.append({
                'osoba_id': osoba_id,
                'meno_priezvisko': info['meno_priezvisko'],
                'kategorie': info['kategorie']
            })
        return jsonify(final_result)

    def EditZnamky_CanEditZnamky(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        id = self.token.getID(session.get("token"))
        cursor.execute("select * from predmety p join ucitel_predmety up on p.predmet_id = up.predmet_id "
                       "where up.predmet_id = %s and ucitel_id = %s", (data, id, ))
        if cursor.fetchall():
            cursor.close()
            db.close()
            return jsonify(True)
        cursor.close()
        db.close()
        return jsonify(False)