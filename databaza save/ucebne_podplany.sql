create table ucebne_podplany
(
    uc_podplan_id  int auto_increment
        primary key,
    uc_plan_id     int         not null,
    nazov          varchar(45) not null,
    pocet_hodin    int         not null,
    oducene_hodiny int         null,
    constraint ucebne_podplany_ibfk_1
        foreign key (uc_plan_id) references ucebne_plany (uc_plan_id)
);

create index uc_plan_id
    on ucebne_podplany (uc_plan_id);

