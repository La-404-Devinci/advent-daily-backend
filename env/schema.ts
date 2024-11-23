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
    POSTGRES_PORT: znumber().default("5432"),

    REDIS_HOST: z.string().default("redis"),
    REDIS_PORT: znumber().default("6379"),

    MINIO_ROOT_USER: z.string().default("minio"),
    MINIO_ROOT_PASSWORD: z.string().default("password"),
    MINIO_HOST: z.string().default("minio"),
    MINIO_PORT: znumber().default("9000"),
    MINIO_DEFAULT_BUCKETS: z.string().default("george"),

    JWT_SECRET: z.string().default("secret"),

    ADMIN_TOKEN: z.string().default("super_admin_token"),

    MAIL_SERVER: z.string().default("smtp.example.com"),
    MAIL_PORT: znumber().default("587"),
    MAIL_SECURE: zboolean().default("true"),
    MAIL_USER: z.string().default("user"),
    MAIL_PASSWORD: z.string().default("password"),
    MAIL_FROM: z.string().default("system <user@example.com>"),

    MAIL_REDIRECT_URL: z.string().default("http://localhost:1337/auth/confirm#{token}"),
    PROFILE_REDIRECT_URL: z.string().default("http://localhost:1337/profile/{uuid}"),
    MAIL_ASSETS_URL: z.string().default("http://localhost:1337/mail-assets/")
});
