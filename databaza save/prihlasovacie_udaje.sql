create table prihlasovacie_udaje
(
    login_id int         not null
        primary key,
    pr_meno  varchar(45) not null,
    pr_heslo varchar(45) not null,
    constraint prihlasovacie_udaje_ibfk_1
        foreign key (login_id) references osoba (osoba_id)
);

INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (1, 'admin', 'admin');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (2, 'gross', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (3, 'holder', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (4, 'mills', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (5, 'randall', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (6, 'adams', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (7, 'cox', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (8, 'james', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (9, 'ferguson', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (10, 'duarte', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (11, 'montgomery', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (12, 'solis', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (13, 'harris', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (14, 'ramsey', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (15, 'velez', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (16, 'lyons', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (17, 'clark', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (18, 'hayes', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (19, 'barrett', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (20, 'smith', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (21, 'clark2', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (22, 'cain', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (23, 'smith2', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (24, 'cross', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (25, 'hill', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (26, 'torres', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (27, 'ferrell', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (28, 'woodard', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (29, 'black', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (30, 'trujillo', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (31, 'rollins', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (32, 'bennett', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (33, 'mullins', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (34, 'gibson', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (35, 'bowen', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (36, 'marquez', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (37, 'frey', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (38, 'pierce', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (39, 'hopkins', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (40, 'cowan', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (41, 'williams', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (42, 'brown', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (43, 'reed', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (44, 'pierce2', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (45, 'christensen', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (46, 'walker', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (47, 'mitchell', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (48, 'harvey', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (49, 'mckenzie', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (50, 'allen', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (51, 'perry', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (52, 'olson', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (53, 'george', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (54, 'hudson', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (55, 'barron', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (56, 'fields', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (57, 'jordan', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (58, 'smith3', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (59, 'shaw', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (60, 'mitchell2', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (61, 'wilkerson', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (62, 'oconnor', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (63, 'hernandez', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (64, 'barrett2', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (65, 'harmon', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (66, 'gonzalez', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (67, 'grant', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (68, 'thomas', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (69, 'mcdaniel', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (70, 'wilkins', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (71, 'blake', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (72, 'alvarado', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (73, 'hamilton', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (74, 'rodriguez', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (75, 'logan', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (76, 'bass', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (77, 'mcdonald', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (78, 'mathews', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (79, 'scott', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (80, 'hancock', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (81, 'huffman', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (82, 'mora', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (83, 'collins', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (84, 'grant2', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (85, 'bell', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (86, 'walker2', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (87, 'jimenez', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (88, 'french', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (89, 'lang', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (90, 'ross', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (91, 'rogers', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (92, 'espinoza', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (93, 'johnson', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (94, 'bradford', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (95, 'mcbride', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (96, 'myers', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (97, 'gates', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (98, 'moran', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (99, 'willis', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (100, 'grant3', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (101, 'howell', '123');
INSERT INTO pokus.prihlasovacie_udaje (login_id, pr_meno, pr_heslo) VALUES (102, 'Suchanovský', '123');
