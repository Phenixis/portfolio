CREATE TABLE IF NOT EXISTS "session" (
	"token" varchar(255) PRIMARY KEY NOT NULL,
	"validate_until" timestamp NOT NULL
);
