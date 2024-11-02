ALTER TABLE "acquired" DROP CONSTRAINT "acquired_user_uuid_users_uuid_fk";
--> statement-breakpoint
ALTER TABLE "acquired" DROP CONSTRAINT "acquired_challenge_id_challenges_id_fk";
--> statement-breakpoint
ALTER TABLE "challenges" DROP CONSTRAINT "challenges_club_id_clubs_id_fk";
--> statement-breakpoint
ALTER TABLE "granters" DROP CONSTRAINT "granters_club_id_clubs_id_fk";
--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_club_id_clubs_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "acquired" ADD CONSTRAINT "acquired_user_uuid_users_uuid_fk" FOREIGN KEY ("user_uuid") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "acquired" ADD CONSTRAINT "acquired_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "challenges" ADD CONSTRAINT "challenges_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "granters" ADD CONSTRAINT "granters_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_club_id_clubs_id_fk" FOREIGN KEY ("club_id") REFERENCES "public"."clubs"("id") ON DELETE set null ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
