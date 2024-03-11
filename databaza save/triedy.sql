create table triedy
(
    trieda_id      int auto_increment
        primary key,
    nazov          varchar(45) not null,
    triedny_id     int         null,
    skolsky_rok_id varchar(45) null,
    constraint triedy_ibfk_1
        foreign key (triedny_id) references osoba (osoba_id)
);

create index triedny_id
    on triedy (triedny_id);

create index triedy_skolske_roky_skolsky_rok_id_fk
    on triedy (skolsky_rok_id);

