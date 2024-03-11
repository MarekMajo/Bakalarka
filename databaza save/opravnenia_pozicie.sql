create table opravnenia_pozicie
(
    pozicia_id    int not null,
    Opravnenia_id int not null,
    constraint opravnenia_pozicie_ibfk_1
        foreign key (pozicia_id) references pozicie (pozicia_id),
    constraint opravnenia_pozicie_ibfk_2
        foreign key (Opravnenia_id) references opravnenia (opravnenie_id)
);

create index Opravnenia_id
    on opravnenia_pozicie (Opravnenia_id);

create index pozicia_id
    on opravnenia_pozicie (pozicia_id);

INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (1, 1);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (1, 2);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (1, 3);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (1, 4);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (1, 5);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (1, 6);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (1, 7);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (2, 2);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (2, 3);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (2, 4);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (2, 5);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (2, 6);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (3, 2);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (3, 4);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (3, 6);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (7, 2);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (7, 4);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (7, 6);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (5, 1);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (5, 2);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (5, 3);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (5, 4);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (5, 5);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (5, 6);
INSERT INTO pokus.opravnenia_pozicie (pozicia_id, Opravnenia_id) VALUES (5, 7);
