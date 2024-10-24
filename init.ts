import { migrate } from "drizzle-orm/node-postgres/migrator";
import loadEnv from "./env/loader";
import DB, { initDatabase } from "./database/config";
// import globals from "./env/env";

export default async () => {
    loadEnv();
    initDatabase();
    await migrate(DB.instance, { migrationsFolder: "./database/migrations" });
};
