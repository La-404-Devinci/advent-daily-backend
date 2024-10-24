import { z } from "zod";
import { zboolean, znumber } from "./extras";

export const envSchema = z.object({
    NODE_ENV: z.string().default("development"),
    PORT: znumber().default("3000"),
    TRUST_PROXY: zboolean().default("false"),
    LOG_FOLDER: z.string().optional(),

    POSTGRES_DB: z.string().default("postgres"),
    POSTGRES_USER: z.string().default("postgres"),
    POSTGRES_PASSWORD: z.string().default("postgres"),
    POSTGRES_HOST: z.string().default("postgres"),
    POSTGRES_PORT: znumber().default("5432")
});
