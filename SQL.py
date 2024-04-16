import mysql.connector


class My_sql:
    def __init__(self, sqlAddressConncet):
        self.adress = sqlAddressConncet
        self.skolskeroky_uzavierka = []
        self.skolskerokyByPolrok_uzavierka = []
        self.getUzavierkaSkolskyRokov()

    def check_login(self, username, password):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("SELECT * FROM prihlasovacie_udaje WHERE (pr_meno = %s OR login_id = %s) "
                       "AND pr_heslo = %s", (username, username, password))
        resoult = cursor.fetchone()
        cursor.close()
        db.close()
        return resoult

    def getPozicie(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select * from pozicie")
        resoult = cursor.fetchall()
        cursor.close()
        db.close()
        return resoult

    def existujePozicia(self, nazov):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select nazov from pozicie where nazov = %s", (nazov,))
        resoult = cursor.fetchall()
        cursor.close()
        db.close()
        if resoult:
            return True
        else:
            return False

    def pridajPoziciu(self, nazov, opravnenia):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select opravnenie_id from opravnenia")
        zoznam = [int(zoznam[0]) for zoznam in cursor.fetchall()]
        cursor.execute("INSERT INTO pozicie (nazov)VALUES (%s)", (nazov,))
        if len(opravnenia) > 0:
            cislo = cursor.lastrowid
            opravnenia = [int(opravnenie[0]) for opravnenie in opravnenia]
            vypis = [opravnenie for opravnenie in opravnenia if opravnenie in zoznam ]
            for item in vypis:
                cursor.execute("INSERT INTO opravnenia_pozicie (pozicia_id, Opravnenia_id)"
                               "VALUES (%s, %s)", (cislo, item,))
        db.commit()
        cursor.close()
        db.close()

    def odstranPoziciu(self, nazov):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        zoznam = self.getPozicie()
        for item in zoznam:
            if nazov in item:
                cursor.execute("update osoba set pozicia_id = null where pozicia_id = %s", (item[0],))
                cursor.execute("DELETE from opravnenia_pozicie where pozicia_id = %s", (item[0],))
                cursor.execute("DELETE from pozicie where pozicia_id = %s", (item[0],))
                db.commit(),

        cursor.close()
        db.close()

    def updatePozicie(self, id, opravnenia):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("delete from opravnenia_pozicie where pozicia_id = %s", (id,))
        for item in opravnenia:
            cursor.execute("INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (%s, %s)",
                           (id, item,))
        db.commit()
        cursor.close()
        db.close()

    def skolskeRoky(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(
            "SELECT a.nazov FROM skolske_roky a JOIN skolske_roky b "
            "ON a.nazov = b.nazov AND a.polrok < b.polrok order by nazov DESC")
        zoznam = cursor.fetchall()
        cursor.close()
        db.close()
        return zoznam

    def getUzavierkaSkolskyRokov(self):
        self.skolskerokyByPolrok_uzavierka.clear()
        self.skolskeroky_uzavierka.clear()
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("SELECT nazov, polrok, uzatvoreny FROM skolske_roky ")
        data = {}
        vysledok = cursor.fetchall()
        for rok, polrok, uzatvorenie in vysledok:
            if rok not in data:
                data[rok] = []
            data[rok].append(uzatvorenie)
            self.skolskerokyByPolrok_uzavierka.append((rok, polrok, uzatvorenie))
        for rok, uzatvorenia in data.items():
            if all(u is None for u in uzatvorenia):
                self.skolskeroky_uzavierka.append((rok, None))
            elif any(u is None for u in uzatvorenia):
                self.skolskeroky_uzavierka.append((rok, None))
            else:
                self.skolskeroky_uzavierka.append((rok, 1))
        cursor.close()
        db.close()

    def uzatvorenyRok(self, rok):
        for i in self.skolskeroky_uzavierka:
            if i[0] == rok:
                if i[1] is None:
                    return 1
                else:
                    return None

    def uzatvorenyRokByPolrok(self, rok, polrok):
        for i in self.skolskerokyByPolrok_uzavierka:
            if i[0] == rok and i[1] == polrok:
                if i[2] is None:
                    return 1
                else:
                    return None

    def getChild(self, id):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        ucitel = False
        cursor.execute("select * from osoba o join opravnenia_pozicie op on o.pozicia_id = op.pozicia_id "
                       "join pokus.opravnenia o2 on op.Opravnenia_id = o2.opravnenie_id "
                       "where osoba_id = %s and opravnenie_id = 9", (id,))
        if cursor.fetchall():
            ucitel = True

        cursor.execute("SELECT o.osoba_id, CONCAT(o.meno, ' ', o.priezvisko) "
                       "FROM osoba o JOIN  rodic_deti rd ON o.osoba_id = rd.Ziak_id "
                       "WHERE rd.Rodic_id = %s", (id,))
        ziaci = []
        for i in cursor.fetchall():
            ziaci.append((str(i[0]), i[1]))
        cursor.close()
        db.close()
        return {'ucitel': ucitel, 'ziaci': ziaci}
