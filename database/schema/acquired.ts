import { relations } from "drizzle-orm";
import { pgTable, serial, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { challenges } from "./challeges";

export const acquired = pgTable("acquired", {
    userUuid: uuid("user_uuid").primaryKey(),
    challengeId: serial("challenge_id").primaryKey(),
    createdBy: serial("created_by"),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
    createdAt: timestamp("created_at").defaultNow().notNull()
});

export const acquiredRelations = relations(acquired, ({ many }) => ({
    user: many(users),
    challenge: many(challenges)
}));

export const acquiredUser = relations(acquired, ({ one }) => ({
    user: one(users, {
        fields: [acquired.userUuid],
        references: [users.uuid]
    })
}));

export const acquiredChallenge = relations(acquired, ({ one }) => ({
    challenge: one(challenges, {
        fields: [acquired.challengeId],
        references: [challenges.id]
    })
}));
