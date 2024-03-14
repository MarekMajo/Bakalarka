from flask import request, jsonify, session
import mysql.connector

class Zoznamy:
    def __init__(self, Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.adress = self.base.getSQLadress()
        self.routing_Zoznamy()

    def routing_Zoznamy(self):
        self.app.route('/Triedy')(self.base.check_token()(self.base.check_permission([])(self.showTriedy)))
        self.app.route('/Triedy/getTriedny', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.triedy_getTriedny)))
        self.app.route('/Triedy/getZiaci', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.triedy_getZiaci)))
        self.app.route('/Triedy/getInfo', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.triedy_getInfo)))
        #self.app.route('/Triedy/getOsoby')(self.base.check_token()(self.base.check_permission([])(self.triedy_getOsoby)))
        #self.app.route('/Triedy/getOsoby', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.triedy_getOsobyTriedy)))
        self.app.route('/Triedy/saveTriedu', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.triedy_saveTriedu)))
        self.app.route('/Triedy/getTriedu', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.triedy_getTriedu)))
        self.app.route('/Triedy/delTriedu', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.triedy_delTriedu)))
        self.app.route('/Triedy/updateTriedu', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.triedy_updateTriedu)))
        self.app.route('/Triedy/getPredmetyRocniku')(self.base.check_token()(self.base.check_permission([])(self.triedy_getPredmetyRocniku)))

        self.app.route('/Predmety')(self.base.check_token()(self.base.check_permission([])(self.showPredmety)))
        self.app.route('/Predmety/getPredmety')(self.base.check_token()(self.base.check_permission([])(self.predmety_getPredmety)))
        self.app.route('/Predmety/getUcitelia')(self.base.check_token()(self.base.check_permission([])(self.predmety_getUcitelia)))
        self.app.route('/Predmety/getUcebne')(self.base.check_token()(self.base.check_permission([])(self.predmety_getUcebne)))
        self.app.route('/Predmety/delPredmetKroku', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.predmety_delPredmetKroku)))
        self.app.route('/Predmety/ulozitPredmetKroku', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.predmety_ulozitPredmetKroku)))
        self.app.route('/Predmety/copyFromLastYear')(self.base.check_token()(self.base.check_permission([])(self.predmety_copyFromLastYear)))
        self.app.route('/Predmety/getInfo', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.predmety_getInfo)))
        self.app.route('/Predmety/updatePredmet', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.predmety_updatePredmet)))
        self.app.route('/Predmety/getZiaciRocnik', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.predmety_getZiaciRocnik)))

        self.app.route('/Ucebne')(self.base.check_token()(self.base.check_permission([])(self.showUcebne)))
        self.app.route('/Ucebne/saveUcebna', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.ucebne_saveUcebna)))
        self.app.route('/Ucebne/updateUcebna', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.ucebne_updateUcebna)))
        self.app.route('/Ucebne/delUcebna', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.ucebne_delUcebna)))

        self.app.route('/skolskeRoky')(self.base.check_token()(self.base.check_permission([])(self.showskolskeRoky)))
        self.app.route('/skolskeRoky/ulozitNovyRok', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.skolskeRokyulozitNovyRok)))

        self.app.route('/Rocniky')(self.base.check_token()(self.base.check_permission([])(self.showRocniky)))
        self.app.route('/Rocniky/getZiaci', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.rocniky_getOsoby)))
        self.app.route('/Rocniky/saveRocnik', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.rocniky_saveRocnik)))
        self.app.route('/Rocniky/getZiaciVrocniku', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.rocniky_getOsobyRocniku)))
        self.app.route('/Rocniky/updateRocnik', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.rocniky_updateRocnik)))
        self.app.route('/Rocniky/delRocnik', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.rocniky_delRocnik)))
        self.app.route('/Rocniky/getMinulyRocnik')(self.base.check_token()(self.base.check_permission([])(self.rocniky_getMinulyRocnik)))
        self.app.route('/Rocniky/copyMinulyRocnik', methods=['POST'])(self.base.check_token()(self.base.check_permission([])(self.rocniky_copyMinulyRocnik)))

    def showskolskeRoky(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(
            "SELECT a.skolsky_rok_id, a.nazov, a.zaciatok_roku, b.koniec_roku FROM skolske_roky a JOIN skolske_roky b ON a.nazov = b.nazov AND a.polrok < b.polrok")
        result = cursor.fetchall()
        cursor.close()
        db.close()
        return self.base.render_web('/Zoznamy/SkolskeRoky.html', roky=result)

    def triedy_saveTriedu(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        nazov = data['nazov']
        try:
            triedny = data['vyberTriedneho'][0]
        except:
            triedny = None

        try:
            ucebna = data['vyberUcebne'][0]
        except:
            ucebna = None
        if data['rocnik'] == "None":
            rocnik = None
        else:
            cursor.execute("select rocnik_id from rocniky where nazov = %s and skolsky_rok_nazov = %s",
                           (data['rocnik'], session.get('zvolenyRok'),))
            rocnik = cursor.fetchall()[0][0]
        ziaci = data['vyberZiakov']
        rok = session.get('zvolenyRok')
        cursor.execute("select * from triedy where nazov=%s and skolsky_rok_id=%s", (nazov, rok,))
        if not cursor.fetchall():
            cursor.execute("insert into triedy(nazov, triedny_id, skolsky_rok_id) VALUES (%s,%s,%s)",
                           (nazov, triedny, rok,))
            id = cursor.lastrowid
            cursor.execute("insert into ucebne_triedy VALUES (%s,%s)", (ucebna, id,))
            cursor.execute("insert into trieda_rocniky VALUES (%s,%s)", (id, rocnik,))
            for ziak in ziaci:
                cursor.execute("insert into ziak_trieda VALUES (%s,%s,%s)", (ziak, id,rok,))
            db.commit()
            cursor.close()
            db.close()
            return jsonify(True)
        cursor.close()
        db.close()
        return jsonify(False)

    def triedy_getTriedu(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        cursor.execute("select nazov from triedy where trieda_id=%s", (data,))
        nazov = cursor.fetchall()
        cursor.execute("select osoba_id, concat(o.meno, ' ', o.priezvisko), p.nazov from triedy "
                       "join pokus.osoba o on o.osoba_id = triedy.triedny_id left join pokus.pozicie p "
                       "on o.pozicia_id = p.pozicia_id where trieda_id =%s", (data,))
        triedny = cursor.fetchall()
        cursor.execute("select ut.ucebna_id, nazov from ucebne join ucebne_triedy ut "
                       "on ucebne.ucebna_id = ut.ucebna_id where trieda_id = %s", (data,))
        ucebna = cursor.fetchall()
        cursor.execute("select osoba_id, concat(meno, ' ', priezvisko), p.nazov from osoba o join pokus.ziak_trieda zt "
                       "on o.osoba_id = zt.ziak_id left join pokus.pozicie p "
                       "on o.pozicia_id = p.pozicia_id where trieda_id = %s", (data,))
        ziaci = cursor.fetchall()

        cursor.execute("select nazov from rocniky r left join trieda_rocniky tr on r.rocnik_id = tr.rocnik_id "
                       "where tr.trieda_id = %s", (data,))
        rocnik = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify({"nazov": nazov, "triedny": triedny, "ucebna": ucebna, "ziaci": ziaci, 'rocnik': rocnik})

    def triedy_delTriedu(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        cursor.execute("delete from ziak_trieda where trieda_id = %s", (data,))
        cursor.execute("delete from trieda_rocniky where trieda_id = %s", (data,))
        cursor.execute("delete from ucebne_triedy where trieda_id = %s", (data,))
        cursor.execute("delete from triedy where trieda_id = %s", (data,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)

    def triedy_updateTriedu(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        id = data['id']
        nazov = data['nazov']
        vyberZiakov = data['vyberZiakov']
        if data['rocnik'] == "None":
            rocnik = None
        else:
            cursor.execute("select rocnik_id from rocniky where nazov = %s and skolsky_rok_nazov = %s",
                           (data['rocnik'], session.get('zvolenyRok'),))
            rocnik = cursor.fetchall()[0][0]
        try:
            vyberTriedneho = data['vyberTriedneho'][0]
        except:
            vyberTriedneho = None
        try:
            vyberUcebne = data['vyberUcebne'][0]
        except:
            vyberUcebne = None
        cursor.execute("select ziak_id from ziak_trieda where trieda_id=%s", (id,))
        aktualny = [i[0] for i in cursor.fetchall()]
        vymazat = [i for i in aktualny if i not in vyberZiakov]
        pridat = [i for i in vyberZiakov if i not in aktualny]
        cursor.execute("update triedy set nazov=%s, triedny_id=%s where trieda_id=%s", (nazov, vyberTriedneho, id,))
        cursor.execute("update ucebne_triedy set ucebna_id=%s where trieda_id=%s", (vyberUcebne, id,))
        cursor.execute("update trieda_rocniky set rocnik_id=%s where trieda_id=%s", (rocnik, id,))
        for i in vymazat:
            cursor.execute("delete from ziak_trieda where ziak_id = %s and trieda_id = %s", (i, id,))
        for i in pridat:
            cursor.execute("insert into ziak_trieda values (%s, %s)", (i, id))
        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)

    def triedy_getPredmetyRocniku(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        rok = session.get('zvolenyRok')
        print(data)
        cursor.close()
        db.close()
        return jsonify(True)
    def skolskeRokyulozitNovyRok(self):
        data = request.json
        nazov = data['zaciatok'].split('-')[0] + "/" + data['koniec'].split('-')[0]
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"select * from skolske_roky where nazov = '{nazov}'")
        vysledok = cursor.fetchall()
        if len(vysledok) == 0:
            cursor.execute(
                f"INSERT INTO skolske_roky (nazov, polrok, zaciatok_roku, koniec_roku) VALUES ('{nazov}', 0, '{data['zaciatok']}', '{data['polrok1']}')")
            cursor.execute(
                f"INSERT INTO skolske_roky (nazov, polrok, zaciatok_roku, koniec_roku) VALUES ('{nazov}', 1, '{data['polrok2']}', '{data['koniec']}')")
            db.commit()
            cursor.close()
            db.close()
            return jsonify({'result': True})
        cursor.close()
        db.close()
        return jsonify({'result': False})


    """
    Funkcia 'triedy_getTriedny', funguje na princípe:
    #1 > vyberie sa celý zoznam osôb v systéme.
    #2 > vyberie sa zoznam osôb ktorý sú priradený do nejakého ročníku v danom roku (napríklad '2024/2025').
    #3 > vytvorí sa nový zoznam ktorý bude obsahovať všetky osoby s vínmkou osoby ktoré sa nachádzajú v nejakom ročníku.
    #4 > vyberiú sa id všetkých triednych učiteľov v triede v danom roku (napríklad '2024/2025').
    #5 > Následne sa podľa atribútu 'data' rozdelí či ide o 'Pridanie triedy' v tedy je data na 'None', a pokial nie je None ale číslo tak ide o 'Edit triedy'.
    #ADD #1 > vytvorí sa zoznam iba s id existujúcimi triednymi učiteľmi.
    #ADD #2 > vytvorí sa nový zoznam ktorý bude obsahovať osoby ktoré niesú priradené k žiadnemu ročníku alebo ako triedny v danom roku (napríklad '2024/2025').
    
    #EDIT #1 > vytvorí sa zoznam iba s id existujúcimi triednymi učiteľmi ale k zoznamu nieje pridaný učiteľ ktorého 'trieda_id' v [1] sa rovná data.
    #EDIT #2 > vytvorí sa nový zoznam ktorý bude obsahovať osoby ktoré niesú priradené k žiadnemu ročníku alebo ako triedny s 
    výnimkou osoby ktorej id bolo priradené k id triedy v data v danom roku (napríklad '2024/2025').
    
    #6 > vyberie osoby z databázy s id a celým menom.
    #7 > vytvorí finálny zoznam s osobami ktorý sú z '#6' a zo zoznamu z '#ADD #2' alebo '#EDIT #2'.
    #8 > finálny zoznam pošle ako json stránke.
    """
    def triedy_getTriedny(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        rok = session.get('zvolenyRok')
        cursor.execute("select osoba_id from osoba ORDER BY osoba_id")
        osoby = [i[0] for i in cursor.fetchall()]
        cursor.execute("select osoba_id from rocnik_osoba ro join rocniky r on r.rocnik_id = ro.rocnik_id where skolsky_rok_nazov = %s", (rok,))
        osoba_rocnik = [i[0] for i in cursor.fetchall()]
        osoby_bez_rocniku = [i for i in osoby if i not in osoba_rocnik]
        cursor.execute("select triedny_id, trieda_id from triedy where triedny_id is not null and skolsky_rok_id = %s", (rok,))
        if data is None:
            existujuci_triedny = [i[0] for i in cursor.fetchall()]
            osoby_bez_rocniku = [i for i in osoby_bez_rocniku if i not in existujuci_triedny]
        else:
            nepridat = [i[0] for i in cursor.fetchall() if i[1] != int(data)]
            osoby_bez_rocniku = [i for i in osoby_bez_rocniku if i not in nepridat]

        cursor.execute("select osoba_id, concat(meno, ' ', priezvisko) from osoba ORDER BY osoba_id")
        result = [i for i in cursor.fetchall() if i[0] in osoby_bez_rocniku]
        cursor.close()
        db.close()
        return jsonify(result)


    def triedy_getZiaci(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        rocnik = data['rocnik']
        rok = session.get('zvolenyRok')
        cursor.execute("select osoba_id from osoba ORDER BY osoba_id")
        osoby = [i[0] for i in cursor.fetchall()]
        cursor.execute(
            "select osoba_id from rocnik_osoba ro join rocniky r on r.rocnik_id = ro.rocnik_id where skolsky_rok_nazov = %s and nazov = %s",
            (rok, rocnik,))
        osoba_rocnik = [i[0] for i in cursor.fetchall()]
        osoby_v_rocniku = [i for i in osoby if i in osoba_rocnik]
        cursor.execute("select osoba_id, concat(meno, ' ', priezvisko) from osoba ORDER BY osoba_id")
        result = [i for i in cursor.fetchall() if i[0] in osoby_v_rocniku]
        cursor.close()
        db.close()
        return jsonify(result)

    def triedy_getInfo(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        cursor.execute()

        cursor.close()
        db.close()
        return jsonify(True)

    def showTriedy(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(
            "select t.trieda_id, u.skratka, t.nazov, concat(o.meno, ' ', o.priezvisko), count(zt.ziak_id), r.nazov "
            "from triedy t left join ziak_trieda zt on t.trieda_id = zt.trieda_id "
            "left join pokus.osoba o on t.triedny_id = o.osoba_id "
            "left join ucebne_triedy ut on t.trieda_id = ut.trieda_id "
            "left join ucebne u on ut.ucebna_id = u.ucebna_id "
            "left join trieda_rocniky tr on tr.trieda_id = t.trieda_id "
            "left join rocniky r on tr.rocnik_id = r.rocnik_id "
            "where t.skolsky_rok_id = %s "
            "group by t.trieda_id,u.skratka, t.nazov, r.nazov",
            (session.get('zvolenyRok'),))
        result = cursor.fetchall()
        cursor.execute("select nazov from rocniky where skolsky_rok_nazov =%s", (session.get('zvolenyRok'),))
        rocniky = cursor.fetchall()
        cursor.close()
        db.close()
        return self.base.render_web('/Zoznamy/Triedy.html', Triedy=result, rocniky=rocniky)


    def triedy_getOsobyTriedy(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        triedny = data.get('triedny', None)
        ziak = data.get('ziak', None)
        cursor.execute("SELECT o.osoba_id, CONCAT(o.meno, ' ', o.priezvisko), p.nazov FROM osoba o "
                       "LEFT JOIN pozicie p ON p.pozicia_id = o.pozicia_id "
                       "WHERE ( o.osoba_id NOT IN (SELECT ziak_id FROM ziak_trieda) "
                       "OR o.osoba_id IN (SELECT ziak_id FROM ziak_trieda WHERE trieda_id = %s) ) "
                       "AND o.osoba_id NOT IN (SELECT ucitel_id FROM ucitel_predmety) "
                       "AND ( o.osoba_id NOT IN (SELECT triedny_id FROM triedy WHERE triedny_id IS NOT NULL) "
                       "OR o.osoba_id IN (SELECT triedny_id FROM triedy WHERE trieda_id = %s "
                       "AND triedny_id IS NOT NULL))", (ziak, triedny))
        result = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(result)

    def triedy_getOsoby(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("SELECT o.osoba_id, CONCAT(o.meno, ' ', o.priezvisko) FROM osoba o "
                       "LEFT JOIN pozicie p ON o.pozicia_id = p.pozicia_id "
                       "LEFT JOIN ziak_trieda zt ON o.osoba_id = zt.ziak_id "
                       "LEFT JOIN ucitel_predmety up ON o.osoba_id = up.ucitel_id "
                       "LEFT JOIN triedy t ON o.osoba_id = t.triedny_id "
                       "WHERE zt.ziak_id IS NULL AND up.ucitel_id IS NULL AND (t.triedny_id "
                       "IS NULL OR t.triedny_id NOT IN (SELECT triedny_id FROM triedy WHERE triedny_id IS NOT NULL))")
        result = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(result)

    def showPredmety(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        rok = session.get('zvolenyRok')
        cursor.execute("SELECT p.predmet_id, r.nazov, zp.nazov, zp.skratka, "
                       "CONCAT(o.meno, ' ', o.priezvisko), "
                       "GROUP_CONCAT(DISTINCT CONCAT(oa.meno, ' ', oa.priezvisko) SEPARATOR ', '), u.skratka, "
                       "COUNT(DISTINCT z.ziak_id) FROM predmety p "
                       "JOIN zoznam_predmetov zp ON p.zoznam_predmet_id = zp.zoznam_predmet_id "
                       "LEFT JOIN rocniky r ON p.rocnik_id = r.rocnik_id "
                       "LEFT JOIN ucitel_predmety up ON p.predmet_id = up.predmet_id "
                       "LEFT JOIN osoba o ON up.ucitel_id = o.osoba_id "
                       "LEFT JOIN asistent_predmety ap ON p.predmet_id = ap.predmet_id "
                       "LEFT JOIN osoba oa ON ap.asistent_id = oa.osoba_id "
                       "LEFT JOIN predmety_ucebne pu ON p.predmet_id = pu.predmet_id "
                       "LEFT JOIN ucebne u ON pu.ucebna_id = u.ucebna_id "
                       "LEFT JOIN ziak_predmety z ON p.predmet_id = z.predmet_id "
                       "WHERE p.skolsky_rok_nazov = %s "
                       "GROUP BY p.predmet_id, r.nazov, zp.nazov, zp.skratka, CONCAT(o.meno, ' ', o.priezvisko), u.skratka", (rok,))
        result = cursor.fetchall()
        cursor.execute(f"select nazov from pozicie")
        role = cursor.fetchall()
        cursor.execute("select nazov from rocniky where skolsky_rok_nazov =%s", (session.get('zvolenyRok'),))
        rocniky = cursor.fetchall()
        cursor.close()
        db.close()
        return self.base.render_web('/Zoznamy/Predmety.html', predmety=result, role=role, rocniky=rocniky)

    def predmety_getPredmety(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select * from zoznam_predmetov")
        result = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(result)

    def predmety_getUcitelia(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(
            "select o.osoba_id, concat(o.meno, ' ', o.priezvisko), p.nazov from osoba o left join pozicie p on o.pozicia_id = p.pozicia_id where osoba_id not in (select r.osoba_id from rocnik_osoba r)")
        result = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(result)

    def predmety_getUcebne(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select * from ucebne")
        result = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(result)

    def predmety_delPredmetKroku(self):
        data = request.json
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("DELETE FROM predmety_ucebne WHERE predmet_id = %s", (int(data),))
        cursor.execute("DELETE FROM ucitel_predmety WHERE predmet_id = %s", (int(data),))
        cursor.execute("DELETE FROM ziak_predmety WHERE predmet_id =%s", (int(data),))
        cursor.execute("DELETE FROM asistent_predmety WHERE predmet_id =%s", (int(data),))
        cursor.execute("delete from rozvrhy where predmet_id = %s", (int(data),))
        cursor.execute("delete from predmety where predmet_id = %s", (int(data),))
        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)

    def predmety_ulozitPredmetKroku(self):
        data = request.json
        vyucujuci = data['vyucujuci']
        ucebne = data['ucebne']
        asistent = data['asistent']
        rok = session.get('zvolenyRok')
        rocnik = data['rocnik']
        ziaci = data['ziaci']
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        predmet = data['predmet']
        if rocnik == 'None':
            cursor.execute("insert into predmety(zoznam_predmet_id, rocnik_id, skolsky_rok_nazov) values (%s,null, %s)",
                           (predmet, rok,))
        else:
            cursor.execute("select rocnik_id from rocniky where nazov = %s and skolsky_rok_nazov = %s", (rocnik, rok,))
            rocnik = cursor.fetchall()[0][0]
            cursor.execute("insert into predmety(zoznam_predmet_id, rocnik_id, skolsky_rok_nazov) values (%s,%s,%s)",
                            (predmet, rocnik, rok,))
        predmet = cursor.lastrowid

        if len(vyucujuci) > 0:
            cursor.execute("insert into ucitel_predmety VALUES (%s,%s,%s)", (vyucujuci[0], predmet, rok,))
        else:
            cursor.execute("insert into ucitel_predmety VALUES (null,%s,%s)", (predmet, rok,))

        if len(asistent) > 0:
            for item in asistent:
                cursor.execute("insert into asistent_predmety VALUES (%s,%s,%s)", (item, predmet, rok,))
        else:
            cursor.execute("insert into asistent_predmety VALUES (null,%s,%s)", (predmet, rok,))

        if len(ucebne) > 0:
            cursor.execute("insert into predmety_ucebne VALUES (%s,%s,%s)", (predmet, ucebne[0], rok,))
        else:
            cursor.execute("insert into predmety_ucebne VALUES (%s,null,%s)", (predmet, rok,))

        for item in ziaci:
            cursor.execute("insert into ziak_predmety VALUES (%s,%s)", (item, predmet,))

        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)

    def predmety_copyFromLastYear(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.close()
        db.close()
        return jsonify(True)

    def predmety_copyFromLastYearold(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        aktualnyRok = session.get('zvolenyRok')
        aktualnyRok = str(int(aktualnyRok.split("/")[0]) - 1) + "/" + str(int(aktualnyRok.split("/")[1]) - 1)
        cursor.execute(
            "SELECT p.predmet_id, pu.ucebna_id, pu.skolsky_rok_nazov FROM predmety_ucebne pu INNER JOIN predmety p ON pu.predmet_id = p.predmet_id WHERE pu.skolsky_rok_nazov = %s",
            (aktualnyRok,))
        ucebne = cursor.fetchall()
        cursor.execute(
            "SELECT up.ucitel_id, p.predmet_id, up.skolsky_rok_nazov FROM ucitel_predmety up INNER JOIN predmety p ON up.predmet_id = p.predmet_id WHERE up.skolsky_rok_nazov = %s",
            (aktualnyRok,))
        vyucujuci = cursor.fetchall()
        if not ucebne and not vyucujuci:
            cursor.close()
            db.close()
            return jsonify(False)
        cursor.execute("DELETE FROM predmety_ucebne WHERE skolsky_rok_nazov = %s", (session.get('zvolenyRok'),))
        cursor.execute("DELETE FROM ucitel_predmety WHERE skolsky_rok_nazov = %s", (session.get('zvolenyRok'),))
        for item in ucebne:
            cursor.execute("INSERT INTO predmety_ucebne (predmet_id, ucebna_id, skolsky_rok_nazov) VALUES (%s, %s, %s)",
                           (item[0], item[1], session.get('zvolenyRok')))
        for item in vyucujuci:
            cursor.execute("INSERT INTO ucitel_predmety (ucitel_id, predmet_id, skolsky_rok_nazov) VALUES (%s, %s, %s)",
                           (item[0], item[1], session.get('zvolenyRok')))
        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)

    def predmety_getInfo(self):
        data = int(request.json)
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        rok = session.get('zvolenyRok')
        cursor.execute("select predmet_id, nazov from predmety p join zoznam_predmetov zp "
                       "on p.zoznam_predmet_id = zp.zoznam_predmet_id where predmet_id = %s", (data,))
        nazov = cursor.fetchall()[0]
        cursor.execute("select up.ucitel_id, concat(o.meno, ' ', o.priezvisko), p.nazov from ucitel_predmety up "
                       "join osoba o on o.osoba_id = up.ucitel_id left join pozicie p on o.pozicia_id = p.pozicia_id where predmet_id = %s and skolsky_rok_nazov = %s",
                       (data, rok,))
        ucitel = cursor.fetchall()
        cursor.execute("select ap.asistent_id, concat(o.meno, ' ', o.priezvisko), p.nazov from asistent_predmety ap "
                       "join osoba o on o.osoba_id = ap.asistent_id left join pozicie p on o.pozicia_id = p.pozicia_id where predmet_id = %s and skolsky_rok_nazov = %s",
                       (data, rok,))
        asistent = cursor.fetchall()
        cursor.execute(
            "select u.ucebna_id, u.skratka from predmety_ucebne pu join ucebne u on u.ucebna_id = pu.ucebna_id where predmet_id = %s and skolsky_rok_nazov = %s",
            (data, rok,))
        ucebne = cursor.fetchall()
        cursor.execute("select nazov from rocniky left join predmety p on rocniky.rocnik_id = p.rocnik_id where predmet_id = %s", (data,))
        rocnik = cursor.fetchall()
        ziaci = []
        if rocnik:
            cursor.execute("select o.osoba_id, concat(o.meno, ' ', o.priezvisko), r.nazov "
                       "from osoba o left join rocnik_osoba ro on o.osoba_id = ro.osoba_id "
                       "left join ziak_predmety zp on o.osoba_id = zp.ziak_id "
                       "join rocniky r on ro.rocnik_id = r.rocnik_id "
                       "where r.nazov = %s and r.skolsky_rok_nazov = %s and zp.predmet_id = %s", (rocnik[0][0], rok, data,))
            ziaci = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify({'nazov': nazov, 'vyucujuci': ucitel, 'asistent': asistent, 'ucebne': ucebne, 'rocnik': rocnik, 'ziaci': ziaci})

    def predmety_updatePredmet(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        predmet = data['predmet']
        vyucujuci = data['vyucujuci']
        asistent = data['asistent']
        ucebne = data['ucebne']
        rocnik = data['rocnik']
        ziaci = data['ziaci']
        rok = session.get('zvolenyRok')


        if vyucujuci:
            cursor.execute("update ucitel_predmety set ucitel_id = %s where predmet_id = %s", (vyucujuci[0], predmet,))
        else:
            cursor.execute("update ucitel_predmety set ucitel_id = null where predmet_id = %s", (predmet,))

        if ucebne:
            cursor.execute("update rozvrhy set ucebna_id = %s where predmet_id = %s", (ucebne[0], predmet, ))
            cursor.execute("update predmety_ucebne set ucebna_id = %s where predmet_id = %s", (ucebne[0], predmet,))
        else:
            cursor.execute("delete from rozvrhy where predmet_id = %s", (predmet,))
            cursor.execute("update predmety_ucebne set ucebna_id = null where predmet_id = %s", (predmet,))

        if len(asistent) == 0:
            cursor.execute("delete from asistent_predmety where predmet_id = %s", (predmet,))
            cursor.execute("insert into asistent_predmety VALUES (null, %s,%s)", (predmet, rok,))
        else:
            cursor.execute("select asistent_id from asistent_predmety where predmet_id =%s", (predmet,))
            aktualny = [i[0] for i in cursor.fetchall()]
            vymazat = [i for i in aktualny if i not in asistent]
            pridat = [i for i in asistent if i not in aktualny]
            for i in vymazat:
                cursor.execute("delete from asistent_predmety where predmet_id =%s and asistent_id = %s", (predmet, i))
            for i in pridat:
                cursor.execute("insert into asistent_predmety VALUES (%s,%s,%s)", (i, predmet, rok))

        if rocnik == 'None':
            cursor.execute("update predmety set rocnik_id = null where predmet_id =%s", (predmet,))
            cursor.execute("delete from ziak_predmety where predmet_id =%s", (predmet,))
        else:
            cursor.execute("select * from rocniky where nazov = %s and skolsky_rok_nazov= %s", (rocnik, rok,))
            rocnik = cursor.fetchone()[0]
            cursor.execute("update predmety set rocnik_id = %s where predmet_id =%s", (rocnik, predmet,))
            cursor.execute("delete from ziak_predmety where predmet_id =%s", (predmet,))
            for item in ziaci:
                cursor.execute("insert into ziak_predmety VALUES (%s,%s)", (item, predmet,))

        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)

    def predmety_getZiaciRocnik(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        cursor.execute("select o.osoba_id, concat(o.meno, ' ', o.priezvisko), r.nazov from osoba o "
                       "left join rocnik_osoba ro on o.osoba_id = ro.osoba_id "
                       "join rocniky r on ro.rocnik_id = r.rocnik_id "
                       "where r.nazov = %s and r.skolsky_rok_nazov = %s", (data, session.get("zvolenyRok")))
        result = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(result)

    def showUcebne(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(
            "SELECT ucebna_id, nazov, skratka FROM ucebne ")
        result = cursor.fetchall()

        cursor.close()
        db.close()
        return self.base.render_web('/Zoznamy/Ucebne.html', Ucebne=result)

    def ucebne_saveUcebna(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        nazov = data['nazov']
        skratka = data['skratka']
        cursor.execute("select * from ucebne where nazov = %s or skratka = %s", (nazov, skratka,))
        if not cursor.fetchall():
            cursor.execute("insert into ucebne (nazov, skratka) values (%s,%s)", (nazov, skratka,))
            db.commit()
            cursor.close()
            db.close()
            return jsonify(True)

        cursor.close()
        db.close()
        return jsonify(False)

    def ucebne_updateUcebna(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        id = data['id']
        nazov = data['nazov']
        skratka = data['skratka']
        cursor.execute("SELECT * FROM ucebne WHERE (nazov = %s OR skratka = %s) AND ucebna_id != %s", (nazov, skratka, id,))
        if not cursor.fetchall():
            cursor.execute("update ucebne set nazov = %s, skratka = %s where ucebna_id = %s", (nazov, skratka, id,))
            db.commit()
            cursor.close()
            db.close()
            return jsonify(True)

        cursor.close()
        db.close()
        return jsonify(False)

    def ucebne_delUcebna(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        cursor.execute("update predmety_ucebne set ucebna_id = null where ucebna_id = %s ", (data,))
        cursor.execute("update ucebne_triedy set ucebna_id = null where ucebna_id =%s", (data,))
        cursor.execute("delete from ucebne where ucebna_id=%s", (data,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)

    def showRocniky(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select r.rocnik_id, r.nazov, count(ro.osoba_id) from rocniky r "
                       "left join rocnik_osoba ro on r.rocnik_id = ro.rocnik_id where r.skolsky_rok_nazov = %s group by r.rocnik_id, r.nazov",
                       (session.get('zvolenyRok'),))
        result = cursor.fetchall()
        cursor.execute(f"select nazov from pozicie")
        role = cursor.fetchall()
        cursor.close()
        db.close()
        return self.base.render_web('/Zoznamy/Rocniky.html', Rocniky=result, role=role)

    def rocniky_getOsoby(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        rok = session.get('zvolenyRok')
        cursor.execute(
            "SELECT o.osoba_id, concat(o.meno, ' ', o.priezvisko), p.nazov FROM osoba o left join pozicie p on o.pozicia_id = p.pozicia_id "
            "WHERE NOT EXISTS ( SELECT 1 FROM rocnik_osoba ro JOIN rocniky r "
            "ON ro.rocnik_id = r.rocnik_id WHERE r.skolsky_rok_nazov = %s "
            "AND o.osoba_id = ro.osoba_id ) OR EXISTS ( SELECT 1 FROM rocnik_osoba ro "
            "JOIN rocniky r ON ro.rocnik_id = r.rocnik_id WHERE r.rocnik_id = %s "
            "AND o.osoba_id = ro.osoba_id AND r.skolsky_rok_nazov = %s)", (rok, data, rok))
        result = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(result)

    def rocniky_saveRocnik(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        cursor.execute("select * from rocniky where nazov = %s and skolsky_rok_nazov = %s",
                       (data['nazov'], session.get('zvolenyRok'),))
        if not cursor.fetchall():
            cursor.execute("insert into rocniky(nazov, skolsky_rok_nazov) values (%s, %s)",
                           (data['nazov'], session.get('zvolenyRok'),))
            id = cursor.lastrowid
            for item in data['ziaci']:
                cursor.execute("insert into rocnik_osoba values(%s, %s)", (id, item))
            db.commit()
            cursor.close()
            db.close()
            return jsonify(True)
        cursor.close()
        db.close()
        return jsonify(False)

    def rocniky_updateRocnik(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        cursor.execute("select * from rocniky where nazov = %s and skolsky_rok_nazov = %s",
                       (data['nazov'], session.get('zvolenyRok'),))
        result = cursor.fetchall()
        for item in result:
            if item[0] == int(data['id']):
                cursor.execute("update rocniky set nazov = %s where rocnik_id = %s", (data['nazov'], data['id'],))
                cursor.execute("delete from rocnik_osoba where rocnik_id = %s", (data['id'],))
                for osoba in data['ziaci']:
                    cursor.execute("insert into rocnik_osoba values(%s, %s)", (data['id'], osoba,))
                db.commit()
                cursor.close()
                db.close()
                return jsonify(True)
        cursor.close()
        db.close()
        return jsonify(False)

    def rocniky_getOsobyRocniku(self):
        data = request.json
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select o.osoba_id, concat(o.meno, ' ', o.priezvisko) from osoba o "
                       "join rocnik_osoba ro on o.osoba_id = ro.osoba_id join rocniky r "
                       "on r.rocnik_id = ro.rocnik_id "
                       "where r.rocnik_id = %s "
                       "and r.skolsky_rok_nazov = %s", (data, session.get('zvolenyRok'),))
        result = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(result)

    def rocniky_delRocnik(self):
        data = request.json
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("delete from rocnik_osoba where rocnik_id = %s", (data,))
        cursor.execute("delete from rocniky where rocnik_id = %s", (data,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)

    def rocniky_getMinulyRocnik(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        skolskeRoky = self.sql.skolskeRoky()
        rok = session.get('zvolenyRok')
        for index in range(len(skolskeRoky)):
            if skolskeRoky[index][0] == rok:
                if len(skolskeRoky) - 1 >= index + 1:
                    cursor.execute("select * from rocniky where skolsky_rok_nazov =%s", (skolskeRoky[index + 1][0],))
                    result = cursor.fetchall()
                    cursor.close()
                    db.close()
                    return jsonify({'rok': True, 'rocniky': result})
        cursor.close()
        db.close()
        return jsonify({'rok': False})

    def rocniky_copyMinulyRocnik(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        noveNazvy = data.get('noveNazvy')
        rok = session.get('zvolenyRok')
        for id, nazov in noveNazvy.items():
            cursor.execute("select osoba_id from rocnik_osoba where rocnik_id = %s", (id,))
            result = cursor.fetchall()
            cursor.execute("insert into rocniky(nazov, skolsky_rok_nazov) values (%s, %s)", (nazov, rok))
            id = cursor.lastrowid
            for item in result:
                cursor.execute("insert into rocnik_osoba values (%s, %s)", (id, item[0],))
        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)
