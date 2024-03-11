create table asistent_predmety
(
    asistent_id       int         null,
    predmet_id        int         not null,
    skolsky_rok_nazov varchar(45) null,
    constraint asistent_predmety_osoba_osoba_id_fk
        foreign key (asistent_id) references osoba (osoba_id),
    constraint asistent_predmety_predmety_predmet_id_fk
        foreign key (predmet_id) references predmety (predmet_id)
);