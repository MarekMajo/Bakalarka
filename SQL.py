import mysql.connector


class My_sql:
    def __init__(self, sqlAddressConncet):
        self.adress = sqlAddressConncet

    """
    Metóda ktorá vráti výsledok z databázy pri Prezeraní tabuľky: 'prihlasovacie_udaje'
    """
    def check_login(self, username, password):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"SELECT * FROM prihlasovacie_udaje WHERE (pr_meno = '{username}' OR login_id = '{username}') AND pr_heslo = '{password}'")
        resoult = cursor.fetchone()
        cursor.close()
        db.close()
        return resoult

    """
    Metóda ktorá vráti výsledok z databázy pri Prezeraní tabuľky: 'pozicie'
    Tabuľka 'pozicie' zodpovedá na zachovávanie údajov o pozície užívateľa v systéme (Admin, učiteľ, a atd)
    """
    def getPozicie(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select * from pozicie")
        resoult = cursor.fetchall()
        cursor.close()
        db.close()
        return resoult

    def getKategorie(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"select kategoria from opravnenia group by kategoria")
        resoult = cursor.fetchall()
        cursor.close()
        db.close()
        return resoult
    def getOpravneniaAll(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"select * from opravnenia")
        resoult = cursor.fetchall()
        cursor.close()
        db.close()
        return resoult

    """
    Metóda, ktorá vráti výsledok z databázy pri prezeraní tabuľky: 'opravnenia'
    Tabuľka 'opravnenia' slúži na uchovávanie informácií o oprávneniach užívateľov v systéme.
    Obsahuje informácie o rôznych oprávneniach, ako sú 'Zobrazenie pozícií',
    'Editácia osobných informácií', 'Zoznam používateľov' a atd.
    """
    def getOpravneniaNazov(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"select nazov from opravnenia")
        resoult = cursor.fetchall()
        cursor.close()
        db.close()
        return resoult

    """
        Metóda zisťuje, či existuje záznam s daným názvom pozície v tabuľke 'pozicie'.
        Pripája sa k databáze, vykonáva SQL dotaz na získanie názvov pozícií, ktoré zodpovedajú
        zadanému názvu a vráti True, ak takýto záznam existuje, inak vráti False.

        Parametre:
            nazov (str): Názov pozície, ktorý sa má overiť v databáze.

        Vracia:
            bool: True, ak záznam s daným názvom pozície existuje v tabuľke 'pozicie', inak False.
    """

    def existujePozicia(self, nazov):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"select nazov from pozicie where nazov = '{nazov}'")
        resoult = cursor.fetchall()
        cursor.close()
        db.close()
        if resoult: return True
        else: return False

    """
    Pridá novú pozíciu s priradenými oprávneniami do databázy.
    Vloží názov pozície do 'pozicie', získava jej ID a priraďuje oprávnenia
    do 'opravnenia_pozicie'. Vyžaduje kontrolu unikátnosti názvu pozície.

    Parametre:
        nazov (str): Názov pozície.
        opravnenia (list): Zoznam oprávnení pre pozíciu.
    """
    def pridajPoziciuOld(self, nazov, opravnenia):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"select * from opravnenia")
        zoznam = cursor.fetchall()
        cursor.execute(f"INSERT INTO pozicie (nazov)VALUES ('{nazov}')")
        cursor.execute(f"select pozicia_id from pozicie where nazov = '{nazov}'")
        cislo = cursor.fetchall()[0][0]
        print(opravnenia)
        for item in zoznam:
            if item[1] in opravnenia:
                cursor.execute(f"INSERT INTO opravnenia_pozicie (pozicia_id, Opravnenia_id)VALUES ({cislo}, {item[0]})")
        db.commit()
        cursor.close()
        db.close()

    def pridajPoziciu(self, nazov, opravnenia):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"INSERT INTO pozicie (nazov)VALUES ('{nazov}')")
        if len(opravnenia) > 0:
            cursor.execute(f"select * from opravnenia")
            zoznam = cursor.fetchall()
            cursor.execute(f"select pozicia_id from pozicie where nazov = '{nazov}'")
            cislo = cursor.fetchall()[0][0]
            vypis = [polozka for polozka in zoznam if polozka[1] in {x[0] for x in opravnenia}]
            for item in vypis:
                cursor.execute(f"INSERT INTO opravnenia_pozicie (pozicia_id, Opravnenia_id)VALUES ({cislo}, {item[0]})")
        db.commit()
        cursor.close()
        db.close()

    """
        Odstráni pozíciu a jej oprávnenia z databázy podľa zadaného názvu.
        Najprv vyhľadá pozíciu v 'pozicie' a následne vymaže všetky súvisiace
        záznamy v 'opravnenia_pozicie' a 'pozicie'.

        Parametre:
            nazov (str): Názov pozície na odstránenie.
    """

    def odstranPoziciu(self, nazov):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        zoznam = self.getPozicie()
        for item in zoznam:
            if nazov in item:
                cursor.execute(f"update osoba set pozicia_id = null where pozicia_id = '{item[0]}'")
                cursor.execute(f"DELETE from opravnenia_pozicie where pozicia_id = '{item[0]}'")
                cursor.execute(f"DELETE from pozicie where pozicia_id = '{item[0]}'")
                db.commit(),

        cursor.close()
        db.close()

    """
        Aktualizuje oprávnenia pre existujúcu pozíciu v databáze.
        Najskôr odstráni všetky aktuálne priradené oprávnenia pre danú pozíciu,
        potom pridá nové oprávnenia z poskytnutého zoznamu.

        Parametre:
            pozicia (str): Názov pozície, ktorej oprávnenia sa majú aktualizovať.
            opravnenia (list): Zoznam oprávnení na priradenie k pozícii.
    """

    def ulozNovePozicie(self,id, opravnenia):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"select * from opravnenia")
        zoznam = cursor.fetchall()
        cursor.execute(f"delete from opravnenia_pozicie where pozicia_id = '{id}'")
        db.commit()
        if len(opravnenia) != 0:
            opravneniaid = list()
            for item in zoznam:
                if item[1] in opravnenia:
                    opravneniaid.append(item[0])
            for item in opravneniaid:
                cursor.execute(f"INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES ('{id}', '{item}')")
            db.commit()

        cursor.close()
        db.close()

    def skolskeRoky(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("SELECT a.nazov FROM skolske_roky a JOIN skolske_roky b ON a.nazov = b.nazov AND a.polrok < b.polrok order by nazov DESC")
        zoznam = cursor.fetchall()
        cursor.close()
        db.close()
        return zoznam