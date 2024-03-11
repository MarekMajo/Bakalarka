create table ucebne_plany
(
    uc_plan_id int auto_increment
        primary key,
    nazov      varchar(45) not null,
    predmet_id int         not null,
    constraint ucebne_plany_ibfk_1
        foreign key (predmet_id) references predmety (predmet_id)
);

create index predmet_id
    on ucebne_plany (predmet_id);

