create table predmety
(
    predmet_id        int auto_increment
        primary key,
    zoznam_predmet_id int         null,
    rocnik_id         int         null,
    skolsky_rok_nazov varchar(45) not null,
    constraint predmety_ibfk_1
        foreign key (zoznam_predmet_id) references zoznam_predmetov (zoznam_predmet_id),
    constraint predmety_ibfk_2
        foreign key (rocnik_id) references rocniky (rocnik_id)
);

create index rocnik_id
    on predmety (rocnik_id);

create index zoznam_predmet_id
    on predmety (zoznam_predmet_id);