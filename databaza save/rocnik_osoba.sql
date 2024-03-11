create table rocnik_osoba
(
    rocnik_id int not null,
    osoba_id  int null,
    constraint rocnik_osoba_osoba_osoba_id_fk
        foreign key (osoba_id) references osoba (osoba_id),
    constraint rocnik_osoba_rocniky_rocnik_id_fk
        foreign key (rocnik_id) references rocniky (rocnik_id)
);

