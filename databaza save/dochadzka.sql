create table dochadzka
(
    dochadzka_id    int auto_increment
        primary key,
    datum           date        not null,
    typ_chybania    varchar(45) not null,
    ziak_id         int         not null,
    predmet_id      int         not null,
    skolsky_rok_id  int         not null,
    ospravedlnienka tinyint     null,
    constraint dochadzka_ibfk_1
        foreign key (ziak_id) references osoba (osoba_id),
    constraint dochadzka_ibfk_2
        foreign key (predmet_id) references predmety (predmet_id),
    constraint dochadzka_ibfk_3
        foreign key (skolsky_rok_id) references skolske_roky (skolsky_rok_id)
);

create index predmet_id
    on dochadzka (predmet_id);

create index skolsky_rok_id
    on dochadzka (skolsky_rok_id);

create index ziak_id
    on dochadzka (ziak_id);

