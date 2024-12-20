import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { acquired } from "./acquired";
import { clubs } from "./clubs";

export const users = pgTable(
    "users",
    {
        uuid: uuid("uuid").primaryKey().defaultRandom(),
        clubId: integer("club_id").references(() => clubs.id, { onDelete: "set null", onUpdate: "cascade" }),
        email: text("email").notNull(),
        hashpass: text("hashpass").notNull(),
        username: text("username").notNull(),
        avatarUrl: text("avatar_url"),
        quote: text("quote"),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .notNull()
            .$onUpdate(() => new Date()),
        createdAt: timestamp("created_at").defaultNow().notNull()
    },
    (users) => ({
        emailUniqueIdx: uniqueIndex("email_unique_idx").on(users.email),
        usernameUniqueIdx: uniqueIndex("username_unique_idx").on(users.username)
    })
);

export const usersRelations = relations(users, ({ many }) => ({
    acquired: many(acquired)
}));

export const usersClub = relations(users, ({ one }) => ({
    club: one(clubs, {
        fields: [users.clubId],
        references: [clubs.id]
    })
}));
