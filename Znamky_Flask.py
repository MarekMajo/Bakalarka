from flask import request, jsonify, session, redirect, url_for
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
        self.app.route('/Znamky')(self.base.check_token()(self.base.check_permission([])(self.showZnamky)))
        self.app.route('/Znamky/getZnamkyZiaka', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.Znamky_getZnamkyZiaka)))
        self.app.route('/Znamky/podpisatZnamkyZiaka', methods=['POST'])(self.base.check_token()(self.base.check_permission([48])(self.Znamky_podpisatZnamkyZiaka)))

        self.app.route('/EditZnamky')(self.base.check_token()(self.base.check_permission([9])(self.showEditZnamky)))
        self.app.route('/EditZnamky/GetPredmety', methods=['POST'])(self.base.check_token()(self.base.check_permission([9])(self.EditZnamky_GetPredmety)))
        self.app.route('/EditZnamky/GetKategoriePredmetu', methods=['POST'])(self.base.check_token()(self.base.check_permission([9])(self.EditZnamky_GetKategoriePredmetu)))
        self.app.route('/EditZnamky/SaveKategoriu', methods=['POST'])(self.base.check_token()(self.base.check_permission([9])(self.EditZnamky_SaveKategoriu)))
        self.app.route('/EditZnamky/SaveZnamky', methods=['POST'])(self.base.check_token()(self.base.check_permission([9])(self.EditZnamky_SaveZnamky)))
        self.app.route('/EditZnamky/GetZiakovPredmetu', methods=['POST'])(self.base.check_token()(self.base.check_permission([9])(self.EditZnamky_GetZiakovPredmetu)))
        self.app.route('/EditZnamky/CanEditZnamky', methods=['POST'])(self.base.check_token()(self.base.check_permission([9])(self.EditZnamky_CanEditZnamky)))
        self.app.route('/EditZnamky/DelKategoriePredmetu', methods=['POST'])(self.base.check_token()(self.base.check_permission([9])(self.EditZnamky_DelKategoriePredmetu)))


    def showZnamky(self):
        print(session.get('zvelenyView'))
        if session.get('zvelenyView') == 'Učiteľ':
            return redirect(url_for('showEditZnamky'))
        return self.base.render_web('Znamky/Znamky.html')

    def Znamky_getZnamkyZiaka(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        id = data['id']
        polrok = data['polrok']
        rok = session.get('zvolenyRok')
        cursor.execute("SELECT zp.nazov, pkz.kategoria_id, pkz.nazov, pkz.typ_znamky, pkz.vaha, pkz.max_body,GROUP_CONCAT(zz.znamka SEPARATOR ','), zz.podpis "
                       "FROM znamky_ziakov zz  JOIN predmet_kategorie_znamok pkz ON zz.kategoria_id = pkz.kategoria_id "
                       "JOIN predmety p ON pkz.predmet_id = p.predmet_id JOIN zoznam_predmetov zp ON p.zoznam_predmet_id = zp.zoznam_predmet_id "
                       "WHERE ziak_id = %s AND skolsky_rok_id IN ( SELECT skolsky_rok_id  FROM skolske_roky WHERE nazov = %s AND polrok = %s) "
                       "GROUP BY zp.nazov, pkz.kategoria_id, pkz.nazov, pkz.typ_znamky, pkz.vaha, pkz.max_body, zz.podpis", (id, rok, polrok,))
        znamky = cursor.fetchall()
        cursor.execute("select distinct zz.kategoria_id, od, do, zzp.znamka, pkz.nazov from znamka_z_percenta zzp "
                       "join predmet_kategorie_znamok pkz on zzp.kategoria_id = pkz.kategoria_id "
                       "join znamky_ziakov zz on pkz.kategoria_id = zz.kategoria_id WHERE ziak_id = %s AND skolsky_rok_id "
                       "IN ( SELECT skolsky_rok_id  FROM skolske_roky WHERE nazov = %s AND polrok = %s)", (id, rok, polrok, ))
        vypocet = cursor.fetchall()
        result = {}
        for predmet, kategoria_id, kategoria, typ_znamky, vaha, max_body, známky, podpis in znamky:
            if predmet not in result:
                result[predmet] = {}
            if kategoria not in result[predmet]:
                result[predmet][kategoria] = {
                    'kategoria_id': kategoria_id,
                    'typ_znamky': typ_znamky,
                    'vaha': vaha,
                    'max_body': max_body,
                    'znamkyPodpis': [],
                    'znamkyNePodpis': []
                }
            if podpis == 1 or podpis == "1":
                result[predmet][kategoria]['znamkyPodpis'].append(známky)
            else:
                result[predmet][kategoria]['znamkyNePodpis'].append(známky)

        final_result = []
        for predmet, kategorie_info in result.items():
            kategorie = []
            for kategoria, info in kategorie_info.items():
                kategorie.append({
                    'kategoria': kategoria,
                    'kategoria_id': info['kategoria_id'],
                    'typ_znamky': info['typ_znamky'],
                    'vaha': info['vaha'],
                    'max_body': info['max_body'],
                    'znamkyPodpis': info['znamkyPodpis'],
                    'znamkyNePodpis': info['znamkyNePodpis']
                })
            final_result.append({
                'predmet': predmet,
                'kategorie': kategorie
            })
        cursor.close()
        db.close()
        return jsonify({'predmety': final_result, 'vypocet': vypocet})

    def Znamky_podpisatZnamkyZiaka(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        id = data['id']
        kategorie = data['kategorie']
        for i in kategorie:
            cursor.execute("update znamky_ziakov set podpis = 1 where kategoria_id = %s and ziak_id = %s", (i, id,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)

    def showEditZnamky(self):
        if session.get('zvelenyView') != 'Učiteľ':
            return redirect(url_for('showZnamky'))
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        rok = session.get('zvolenyRok')
        cursor.execute("select trieda_id, nazov from triedy where skolsky_rok_id = %s", (rok,))
        triedy = cursor.fetchall()
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
        cursor.execute("SELECT MIN(p.predmet_id), CONCAT(zp.skratka, ' ', o.priezvisko) "
                       "FROM zoznam_predmetov zp JOIN predmety p ON zp.zoznam_predmet_id = p.zoznam_predmet_id "
                       "JOIN trieda_predmety tp ON p.predmet_id = tp.predmet_id "
                       "JOIN triedy t ON tp.trieda_id = t.trieda_id "
                       "JOIN ucitel_predmety up ON p.predmet_id = up.predmet_id "
                       "JOIN osoba o ON up.ucitel_id = o.osoba_id "
                       "WHERE p.skolsky_rok_nazov = %s AND t.trieda_id = %s "
                       "GROUP BY zp.skratka, o.priezvisko", (rok, data,))
        predmety = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(predmety)

    def EditZnamky_GetKategoriePredmetu(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        rok = session.get('zvolenyRok')
        cursor.execute("select skolsky_rok_id from skolske_roky "
                       "where nazov = %s and polrok = %s", (rok, data['polrok'],))
        rok_id = cursor.fetchall()[0][0]
        cursor.execute("select * from predmet_kategorie_znamok where predmet_id = %s and trieda_id = %s and skolsky_rok_id = %s",
                       (data['id'], data['trieda_id'], rok_id,))
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
        polrok = data['polrok']
        trieda_id = data['trieda_id']
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        if self.sql.uzatvorenyRokByPolrok(session.get('zvolenyRok'), int(data['polrok'])):
            id = self.token.getID(session.get('token'))
            cursor.execute("select * from predmety p join ucitel_predmety up on p.predmet_id = up.predmet_id "
                           "where ucitel_id = %s and p.predmet_id = %s ", (id, predmet_id,))
            if cursor.fetchall():
                if typ == 'znamka':
                    max = None
                cursor.execute("select skolsky_rok_id from skolske_roky "
                               "where nazov = %s and polrok = %s", (session.get('zvolenyRok'), polrok,))
                polrok = cursor.fetchall()[0][0]
                cursor.execute("select * from predmet_kategorie_znamok where nazov = %s "
                               "and predmet_id = %s and trieda_id = %s and skolsky_rok_id = %s",
                               (nazov, predmet_id, trieda_id, polrok,))
                if not cursor.fetchall():
                    cursor.execute("insert into predmet_kategorie_znamok (predmet_id, nazov, typ_znamky, vaha, max_body, "
                                   "trieda_id, skolsky_rok_id) values (%s, %s, %s, %s, %s, %s, %s)",
                                   (predmet_id, nazov, typ, vaha, max, trieda_id, polrok,))
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
            cursor.close()
            db.close()
            return jsonify({'neautorizovany': True})
        return jsonify({'uzavierka': True})


    def EditZnamky_GetZiakovPredmetu(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        cursor.execute("select skolsky_rok_id from skolske_roky "
                       "where nazov = %s and polrok = %s", (session.get('zvolenyRok'), data['polrok'],))
        polrok = cursor.fetchall()[0][0]
        cursor.execute("select nazov, znamka, od, do from znamka_z_percenta zp join predmet_kategorie_znamok pkz "
                       "on zp.kategoria_id = pkz.kategoria_id where predmet_id = %s and skolsky_rok_id = %s", (data['predmet'], polrok,))
        znamkaZPercenta = cursor.fetchall()
        cursor.execute("select ziak_id, concat(o.meno, ' ', o.priezvisko) from ziak_predmety zk join osoba o "
                       "on zk.ziak_id = o.osoba_id where predmet_id = %s", (data['predmet'],))
        allziaci = cursor.fetchall()
        cursor.execute("SELECT o.osoba_id, CONCAT(o.meno, ' ', o.priezvisko), zz.znamka_id, zz.znamka, pkz.nazov "
                       "FROM osoba o JOIN ziak_predmety zp ON o.osoba_id = zp.ziak_id "
                       "LEFT JOIN znamky_ziakov zz ON zp.ziak_id = zz.ziak_id AND zp.predmet_id = zz.predmet_id "
                       "LEFT JOIN predmet_kategorie_znamok pkz ON zz.kategoria_id = pkz.kategoria_id "
                       "LEFT JOIN predmety p ON zp.predmet_id = p.predmet_id "
                       "WHERE zp.predmet_id = %s and pkz.skolsky_rok_id = %s", (data['predmet'], polrok,))
        vybZiaci = cursor.fetchall()
        znamky = vybZiaci.copy()
        vybZiaci_ids = {item[0] for item in vybZiaci}
        for id, name in allziaci:
            if id not in vybZiaci_ids:
                znamky.append((id, name, None, None, None))
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
        return jsonify({'final_result': final_result, 'znamkaZPercenta': znamkaZPercenta})

    def EditZnamky_CanEditZnamky(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        id = self.token.getID(session.get("token"))
        cursor.execute("select * from predmety p join ucitel_predmety up on p.predmet_id = up.predmet_id "
                       "where up.predmet_id = %s and ucitel_id = %s", (data, id, ))
        result = cursor.fetchall()
        cursor.close()
        db.close()
        if result:
            return jsonify(True)
        return jsonify(False)

    def EditZnamky_SaveZnamky(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        predmet = data['predmet']
        if self.sql.uzatvorenyRokByPolrok(session.get('zvolenyRok'), int(data['polrok'])):
            id = self.token.getID(session.get("token"))
            cursor.execute("select * from predmety p join ucitel_predmety up on p.predmet_id = up.predmet_id "
                           "where up.predmet_id = %s and ucitel_id = %s", (predmet, id,))
            if cursor.fetchall():
                cursor.execute("select skolsky_rok_id from skolske_roky "
                               "where nazov = %s and polrok = %s", (session.get('zvolenyRok'), data['polrok'],))
                polrok = cursor.fetchall()[0][0]
                cursor.execute("select kategoria_id, nazov from predmet_kategorie_znamok where predmet_id = %s and skolsky_rok_id = %s", (predmet,polrok, ))
                kategorie = {}
                for id, nazov in cursor.fetchall():
                    kategorie[nazov] = id
                delete = data['upraveneZnamky']['delete']
                edit = data['upraveneZnamky']['edit']
                add = data['upraveneZnamky']['add']
                for i in delete:
                    cursor.execute("delete from znamky_ziakov where znamka_id = %s", (i.split('+')[0],))
                for key, item in edit.items():
                    cursor.execute("update znamky_ziakov set znamka = %s where znamka_id = %s", (item, int(key),))
                for i in add:
                    kategoria = i['kategoria'].split(' (')[0]
                    cursor.execute("insert into znamky_ziakov (kategoria_id, ziak_id, znamka, predmet_id) "
                                   "values (%s, %s, %s, %s)", (kategorie[kategoria], i['idOsoby'], i['znamka'], predmet, ))
                db.commit()
            cursor.close()
            db.close()
            return jsonify(True)
        cursor.close()
        db.close()
        return jsonify({'uzavierka': True})

    def EditZnamky_DelKategoriePredmetu(self):
        data = request.json
        if self.sql.uzatvorenyRokByPolrok(session.get('zvolenyRok'), int(data['polrok'])):
            id = self.token.getID(session.get('token'))
            db = mysql.connector.connect(**self.adress)
            cursor = db.cursor()
            data = data['id']
            cursor.execute("select * from predmet_kategorie_znamok pkz join predmety p on pkz.predmet_id = p.predmet_id "
                           "join ucitel_predmety up on p.predmet_id = up.predmet_id where ucitel_id = %s and pkz.kategoria_id = %s", (id, data,))
            if cursor.fetchall():
                cursor.execute("delete from znamky_ziakov where kategoria_id = %s", (data,))
                cursor.execute("delete from znamka_z_percenta where kategoria_id = %s", (data,))
                cursor.execute("delete from predmet_kategorie_znamok where kategoria_id = %s", (data,))
                db.commit()
                cursor.close()
                db.close()
                return jsonify(True)

            cursor.close()
            db.close()
            return jsonify({'neautorizovany': True})
        return jsonify({'uzavierka': True})

