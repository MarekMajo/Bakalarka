from flask import request, jsonify, session
import mysql.connector

class Rozvrhy:
    def __init__(self, Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.adress = self.base.getSQLadress()
        self.routing_Rozvrhy()

    def routing_Rozvrhy(self):
        self.app.route('/Rozvrh')(self.base.check_token()(self.base.check_permission([])(self.showRozvrh)))
        self.app.route('/Rozvrh/getRozvrhTriedy', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.rozvrh_getRozvrhTriedy)))
        self.app.route('/Edit_Rozvrh')(self.base.check_token()(self.base.check_permission([47])(self.showEdit_Rozvrh)))
        self.app.route('/Edit_Rozvrh/getInfoBloku', methods=['POST'])(self.base.check_token()(self.base.check_permission([47])(self.Edit_rozvrh_getInfoBloku)))
        self.app.route('/Edit_Rozvrh/saveBlock', methods=['POST'])(self.base.check_token()(self.base.check_permission([47])(self.Edit_rozvrh_saveBlock)))

    def showRozvrh(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        rok = session.get('zvolenyRok')
        cursor.execute("select trieda_id, nazov from triedy where skolsky_rok_id = %s", (rok,))
        triedy = cursor.fetchall()
        cursor.execute("select distinct osoba_id, concat(meno, ' ',priezvisko) from ucitel_predmety "
                       "join osoba o on ucitel_predmety.ucitel_id = o.osoba_id where skolsky_rok_nazov = %s", (rok,))
        ucitelia = cursor.fetchall()
        cursor.execute("select ucebna_id, skratka from ucebne ", )
        ucebne = cursor.fetchall()
        id = self.token.getID(session.get("token"))
        cursor.execute("select trieda_id from ziak_trieda where ziak_id = %s and skolsky_rok_nazov = %s", (id, rok,))
        ziak_trieda = cursor.fetchall()
        if ziak_trieda:
            ziak_trieda = ziak_trieda[0][0]
        else:
            ziak_trieda = None
        cursor.close()
        db.close()
        return self.base.render_web('/Rozvrhy/Rozvrh.html', triedy=triedy, zvolena=ziak_trieda, ucitelia=ucitelia, ucebne=ucebne)

    def rozvrh_getRozvrhTriedy(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        rok = session.get('zvolenyRok')
        data = request.json
        id = data['idTriedy']
        polrok = data['polRok']
        typ = data['typ']
        if id == "Učiteľ":
            id = self.token.getID(session.get("token"))

        if typ != "Učiteľ":
            query = ("SELECT r.den_v_tyzdni, r.block, zp.skratka, u.skratka, "
                     "GROUP_CONCAT(DISTINCT LEFT(ou.priezvisko, 3) ORDER BY ou.priezvisko SEPARATOR ', '), "
                     "GROUP_CONCAT(DISTINCT LEFT(oa.priezvisko, 3) ORDER BY oa.priezvisko SEPARATOR ', '), r.predmet_id "
                     "FROM rozvrhy r JOIN predmety p ON r.predmet_id = p.predmet_id "
                     "JOIN zoznam_predmetov zp ON p.zoznam_predmet_id = zp.zoznam_predmet_id "
                     "JOIN ucebne u ON r.ucebna_id = u.ucebna_id "
                     "LEFT JOIN asistent_predmety ap ON p.predmet_id = ap.predmet_id "
                     "LEFT JOIN ucitel_predmety up ON p.predmet_id = up.predmet_id "
                     "LEFT JOIN osoba oa ON ap.asistent_id = oa.osoba_id "
                     "LEFT JOIN osoba ou ON up.ucitel_id = ou.osoba_id "
                     "JOIN skolske_roky sr ON r.skolsky_rok_id = sr.skolsky_rok_id "
                     "WHERE p.skolsky_rok_nazov = %s "
                     f"AND sr.polrok = %s AND {typ} = %s "
                     "GROUP BY r.den_v_tyzdni, r.block, zp.skratka, u.skratka, r.predmet_id")
        else:
            query = ("select r.den_v_tyzdni, r.block, zp.skratka, u.skratka, p.predmet_id from rozvrhy r "
                     "join predmety p on r.predmet_id = p.predmet_id "
                     "join zoznam_predmetov zp on p.zoznam_predmet_id = zp.zoznam_predmet_id "
                     "join ucebne u on r.ucebna_id = u.ucebna_id "
                     "join ziak_predmety z on p.predmet_id = z.predmet_id "
                     "join skolske_roky sr on r.skolsky_rok_id = sr.skolsky_rok_id "
                     "where p.skolsky_rok_nazov = %s and sr.polrok = %s and ziak_id = %s")
        cursor.execute(query, (rok, polrok, id,))
        result = cursor.fetchall()
        rozdelenie = {}
        raz = []
        dvakrat = []
        triKrat = []
        for item in result:
            block = (item[0], item[1])
            if block in rozdelenie:
                rozdelenie[block].append(item)
            else:
                rozdelenie[block] = [item]
        for key, items in rozdelenie.items():
            if len(items) == 1:
                raz.append(items[0])
            elif len(items) == 2:
                merged = items[0]
                for item in items[1:]:
                    merged += item[2:]
                dvakrat.append(merged)
            elif len(items) == 3:
                merged = items[0]
                for item in items[1:]:
                    merged += item[2:]
                triKrat.append(merged)
        cursor.close()
        db.close()
        return jsonify({'raz': raz, 'dvakrat': dvakrat, 'triKrat': triKrat})

    def showEdit_Rozvrh(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        rok = session.get('zvolenyRok')
        cursor.execute("select trieda_id, nazov from triedy where skolsky_rok_id = %s", (rok,))
        triedy = cursor.fetchall()
        id = self.token.getID(session.get("token"))
        cursor.execute("select trieda_id from ziak_trieda where ziak_id = %s and skolsky_rok_nazov = %s", (id, rok,))
        ziak_trieda = cursor.fetchall()
        if ziak_trieda:
            ziak_trieda = ziak_trieda[0][0]
        else:
            ziak_trieda = None
        cursor.close()
        db.close()
        return self.base.render_web('/Rozvrhy/EditRozvrh.html', triedy=triedy, zvolena=ziak_trieda)

    def Edit_rozvrh_getInfoBloku(self):
        data = request.json
        rok = session.get('zvolenyRok')
        polrok = data['polrok']
        if self.sql.uzatvorenyRokByPolrok(rok, int(polrok)):
            db = mysql.connector.connect(**self.adress)
            cursor = db.cursor()
            data = request.json
            trieda = data['id']
            den = data['den']
            block = data['block']
            cursor.execute("SELECT p.predmet_id, r.nazov, zp.nazov, zp.skratka, CONCAT(o.meno, ' ', o.priezvisko), "
                           "GROUP_CONCAT(DISTINCT CONCAT(oa.meno, ' ', oa.priezvisko) SEPARATOR ', '), "
                           "u.skratka, COUNT(DISTINCT z.ziak_id) FROM predmety p "
                           "JOIN zoznam_predmetov zp ON p.zoznam_predmet_id = zp.zoznam_predmet_id "
                           "LEFT JOIN rocniky r ON p.rocnik_id = r.rocnik_id "
                           "LEFT JOIN ucitel_predmety up ON p.predmet_id = up.predmet_id "
                           "LEFT JOIN osoba o ON up.ucitel_id = o.osoba_id "
                           "LEFT JOIN asistent_predmety ap ON p.predmet_id = ap.predmet_id "
                           "LEFT JOIN osoba oa ON ap.asistent_id = oa.osoba_id "
                           "LEFT JOIN predmety_ucebne pu ON p.predmet_id = pu.predmet_id "
                           "LEFT JOIN ucebne u ON pu.ucebna_id = u.ucebna_id "
                           "LEFT JOIN ziak_predmety z ON p.predmet_id = z.predmet_id "
                           "left join trieda_rocniky tr on r.rocnik_id = tr.rocnik_id "
                           "left join triedy t on tr.trieda_id = t.trieda_id "
                           "WHERE p.predmet_id in (select tp.predmet_id from trieda_predmety tp where tp.trieda_id = %s) and pu.ucebna_id is not null "
                           "GROUP BY p.predmet_id, r.nazov, zp.nazov, zp.skratka, "
                           "CONCAT(o.meno, ' ', o.priezvisko), u.skratka", (trieda,))
            predmety = cursor.fetchall()
            cursor.execute("select p.predmet_id from rozvrhy r join predmety p on r.predmet_id = p.predmet_id "
                           "join triedy t on r.trieda_id = t.trieda_id where r.den_v_tyzdni = %s and r.block = %s and t.trieda_id = %s "
                           "and r.skolsky_rok_id in (select sr.skolsky_rok_id from skolske_roky sr where sr.nazov = %s and polrok = %s)",
                           (den, block, trieda, rok, polrok,))
            vybrane = [i[0] for i in cursor.fetchall()]
            cursor.close()
            db.close()
            return jsonify({'predmety': predmety, 'vybrane': vybrane})
        return jsonify({'uzatvoreny': True})
    def Edit_rozvrh_saveBlock(self):
        data = request.json
        rok = session.get('zvolenyRok')
        polrok = data['polrok']
        if self.sql.uzatvorenyRokByPolrok(rok, int(polrok)):
            db = mysql.connector.connect(**self.adress)
            cursor = db.cursor()
            trieda = data['id']
            den = data['den']
            block = data['block']
            zoznam = data['zoznam']
            cursor.execute("select skolsky_rok_id from skolske_roky  where nazov = %s and polrok = %s", (rok, polrok))
            rok_id = cursor.fetchall()[0][0]
            cursor.execute("select r.predmet_id from rozvrhy r join predmety p on r.predmet_id = p.predmet_id "
                           "join triedy t on r.trieda_id = t.trieda_id where r.den_v_tyzdni = %s and r.block = %s and t.trieda_id = %s "
                           "and r.skolsky_rok_id = %s",
                           (den, block, trieda, rok_id))

            existuje = [i[0] for i in cursor.fetchall()]
            vymazat = [i for i in existuje if i not in zoznam]
            pridat = [i for i in zoznam if i not in existuje]
            cursor.execute("select trieda_id from triedy where trieda_id = %s and skolsky_rok_id = %s", (trieda, rok,))
            trieda_id = cursor.fetchall()[0][0]
            for i in vymazat:
                cursor.execute("delete from rozvrhy where predmet_id = %s and trieda_id =%s and den_v_tyzdni=%s and block=%s and skolsky_rok_id = %s", (i, trieda_id, den, block, rok_id))

            for i in pridat:
                cursor.execute("select pu.ucebna_id from predmety p join predmety_ucebne pu on p.predmet_id = pu.predmet_id where p.predmet_id = %s", (i,))
                ucebna = cursor.fetchall()[0][0]
                cursor.execute("insert into rozvrhy (den_v_tyzdni, block, trieda_id, predmet_id, ucebna_id, skolsky_rok_id) VALUES (%s,%s,%s,%s,%s,%s)",
                               (den, block, trieda_id, i, ucebna, rok_id))

            db.commit()
            cursor.close()
            db.close()
            return jsonify(True)
        return jsonify(False)