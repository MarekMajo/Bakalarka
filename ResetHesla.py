import random

from datetime import datetime, timedelta
from flask import request, render_template, redirect, url_for, session
import mysql.connector


class ResetHesla():
    def __init__(self,Base):
        self.base = Base
        self.token = self.base.getToken()
        self.app = self.base.getApp()
        self.sql = self.base.getSQL()
        self.adress = self.base.getSQLadress()
        self.routing_ResetHesla()
        self.mailserver = self.base.getMailServer()
        self.resetCode = {}

    def routing_ResetHesla(self):
        self.app.route('/reset')(self.reset)
        self.app.route('/Obnovenie_Hesla', methods=['POST'])(self.Obnovenie_Hesla)
        self.app.route('/postKod', methods=['POST'])(self.postKod)
        self.app.route('/noveHeslo', methods=['POST'])(self.noveHeslo)

    def reset(self):
        return render_template("resetHesla.html", reset=0)

    def Obnovenie_Hesla(self):
        id = request.form['id']
        email = request.form['email']
        db = mysql.connector.connect(**self.adress)
        cursor = db.cursor()
        cursor.execute(f"SELECT * FROM osoba WHERE osoba_id = '{id}' AND email = '{email}'")
        resoult = cursor.fetchone()
        cursor.close()
        db.close()
        if resoult:
            numbers = random.randint(100000, 999999)
            self.resetCode[id] = {'code': numbers, 'timestamp': datetime.now()}
            self.mailserver.sendResetPasswordMail(email, numbers)
            return render_template("resetHesla.html", reset=1, id=id, email=email)
        else:
            return render_template("resetHesla.html", reset=0, id=id, email=email, error=True)

    def postKod(self):
        id = request.form['id']
        email = request.form['email']
        try:
            kod = ""
            current_time = datetime.now()
            for i in range(6):
                kod += request.form["kod" + str(i)]
            if (self.resetCode.get(id, {}).get('code') == int(kod) and
                    current_time <= self.resetCode[id]['timestamp'] + timedelta(minutes=10)):
                token = self.token.vytvorToken(id)
                session['token'] = token
                return render_template("resetHesla.html", reset=2, token=token)
            else:
                return render_template("resetHesla.html", reset=1, id=id, email=email, error=True)
        except:
            pass

    def noveHeslo(self):
        noveheslo = request.form['noveheslo']
        opaknoveheslo = request.form['opaknoveheslo']
        token = session.get("token")
        if noveheslo == opaknoveheslo:
            id = self.token.getID(token)
            self.token.odstranToken(token)
            session.clear()
            db = mysql.connector.connect(**self.adress)
            cursor = db.cursor()
            cursor.execute(f"update prihlasovacie_udaje set pr_heslo = '{noveheslo}' where login_id = '{id}'")
            db.commit()
            cursor.close()
            db.close()
            return redirect(url_for('index'))
        else:
            return render_template("resetHesla.html", reset=2, token=token, error=True)


