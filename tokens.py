import hashlib
import json
import os
import time
import mysql.connector


class Tokens:
    def __init__(self, sqlAddressConncet):
        self.adress = sqlAddressConncet
        self.zoznamTokenov = {}
        self.zoznam_prav = {}
        self.nacitajPrava()
        self.nacitajPrava_Pozicie()
        try:
            with open('zoznam_tokenov.json', 'r') as file:
                self.zoznamTokenov = json.load(file)
        except:
            pass


    """
        Načíta všetky oprávnenia z tabuľky 'opravnenia' a ukladá ich do slovníka,
        kde kľúčom je názov oprávnenia a hodnotou je príslušné ID oprávnenia.
    """
    def nacitajPrava(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("Select * from opravnenia")
        zoznam = cursor.fetchall()
        for item in zoznam:
            self.zoznam_prav[item[1]] = item[0]
        cursor.close()
        db.close()

    """
        Načíta mapovanie oprávnení na pozície z tabuľky 'opravnenia_pozicie' a ukladá
        výsledky do atribútu triedy pre ďalšie použitie.
    """
    def nacitajPrava_Pozicie(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select * from opravnenia_pozicie")
        self.all = cursor.fetchall()
        cursor.close()
        db.close()

    """
        Vytvorí bezpečnostný token pre užívateľa s použitím jeho ID, aktuálneho času
        a náhodného reťazca. Token je hashovaný pomocou SHA-256. Vytvorený token sa uloží
        do slovníka s priradeným ID užívateľa.

        Parametre:
            id (int): Jedinečné ID užívateľa.

        Vracia:
            str: Hashovaný bezpečnostný token.
    """
    def vytvorToken(self, id):
        random_str = os.urandom(16).hex()
        token = hashlib.sha256(f"{id}{time.time()}{random_str}".encode()).hexdigest()
        self.zoznamTokenov[token] = id
        with open('zoznam_tokenov.json', 'w') as file:
            json.dump(self.zoznamTokenov, file)
        return token

    """
        Získa zoznam osôb a ich príslušných práv z databázy pre špecifikovanú pozíciu.
        Výsledky zahŕňajú osoba_id, meno, priezvisko a pozicia_id tých, ktorí majú priradenú
        danú pozíciu, alebo ktorých pozícia nie je určená.

        Parametre:
            pozicia (str): Názov pozície, pre ktorú sa majú získať údaje.

        Vracia:
            list: Zoznam tuples obsahujúci informácie o osobách a ich pozíciách.
    """
    def odstranToken(self, token):
        self.zoznamTokenov.pop(token)

    def dajOsobyaPrava(self, poziciaid):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"select osoba_id, meno, priezvisko, o.pozicia_id from osoba o "
                       f"left join pokus.pozicie p on o.pozicia_id = p.pozicia_id "
                       f"where p.pozicia_id = '{poziciaid}' or o.pozicia_id is null")
        resoult = cursor.fetchall()
        cursor.close()
        db.close()
        return resoult

    """
        Priradí alebo odoberie pozíciu špecifikovaným osobám v databáze.
        Najprv získa ID pozície podľa názvu pozície. Potom pre každú osobu v zozname
        aktualizuje ich pozíciu v databáze na danú pozíciu, ak je začiarknuté 'checked',
        alebo nastaví pozíciu na NULL, ak nie je.

        Parametre:
            poziciaNazov (str): Názov pozície, ku ktorej sa osoby priraďujú alebo od nej odoberajú.
            zoznamOsob (list): Zoznam osôb (so slovníkovými údajmi), ktoré sa majú aktualizovať.
    """
    def ulozOsobykPoziciam(self, id, zoznamOsob):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        for item in zoznamOsob:
            if item['checked']:
                cursor.execute(f"update osoba set pozicia_id = '{id}' where osoba_id = '{item['id']}'")
            else:
                cursor.execute(f"update osoba set pozicia_id = NULL where osoba_id = '{item['id']}'")
        db.commit()
        cursor.close()
        db.close()

    """
        Získa zoznam oprávnení priradených k určitej pozícii.
        Vykonáva SQL dotaz, ktorý spojí tabuľky 'opravnenia_pozicie', 'opravnenia' a 'pozicie'
        a vráti názvy oprávnení pre danú pozíciu.

        Parametre:
            pozicie (str): Názov pozície, pre ktorú sa majú získať oprávnenia.

        Vracia:
            list: Zoznam tuples s názvami oprávnení priradených k danej pozícii.
    """
    def dajOpraveniaPodlaPozicie(self, pozicie):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"select o.nazov from opravnenia_pozicie op "
                            f"join opravnenia o on o.opravnenie_id = op.Opravnenia_id "
                            f"join pokus.pozicie p on p.pozicia_id = op.pozicia_id "
                            f"where p.pozicia_id ='{pozicie}'")
        resoult = cursor.fetchall()
        cursor.close()
        db.close()
        return resoult

    """
        Overí, či má užívateľ s daným tokenom potrebné oprávnenie podľa názvu.
        Získa ID užívateľa z tokenom priradeného v slovníku, vyhľadá jeho pozíciu
        a porovná, či užívateľova pozícia má priradené požadované oprávnenie.

        Parametre:
            token_ (str): Bezpečnostný token užívateľa.
            nazov (str): Názov oprávnenia na overenie.

        Vracia:
            bool: True, ak užívateľ má dané oprávnenie, inak False.
    """
    def potrebneOpravnenieNazov(self, token_, nazov):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        id = self.zoznamTokenov.get(token_)
        cursor.execute(f"select pozicia_id from osoba where osoba_id ={id}")
        pozicia = cursor.fetchone()[0]
        cursor.close()
        db.close()
        for item in self.all:
            if item == (pozicia, self.zoznam_prav.get(nazov)):
                return True
        return False

    """
        Overí existenciu a platnosť poskytnutého tokena.
        Skontroluje, či zadaný token je v slovníku 'zoznamTokenov' a vráti True,
        ak sa token nachádza v slovníku (teda je platný), inak vráti False.

        Parametre:
            token_ (str): Token na overenie.

        Vracia:
            bool: True, ak je token platný, inak False.
    """
    def overToken(self, token_):
        id = self.zoznamTokenov.get(token_)
        if id is None:
            return False
        return True

    """
        Získa a vráti celé meno užívateľa na základe jeho bezpečnostného tokenu.
        Vykoná dopyt v databáze pre získanie mena a priezviska a spojí ich do jedného reťazca.

        Parametre:
            token_ (str): Bezpečnostný token užívateľa.

        Vracia:
            str: Celé meno užívateľa alebo None, ak dopyt zlyhá.
    """
    def getName(self, token_):
        try:
            db = mysql.connector.connect(**self.adress)
            cursor = db.cursor()
            id = self.zoznamTokenov.get(token_)
            cursor.execute(f"SELECT meno, priezvisko FROM osoba WHERE osoba_id = '{id}'")
            result = cursor.fetchone()
            cursor.close()
            db.close()
            return result[0] + " " + result[1]
        except:
            pass

    """
        Vráti ID užívateľa priradené k danému bezpečnostnému tokenu.

        Parametre:
            token_ (str): Bezpečnostný token užívateľa.

        Vracia:
            int: ID užívateľa alebo None, ak token nie je v slovníku.
    """
    def getID(self, token_):
        try:
            return self.zoznamTokenov.get(token_)
        except:
            pass

    """
        Získa a vráti zoznam oprávnení užívateľa na základe jeho tokenu.
        Najskôr získava pozíciu užívateľa podľa ID v slovníku tokenov, potom
        vykonáva dopyt na získanie všetkých oprávnení priradených k tejto pozícii.

        Parametre:
            token_ (str): Bezpečnostný token užívateľa.

        Vracia:
            list: Zoznam názvov oprávnení užívateľa.
    """
    def get_user_permission(self, token_):
        try:
            db = mysql.connector.connect(**self.adress)
            cursor = db.cursor()
            id = self.zoznamTokenov.get(token_)
            cursor.execute(f"SELECT pozicia_id FROM osoba WHERE osoba_id = '{id}'")
            result = cursor.fetchone()[0]
            cursor.execute(f"SELECT opravnenia.nazov FROM opravnenia "
                                f"JOIN opravnenia_pozicie ON opravnenia.opravnenie_id = opravnenia_pozicie.Opravnenia_id "
                                f"WHERE opravnenia_pozicie.pozicia_id = '{result}'")
            result = [item[0] for item in cursor.fetchall()]
            cursor.close()
            db.close()
            return result
        except:
            pass
