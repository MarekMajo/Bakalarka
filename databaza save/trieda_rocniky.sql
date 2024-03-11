create table trieda_rocniky
(
    trieda_id int null,
    rocnik_id int null,
    constraint trieda_rocniky_rocniky_rocnik_id_fk
        foreign key (rocnik_id) references rocniky (rocnik_id),
    constraint trieda_rocniky_triedy_trieda_id_fk
        foreign key (trieda_id) references triedy (trieda_id)
);

