import { migrate } from "drizzle-orm/node-postgres/migrator";
import loadEnv from "./env/loader";
import DB from "./database/config";
import { initDatabase } from "./database/init";
// import globals from "./env/env";

export default async () => {
    loadEnv();
    const dbTeardownFunc = initDatabase();
    await migrate(DB.instance, { migrationsFolder: "./database/migrations" });

    return () => {
        dbTeardownFunc();
    };
};
