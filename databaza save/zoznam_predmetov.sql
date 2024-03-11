create table zoznam_predmetov
(
    zoznam_predmet_id int auto_increment
        primary key,
    nazov             varchar(255) not null,
    skratka           varchar(10)  null
);

INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Slovenský jazyk a literatúra', 'SJL');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Matematika', 'MAT');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Výtvarná výchova', 'VYV');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Telesná a športová výchova', 'TSV');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Etická výchova', 'ETV');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Hudobná výchova', 'HUV');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Prvouka', 'PVO');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Anglický jazyk hrou', 'AHR');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Náboženská výchova', 'NBV');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Anglický jazyk ', 'ANJ');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Prírodoveda', 'PDA');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Informatika', 'INF');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Regionálna výchova', 'RGV');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Vlastiveda', 'VLA');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Pracovné vyučovanie', 'PVC');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Biológia', 'BIO');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Technika', 'THD');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Geografia', 'GEG');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Dejepis', 'DEJ');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Občianska náuka', 'OBN');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Fyzika', 'FYZ');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Chémia', 'CHE');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Ruský jazyk', 'RUJ');
INSERT INTO pokus.zoznam_predmetov (nazov, skratka) VALUES ('Nemecký jazyk', 'NEJ');
