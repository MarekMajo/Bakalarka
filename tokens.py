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
        try:
            with open('zoznam_tokenov.json', 'r') as file:
                self.zoznamTokenov = json.load(file)
        except:
            pass
    def nacitajPrava(self):
        self.zoznam_prav.clear()
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select p.pozicia_id, o.opravnenie_id from pozicie p "
                       "left join opravnenia_pozicie op on p.pozicia_id = op.pozicia_id "
                       "left join opravnenia o on op.Opravnenia_id = o.opravnenie_id")
        for item in cursor.fetchall():
            if item[0] in self.zoznam_prav:
                self.zoznam_prav[item[0]].append(item[1])
            else:
                self.zoznam_prav[item[0]] = [item[1]]
        self.zoznam_prav[None] = []
        for key, value in self.zoznam_prav.items():
            if value == [None]:
                self.zoznam_prav[key] = []
        cursor.close()
        db.close()

    def vytvorToken(self, id):
        random_str = os.urandom(16).hex()
        token = hashlib.sha256(f"{id}{time.time()}{random_str}".encode()).hexdigest()
        self.zoznamTokenov[token] = id
        with open('zoznam_tokenov.json', 'w') as file:
            json.dump(self.zoznamTokenov, file)
        return token

    def odstranToken(self, token):
        self.zoznamTokenov.pop(token)
        with open('zoznam_tokenov.json', 'w') as file:
            json.dump(self.zoznamTokenov, file)

    def dajOpraveniaPodlaPozicie(self, pozicie):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select o.opravnenie_id from opravnenia_pozicie op "
                            "join opravnenia o on o.opravnenie_id = op.Opravnenia_id "
                            "join pokus.pozicie p on p.pozicia_id = op.pozicia_id "
                            "where p.pozicia_id =%s", (pozicie, ))
        resoult = cursor.fetchall()
        cursor.close()
        db.close()
        return resoult


    def overToken(self, token_):
        id = self.zoznamTokenov.get(token_)
        if id is None:
            return False
        return True


    def getName(self, token_):
        try:
            db = mysql.connector.connect(**self.adress)
            cursor = db.cursor()
            id = self.zoznamTokenov.get(token_)
            cursor.execute("SELECT meno, priezvisko FROM osoba WHERE osoba_id = %s", (id,))
            result = cursor.fetchone()
            cursor.close()
            db.close()
            return result[0] + " " + result[1]
        except:
            pass


    def getID(self, token_):
        try:
            return self.zoznamTokenov.get(token_)
        except:
            pass


    def get_user_permission(self, token_):
        try:
            db = mysql.connector.connect(**self.adress)
            cursor = db.cursor()
            id = self.zoznamTokenov.get(token_)
            cursor.execute("SELECT pozicia_id FROM osoba WHERE osoba_id = %s", (id,))
            return self.zoznam_prav[cursor.fetchall()[0][0]]
        except:
            pass
