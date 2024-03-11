create table ucebne_triedy
(
    ucebna_id int null,
    trieda_id int null,
    constraint ucebne_triedy_triedy_trieda_id_fk
        foreign key (trieda_id) references triedy (trieda_id),
    constraint ucebne_triedy_ucebne_ucebna_id_fk
        foreign key (ucebna_id) references ucebne (ucebna_id)
);

