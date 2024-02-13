CREATE TABLE "spill" (
	"spillid"	INTEGER NOT NULL,
	PRIMARY KEY("spillid" AUTOINCREMENT)
);

CREATE TABLE "spillere" (
	"spillerid"	INTEGER NOT NULL,
	"lag"	INTEGER,
	"navn"	TEXT NOT NULL,
	PRIMARY KEY("spillerid" AUTOINCREMENT)
);

CREATE TABLE "hand" (
	"spillid"	INTEGER NOT NULL,
	"spillerid"	INTEGER NOT NULL,
	"hand"	TEXT NOT NULL,
	FOREIGN KEY("spillid") REFERENCES "spill"("spillid"),
	FOREIGN KEY("spillerid") REFERENCES "spillere"("spillerid"),
	PRIMARY KEY("spillid","spillerid")
);