import { z } from "zod";
import { envSchema } from "./schema";
import { config } from "dotenv";
import globals from "./env";
import { existsSync } from "node:fs";
import Logger from "../log/logger";

const envPathes = [".env.development.local", ".env.test.local", ".env.local", ".env"];

export default function loadEnv() {
    try {
        const envPath = envPathes.find((path) => existsSync(path));

        if (envPath) {
            config({ path: envPath });
            console.debug(`loader.ts::loadEnv | Loaded environment variables from ${envPath}`);
        } else {
            console.log(`No environment file found.\nLooked for:\n  - ${envPathes.join("\n  - ")}`);
        }

        // Parse the environment variables using the schema
        globals.env = envSchema.parse(process.env);
    } catch (err) {
        if (err instanceof z.ZodError) {
            const { fieldErrors } = err.flatten();
            const errorMessage = Object.entries(fieldErrors)
                .map(([field, errors]) => (errors ? `${field}: ${errors.join(", ")}` : field))
                .join("\n  ");

            console.error(`loader.ts::loadEnv | Invalid environment variables:\n  ${errorMessage}`);

            process.exit(1);
        } else if (err instanceof Error) {
            Logger.error("loader.ts::loadEnv |", err.message);
            process.exit(1);
        }
    }
}
