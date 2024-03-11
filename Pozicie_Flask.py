from flask import request, jsonify


class PositionsServer():
    def __init__(self,Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.routing_pozicie()

    def routing_pozicie(self):
        self.app.route('/pozicie')(self.base.check_token()(self.base.check_permission(['Zobraz pokus'])(self.pokusPozicie)))
        self.app.route('/getOpravneniaAll', methods=['GET'])(self.base.check_token()(self.base.check_permission(['Zobraz pokus'])(self.pokusget_opravneniaAll)))
        self.app.route('/getOpravneniaPozicie', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Zobraz pokus'])(self.pokusgetOpravneniaPozicie)))
        self.app.route('/vytvorRolu', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Zobraz pokus'])(self.vytvorRolu)))
        self.app.route('/updateRolu', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Zobraz pokus'])(self.updateRolu)))
        self.app.route('/dellRolu', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Zobraz pokus'])(self.dellRolu)))

    def pokusPozicie(self):
        return self.base.render_web('pozicie.html', prava=self.sql.getPozicie(), role=self.sql.getKategorie())

    def pokusget_opravneniaAll(self):
        opravnenia = self.sql.getOpravneniaAll()
        return jsonify(opravnenia)

    def pokusgetOpravneniaPozicie(self):
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
        self.sql.ulozNovePozicie(request.json['id'], request.json['opravnenia'])
        return jsonify({'result': True})

    def dellRolu(self):
        self.sql.odstranPoziciu(int(request.json['id']))
        return jsonify({'result': True})
