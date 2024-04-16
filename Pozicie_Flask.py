import mysql.connector
from flask import request, jsonify


class Pozicie():
    def __init__(self, Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.adress = self.base.getSQLadress()
        self.routing_pozicie()

    def routing_pozicie(self):
        self.app.route('/pozicie')(self.base.check_token()(self.base.check_permission([1])(self.showPozicie)))
        self.app.route('/getOpravneniaAll', methods=['GET'])(self.base.check_token()(self.base.check_permission([1])(self.get_opravneniaAll)))
        self.app.route('/getOpravneniaPozicie', methods=['POST'])(self.base.check_token()(self.base.check_permission([1])(self.getOpravneniaPozicie)))
        self.app.route('/vytvorRolu', methods=['POST'])(self.base.check_token()(self.base.check_permission([1])(self.vytvorRolu)))
        self.app.route('/updateRolu', methods=['POST'])(self.base.check_token()(self.base.check_permission([1])(self.updateRolu)))
        self.app.route('/dellRolu', methods=['POST'])(self.base.check_token()(self.base.check_permission([1])(self.dellRolu)))

    def showPozicie(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select kategoria from opravnenia group by kategoria")
        result = cursor.fetchall()
        cursor.close()
        db.close()
        return self.base.render_web('pozicie.html', prava=self.sql.getPozicie(), role=result)

    def get_opravneniaAll(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select * from opravnenia")
        result = cursor.fetchall()
        cursor.close()
        db.close()
        return jsonify(result)

    def getOpravneniaPozicie(self):
        data = request.json
        vysledok = self.token.dajOpraveniaPodlaPozicie(data['rolaid'])
        return jsonify(vysledok)

    def vytvorRolu(self):
        nazov = request.json['nazov']
        copy = request.json['copy']
        if not self.sql.existujePozicia(nazov):
            if copy != "None":
                self.sql.pridajPoziciu(nazov, self.token.dajOpraveniaPodlaPozicie(copy))
            else:
                self.sql.pridajPoziciu(nazov, [])
            return jsonify({'result': False})
        else:
            return jsonify({'result': True})

    def updateRolu(self):
        self.sql.updatePozicie(request.json['id'], request.json['opravnenia'])
        self.token.nacitajPrava()
        return jsonify(True)

    def dellRolu(self):
        self.sql.odstranPoziciu(int(request.json['id']))
        return jsonify({'result': True})
