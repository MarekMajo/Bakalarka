create table rozvrhy
(
    rozvrh_id      int auto_increment
        primary key,
    den_v_tyzdni   int not null,
    block          int not null,
    trieda_id      int null,
    predmet_id     int not null,
    ucebna_id      int null,
    skolsky_rok_id int not null,
    constraint rozvrhy_ibfk_1
        foreign key (trieda_id) references triedy (trieda_id),
    constraint rozvrhy_ibfk_2
        foreign key (predmet_id) references predmety (predmet_id),
    constraint rozvrhy_ibfk_3
        foreign key (ucebna_id) references ucebne (ucebna_id),
    constraint rozvrhy_ibfk_4
        foreign key (skolsky_rok_id) references skolske_roky (skolsky_rok_id)
);

create index predmet_id
    on rozvrhy (predmet_id);

create index skolsky_rok_id
    on rozvrhy (skolsky_rok_id);

create index trieda_id
    on rozvrhy (trieda_id);

create index ucebna_id
    on rozvrhy (ucebna_id);
