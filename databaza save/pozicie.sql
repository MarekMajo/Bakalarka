create table pozicie
(
    pozicia_id int auto_increment
        primary key,
    nazov      varchar(45) not null
);

INSERT INTO pokus.pozicie (nazov) VALUES ('Admin');
INSERT INTO pokus.pozicie (nazov) VALUES ('Ucitel');
INSERT INTO pokus.pozicie (nazov) VALUES ('Rodič');
INSERT INTO pokus.pozicie (nazov) VALUES ('Žiak');
INSERT INTO pokus.pozicie (nazov) VALUES ('Co-admin');
