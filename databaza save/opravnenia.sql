create table opravnenia
(
    opravnenie_id int auto_increment
        primary key,
    nazov         varchar(45)  not null,
    kategoria     varchar(255) null
);

INSERT INTO pokus.opravnenia (nazov, kategoria) VALUES ('Zobraz pozicie', 'Pozicie');
INSERT INTO pokus.opravnenia (nazov, kategoria) VALUES ('Nahranie Fotky', 'Profil');
INSERT INTO pokus.opravnenia (nazov, kategoria) VALUES ('Edit Osoba info', 'Profil');
INSERT INTO pokus.opravnenia (nazov, kategoria) VALUES ('Vymazanie Profilovky', 'Profil');
INSERT INTO pokus.opravnenia (nazov, kategoria) VALUES ('Zoznam pouzivatelov', 'Zoznam pouzivatelov');
INSERT INTO pokus.opravnenia (nazov, kategoria) VALUES ('Edit Prihlasovacie Udaje', 'Profil');
INSERT INTO pokus.opravnenia (nazov, kategoria) VALUES ('Zobraz pokus', 'Pozicie');
