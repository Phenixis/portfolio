CREATE TABLE IF NOT EXISTS "user" (
	"email" varchar PRIMARY KEY NOT NULL,
	"first_name" varchar,
	"last_name" varchar,
	"password_hash" text,
	"api_key" varchar
);
