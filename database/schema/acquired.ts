import { relations } from "drizzle-orm";
import { index, integer, pgTable, primaryKey, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { challenges } from "./challenges";

export const acquired = pgTable(
    "acquired",
    {
        userUuid: uuid("user_uuid")
            .notNull()
            .references(() => users.uuid),
        challengeId: integer("challenge_id")
            .notNull()
            .references(() => challenges.id),
        createdBy: integer("created_by"),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .notNull()
            .$onUpdate(() => new Date()),
        createdAt: timestamp("created_at").defaultNow().notNull()
    },
    (acquired) => ({
        pk: primaryKey({ columns: [acquired.userUuid, acquired.challengeId] }),
        userUuidIdx: index("user_uuid_idx").on(acquired.userUuid),
        challengeIdIdx: index("challenge_id_idx").on(acquired.challengeId)
    })
);

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
