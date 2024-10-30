import globals from "@/env/env";
import Logger from "@/log/logger";
import { createClient } from "redis";

export default abstract class Redis {
    public static client: ReturnType<typeof createClient>;

    public static init() {
        Redis.client = createClient({
            url: `redis://${globals.env.REDIS_HOST}:${globals.env.REDIS_PORT}`
        });

        Redis.client.on("error", (err) => {
            Logger.error(err);
        });

        Redis.client.connect();
    }

    public static async get<T>(key: string): Promise<T | null> {
        const value = await Redis.client.get(key);
        return value ? JSON.parse(value) : null;
    }

    public static async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const stringValue = JSON.stringify(value);
        if (ttl) {
            await Redis.client.setEx(key, ttl, stringValue);
        } else {
            await Redis.client.set(key, stringValue);
        }
    }

    public static async del(key: string): Promise<void> {
        await Redis.client.del(key);
    }
}
