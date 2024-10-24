import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull()
});
