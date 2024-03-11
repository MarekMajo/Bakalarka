create table ucitel_predmety
(
    ucitel_id         int         null,
    predmet_id        int         not null,
    skolsky_rok_nazov varchar(45) null,
    constraint ucitel_predmety_ibfk_1
        foreign key (ucitel_id) references osoba (osoba_id),
    constraint ucitel_predmety_ibfk_2
        foreign key (predmet_id) references predmety (predmet_id)
);

create index predmet_id
    on ucitel_predmety (predmet_id);

create index ucitel_id
    on ucitel_predmety (ucitel_id);

