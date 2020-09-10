BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "users" (
	"id"	INTEGER NOT NULL,
	"username"	TEXT NOT NULL UNIQUE,
	"password"	TEXT NOT NULL UNIQUE,
	"table_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "user_info" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT,
	"birthdate"	TEXT,
	"mail"	TEXT,
	"table_id"	INTEGER,
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "users" VALUES (5,'admin','admin',1),
 (6,'mahmut','123456',2);
INSERT INTO "user_info" VALUES (1,'mahmut','12-09-1997','aktasmahmut97@gmail.com',1),
 (2,'ali','10-02-1987','ali@gmail.com',1),
 (3,'ayse','02-01-1997','ayse@gmail.com',2),
 (4,'yılmaz','12-09-1997','yılmaz@gmail.com',2),
 (5,'oguz','12-09-1997','oguz@gmail.com',1);
COMMIT;
