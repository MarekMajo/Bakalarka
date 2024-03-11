create table predmety_ucebne
(
    predmet_id        int         not null,
    ucebna_id         int         null,
    skolsky_rok_nazov varchar(45) null,
    constraint predmety_ucebne_ibfk_1
        foreign key (predmet_id) references predmety (predmet_id),
    constraint predmety_ucebne_ibfk_2
        foreign key (ucebna_id) references ucebne (ucebna_id)
);

create index predmet_id
    on predmety_ucebne (predmet_id);

create index ucebna_id
    on predmety_ucebne (ucebna_id);
