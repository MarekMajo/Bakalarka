create table ziak_predmety
(
    ziak_id    int null,
    predmet_id int null,
    constraint ziak_predmety_osoba_osoba_id_fk
        foreign key (ziak_id) references osoba (osoba_id),
    constraint ziak_predmety_predmety_predmet_id_fk
        foreign key (predmet_id) references predmety (predmet_id)
);

