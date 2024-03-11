create table znamky
(
    znamka_id      int auto_increment
        primary key,
    znamka         varchar(45) not null,
    max_hodnota    varchar(45) null,
    vaha           float       null,
    ziak_id        int         not null,
    predmet_id     int         not null,
    ucitel_id      int         not null,
    skolsky_rok_id int         not null,
    podpis         tinyint     not null,
    constraint znamky_ibfk_1
        foreign key (ziak_id) references osoba (osoba_id),
    constraint znamky_ibfk_2
        foreign key (predmet_id) references predmety (predmet_id),
    constraint znamky_ibfk_3
        foreign key (ucitel_id) references osoba (osoba_id),
    constraint znamky_ibfk_4
        foreign key (skolsky_rok_id) references skolske_roky (skolsky_rok_id)
);

create index predmet_id
    on znamky (predmet_id);

create index skolsky_rok_id
    on znamky (skolsky_rok_id);

create index ucitel_id
    on znamky (ucitel_id);

create index ziak_id
    on znamky (ziak_id);

