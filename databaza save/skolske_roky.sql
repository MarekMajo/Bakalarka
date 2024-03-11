create table skolske_roky
(
    skolsky_rok_id int auto_increment
        primary key,
    nazov          varchar(45) not null,
    polrok         tinyint     not null,
    zaciatok_roku  date        not null,
    koniec_roku    date        not null
);

INSERT INTO pokus.skolske_roky (nazov, polrok, zaciatok_roku, koniec_roku) VALUES ('2022/2023', 0, '2022-09-05', '2023-01-31');
INSERT INTO pokus.skolske_roky (nazov, polrok, zaciatok_roku, koniec_roku) VALUES ('2022/2023', 1, '2023-02-01', '2023-06-30');
INSERT INTO pokus.skolske_roky (nazov, polrok, zaciatok_roku, koniec_roku) VALUES ('2023/2024', 0, '2023-09-04', '2024-01-31');
INSERT INTO pokus.skolske_roky (nazov, polrok, zaciatok_roku, koniec_roku) VALUES ('2023/2024', 1, '2024-02-01', '2024-06-30');
