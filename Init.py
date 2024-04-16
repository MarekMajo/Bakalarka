from Flask import BaseServer
from Pozicie_Flask import Pozicie
from Profil_Flask import Profil
from Uzivatelia_Flask import Uzivatelia
from ResetHesla_Flask import ResetHesla
from Zoznamy_Flask import Zoznamy
from Rozvrh_Flask import Rozvrhy
from Znamky_Flask import Znamky
from Dochadzka_Flask import Dochadzka
from Oznamenie_Flask import Oznamenie

if __name__ == "__main__":
    adress = {"host": "localhost", "user": "root", "password": "admin", "database": "pokus"}
    base = BaseServer(adress)
    Zoznamy(base)
    Pozicie(base)
    Profil(base)
    Uzivatelia(base)
    ResetHesla(base)
    Rozvrhy(base)
    Znamky(base)
    Dochadzka(base)
    Oznamenie(base)
    base.run()

