import globals from "@/env/env";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";

export default class DB {
    static instance: NodePgDatabase;
}

export function initDatabase() {
    DB.instance = drizzle({
        connection: {
            user: globals.env.POSTGRES_USER,
            password: globals.env.POSTGRES_PASSWORD,
            host: globals.env.POSTGRES_HOST,
            port: globals.env.POSTGRES_PORT,
            database: globals.env.POSTGRES_DB
        }
    });
}
