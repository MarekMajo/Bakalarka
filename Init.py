from Flask import BaseServer
from Pozicie_Flask import PositionsServer
from Profil_Flask import ProfilServer
from Uzivatelia_Flask import Uzivatelia
from ResetHesla import ResetHesla
from Zoznamy import Zoznamy
from Rozvrh_Flask import Rozvrhy
from Znamky import Znamky
#from pokus import Pokus

if __name__ == "__main__":
    #adress = {"host": "192.168.191.200", "user": "root", "password": "admin", "database": "pokus"}
    adress = {"host": "localhost", "user": "root", "password": "admin", "database": "pokus"}
    #adress = {"host": "192.168.191.76", "user": "root", "password": "admin", "database": "pokus"}
    base = BaseServer(adress)
    Zoznamy(base)
    PositionsServer(base)
    ProfilServer(base)
    Uzivatelia(base)
    ResetHesla(base)
    Rozvrhy(base)
    Znamky(base)
    base.run()