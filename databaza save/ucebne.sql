create table ucebne
(
    ucebna_id int auto_increment
        primary key,
    nazov     varchar(255) not null,
    skratka   varchar(10)  null
);

INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('1T', '1T');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('2T', '2T');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('3T', '3T');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('4T', '4T');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('5T', '5T');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('6T', '6T');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('7T', '7T');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('8T', '8T');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('9T', '9T');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('Počitačová učebňa', 'POČ');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('Telesná 1', 'TV1');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('Telesná 2', 'TV2');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('Prírodovedná učebňa', 'PRIR');
INSERT INTO pokus.ucebne (nazov, skratka) VALUES ('Jazyková učebňa', 'JAZ');
