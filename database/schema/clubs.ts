import { date, pgTable, serial, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const clubs = pgTable(
    "clubs",
    {
        id: serial("id").primaryKey(),
        avatarUrl: text("avatar_url").notNull(),
        name: text("name").notNull(),
        description: text("description"),
        dailyDate: date("daily_date", { mode: "date" }),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .notNull()
            .$onUpdate(() => new Date()),
        createdAt: timestamp("created_at").defaultNow().notNull()
    },
    (clubs) => ({
        nameUniqueIdx: uniqueIndex("name_unique_idx").on(clubs.name)
    })
);
