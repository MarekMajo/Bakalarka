create table ziak_trieda
(
    ziak_id   int not null,
    trieda_id int not null,
    constraint ziak_trieda_osoba_osoba_id_fk
        foreign key (ziak_id) references osoba (osoba_id),
    constraint ziak_trieda_triedy_trieda_id_fk
        foreign key (trieda_id) references triedy (trieda_id)
);

