from flask import request, jsonify, session
import mysql.connector


class Oznamenie():
    def __init__(self, Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.adress = self.base.getSQLadress()
        self.routing_Oznamenie()

    def routing_Oznamenie(self):
        self.app.route('/Oznamenie')(self.base.check_token()(self.base.check_permission([])(self.showOznamenie)))
        self.app.route('/Oznamenie/delSpravu', methods=['POST'])(self.base.check_token()(self.base.check_permission([43])(self.oznamenie_delSpravu)))

    def showOznamenie(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        id = session.get('zvelenyView')
        cursor.execute("select oznamenie_id, datum, sprava from oznamenia where osoba_id = %s order by datum desc", (id,))
        result = []
        for i in cursor.fetchall():
            datum = str(i[1]).split(' ')[0].split('-')
            datum = datum[2] + '-' + datum[1] + '-' + datum[0] + ' ' + str(i[1]).split(' ')[1]
            result.append([i[0], datum, i[2]])
        cursor.execute("select distinct convert(datum, date) from oznamenia where osoba_id = %s order by convert(datum, date) desc",
                       (id,))
        datumy = []
        for i in cursor.fetchall():
            datum = str(i[0]).split(' ')[0].split('-')
            datum = datum[2] + '-' + datum[1] + '-' + datum[0]
            datumy.append(datum)

        cursor.close()
        db.close()
        return self.base.render_web("Oznamenia.html", result=result, datumy=datumy)

    def oznamenie_delSpravu(self):
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        data = request.json
        for i in data:
            cursor.execute("delete from oznamenia where oznamenie_id = %s", (i,))
        db.commit()
        cursor.close()
        db.close()
        return jsonify(True)

