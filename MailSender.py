import smtplib
from email.mime.text import MIMEText
from email.header import Header

class MailSender:
    def __init__(self):
        self.mail = smtplib.SMTP('smtp-relay.brevo.com', 587)
        self.mail.ehlo()
        self.mail.starttls()
        self.mail.login('ibahry2512@gmail.com', 'QfNc2RahmPnWUqxI')
        self.emailFrom = 'SkolskyInformacnySystem@gmail.com'



    def sendResetPasswordMail(self, email, number):
        content = f"""
        Dobrý deň,

        Tu je Váš kód na obnovenie hesla: {number}

        Tento kód je platný po dobu 10 minút. Ak ste nepožiadali o obnovenie hesla, odporúčame Vám, aby ste okamžite zmenili svoje heslo a zabezpečili svoj účet.

        S pozdravom,
        Váš tím
        """
        msg = MIMEText(content, 'plain', 'utf-8')
        msg['Subject'] = Header('Obnovenie hesla', 'utf-8')
        msg['From'] = self.emailFrom
        msg['To'] = email

        try:
            self.mail.sendmail(self.emailFrom, email, msg.as_string())
        finally:
            self.mail.close()

    def sendMailNewUser(self, email, meno_priezvisko, id, prihlasovacie_meno, heslo):
        content = f"""
        Dobrý deň {meno_priezvisko}!

        Vitajte v edukačnom systéme EdupageLite. Vaše prihlasovacie údaje do nášho systému sú: 
        id: {id}
        meno: {prihlasovacie_meno}
        heslo: {heslo}

        Vypnutie prijímania emailov o hodnotení z predmetov nájdete v nastavení profilu.

        S pozdravom,
        Váš tím
        """
        msg = MIMEText(content, 'plain', 'utf-8')
        msg['Subject'] = Header('Priradenie Do systému', 'utf-8')
        msg['From'] = self.emailFrom
        msg['To'] = email

        try:
            self.mail.sendmail(self.emailFrom, email, msg.as_string())
        finally:
            self.mail.close()