from flask import request, jsonify
import mysql.connector

class Pokus():
    def __init__(self,Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.adress = self.base.getSQLadress()
        self.routing_pokus()

    def routing_pokus(self):
        self.app.route('/pokus')(self.base.check_token()(self.base.check_permission([])(self.pokus)))

    def pokus(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute("select p.predmet_id, p.nazov, p.skratka, u.nazov, u.skratka "
                       "from predmety p left join predmety_ucebne pu on p.predmet_id = pu.predmet_id "
                       "left join pokus.ucebne u on u.ucebna_id = pu.ucebna_id")
        resoult = cursor.fetchall()
        cursor.close()
        db.close()
        return self.base.render_web('/Zoznamy/Predmety.html', predmety=resoult)
