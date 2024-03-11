create table triedne_knihy
(
    trieda_kniha_id int auto_increment
        primary key,
    datum           date not null,
    trieda_id       int  not null,
    predmet_id      int  not null,
    constraint triedne_knihy_ibfk_1
        foreign key (trieda_id) references triedy (trieda_id),
    constraint triedne_knihy_ibfk_2
        foreign key (predmet_id) references predmety (predmet_id)
);

create index predmet_id
    on triedne_knihy (predmet_id);

create index trieda_id
    on triedne_knihy (trieda_id);

