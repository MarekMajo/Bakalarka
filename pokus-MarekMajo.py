from flask import request, jsonify


class Pokus():
    def __init__(self,Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.routing_pokus()

    def routing_pokus(self):
        self.app.route('/pokus')(self.base.check_token()(self.base.check_permission(['Zobraz pokus'])(self.pokusPozicie)))
        self.app.route('/pokus/getOpravneniaAll', methods=['GET'])(self.base.check_token()(self.base.check_permission(['Zobraz pokus'])(self.pokusget_opravneniaAll)))
        self.app.route('/pokus/getOpravneniaPozicie', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Zobraz pokus'])(self.pokusgetOpravneniaPozicie)))
        self.app.route('/pokus/vytvorRolu', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Zobraz pokus'])(self.vytvorRolu)))
        self.app.route('/pokus/updateRolu', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Zobraz pokus'])(self.updateRolu)))
        self.app.route('/pokus/dellRolu', methods=['POST'])(self.base.check_token()(self.base.check_permission(['Zobraz pokus'])(self.dellRolu)))


    def pokusPozicie(self):
        return self.base.render_web('pokus.html', prava=self.sql.getPozicie(), role=self.sql.getKategorie())

    def pokusget_opravneniaAll(self):
        opravnenia = self.sql.getOpravneniaAll()
        #print(opravnenia)
        return jsonify(opravnenia)

    def pokusgetOpravneniaPozicie(self):
        data = request.json
        vysledok = self.token.dajOpraveniaPodlaPozicie(data['rolaid'])
        #print(vysledok)
        return jsonify(vysledok)

    def vytvorRolu(self):
        pass

    def updateRolu(self):
        id = request.json['id']
        data = request.json['opravnenia']
        print(id)
        print(data)
        return jsonify({'result': True})

    def dellRolu(self):
        pass