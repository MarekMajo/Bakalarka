from functools import wraps

from flask import Flask, render_template, request, redirect, url_for, session, jsonify

from SQL import My_sql
from tokens import Tokens

from MailSender import MailSender


class BaseServer:
    def __init__(self, sqlAddressConncet):
        self.adress = sqlAddressConncet
        self.sql = My_sql(sqlAddressConncet)
        self.app = Flask(__name__)
        self.token = Tokens(sqlAddressConncet)
        self.app.secret_key = 'pokus'
        self.mailserver = MailSender()
        self.routing()

    def getMailServer(self):
        return self.mailserver

    def getToken(self):
        return self.token

    def getSQL(self):
        return self.sql

    def getSQLadress(self):
        return self.adress

    def getApp(self):
        return self.app

    def routing(self):
        self.app.route('/')(self.index)
        self.app.route('/login')(self.Login)
        self.app.route('/login', methods=['POST'])(self.login)
        self.app.route('/dashboard')(self.check_token()(self.dashboard))
        self.app.route('/logout')(self.logout)
        self.app.route('/zmenaGlobalRoku', methods=['POST'])(self.zmenaGlobalRoku)

    def render_web(self, template_name, **kwargs):
        user_id = session.get('token')
        if user_id is None:
            return redirect(url_for('login'))
        kwargs['meno'] = self.token.getName(user_id)
        kwargs['opravnenia'] = self.token.get_user_permission(user_id)
        try:
            kwargs['skolskeRoky'] = self.sql.skolskeRoky()
            kwargs['zvolenyRok'] = session.get('zvolenyRok')
        except:
            pass
        return render_template(template_name, **kwargs)

    def zmenaGlobalRoku(self):
        session['zvolenyRok'] = request.json
        return jsonify({'result': True})

    def check_token(self):
        def decorator(view_func):
            @wraps(view_func)
            def wrapper(*args, **kwargs):
                token_ = session.get("token")
                if self.token.overToken(token_):
                    return view_func(*args, **kwargs)
                else:
                    return redirect(url_for('login'))

            return wrapper

        return decorator

    def check_permission(self, required_permissions):
        def decorator(view_func):
            @wraps(view_func)
            def wrapper(*args, **kwargs):
                token_ = session.get("token")
                user_permissions = self.token.get_user_permission(token_)
                if all(permission in user_permissions for permission in required_permissions):
                    return view_func(*args, **kwargs)
                else:
                    return jsonify({"authorized": False}), 403

            return wrapper

        return decorator

    def login(self):
        username = request.form['username']
        password = request.form['password']
        user = self.sql.check_login(username, password)
        if user:
            session['zvolenyRok'] = self.sql.skolskeRoky()[0][0]
            session['token'] = self.token.vytvorToken(user[0])
            #return redirect(url_for('showEdit_Rozvrh'))
            return redirect(url_for('dashboard'))
        else:
            error = True
            return render_template('login.html', error=error)

    def Login(self):
        return render_template('login.html')

    def dashboard(self):
        return self.render_web('menu.html')

    def index(self):
        return render_template('login.html')

    def logout(self):
        self.token.odstranToken(session.get('token'))
        session.clear()
        return redirect(url_for('Login'))

    def run(self):
        # log = logging.getLogger('werkzeug')
        # log.setLevel(logging.WARNING)
        self.app.run("0.0.0.0", 8888, debug=True)
