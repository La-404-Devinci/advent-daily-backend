import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text } from "drizzle-orm/pg-core";
import { clubs } from "./clubs";

export const granters = pgTable("granters", {
    id: serial("id").primaryKey(),
    clubId: integer("club_id")
        .notNull()
        .references(() => clubs.id),
    email: text("email").notNull(),
    password: text("password").notNull()
});

export const grantersClub = relations(granters, ({ one }) => ({
    club: one(clubs, {
        fields: [granters.clubId],
        references: [clubs.id]
    })
}));
