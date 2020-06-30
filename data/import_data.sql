/* Début de la transaction */

BEGIN;

/* Ajout de données dans les différentes tables */

/* user */

INSERT INTO "user" ("first_name", "last_name", "email", "password") 
VALUES ('Dorian', 'Garcia', 'Dorianspeed@hotmail.com', 'test');

/* table */

INSERT INTO "table" ("name", "background_color", "user_id")
VALUES ('Table de test', '#FFFFFF', 1);

/* list */
INSERT INTO "list" ("name", "position", "user_id", "table_id")
VALUES ('Première liste', 0, 1, 1);

/* card */
INSERT INTO "card" ("name", "position", "background_color", "text_color", "user_id", "list_id")
VALUES ('Première carte',0 , '#FFFFFF', '#000000', 1, 1),
       ('Deuxième carte',0 , '#FFFFFF', '#000000', 1, 1);

/* tag */
INSERT INTO "tag" ("name", "background_color", "text_color", "user_id")
VALUES ('Urgent', '#FF0000', '#000000', 1);

/* card_has_tag */
INSERT INTO "card_has_tag" ("card_id", "tag_id")
VALUES (1, 1);


/* Fin de la transaction */

COMMIT;