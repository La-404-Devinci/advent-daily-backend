import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { acquired } from "./acquired";
import { clubs } from "./clubs";
import { granters } from "./granters";

export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    clubId: serial("club_id"),
    score: integer("score").notNull(),
    name: text("name").notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

export const challengesRelations = relations(challenges, ({ many }) => ({
    acquired: many(acquired),
    granters: many(granters)
}));

export const challengesClub = relations(challenges, ({ one }) => ({
    club: one(clubs, {
        fields: [challenges.clubId],
        references: [clubs.id]
    })
}));
