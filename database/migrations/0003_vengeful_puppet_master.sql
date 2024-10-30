ALTER TABLE "acquired" ALTER COLUMN "user_uuid" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "acquired" ALTER COLUMN "challenge_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "acquired" ALTER COLUMN "created_by" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "acquired" ALTER COLUMN "created_by" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "challenges" ALTER COLUMN "club_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "challenges" ALTER COLUMN "club_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "granters" ALTER COLUMN "club_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "club_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "club_id" DROP NOT NULL;