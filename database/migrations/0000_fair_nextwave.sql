CREATE TABLE IF NOT EXISTS "acquired" (
	"user_uuid" uuid NOT NULL,
	"challenge_id" integer NOT NULL,
	"created_by" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "acquired_user_uuid_challenge_id_pk" PRIMARY KEY("user_uuid","challenge_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"club_id" integer,
	"score" integer NOT NULL,
	"name" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "clubs" (
	"id" serial PRIMARY KEY NOT NULL,
	"avatar_url" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"daily_date" date,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "granters" (
	"id" serial PRIMARY KEY NOT NULL,
	"club_id" integer NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"club_id" integer,
	"email" text NOT NULL,
	"hashpass" text NOT NULL,
	"username" text NOT NULL,
	"avatar_url" text,
	"quote" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_uuid_idx" ON "acquired" USING btree ("user_uuid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "challenge_id_idx" ON "acquired" USING btree ("challenge_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "name_unique_idx" ON "clubs" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_unique_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "username_unique_idx" ON "users" USING btree ("username");