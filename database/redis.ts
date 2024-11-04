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

    public static async close() {
        await Redis.client.quit();
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

    public static async sortedSet<T>(setName: string, score: number, data: T): Promise<void> {
        const stringValue = JSON.stringify(data);

        await Redis.client.zAdd(setName, {
            value: stringValue,
            score
        });
    }

    public static async sortedRemove<T>(setName: string, data: T): Promise<void> {
        const stringValue = JSON.stringify(data);
        await Redis.client.zRem(setName, stringValue);
    }

    public static async sortedAll<T>(setName: string): Promise<{ value: T; score: number }[]> {
        const data = await Redis.client.zRangeWithScores(setName, 0, -1);

        return data.map(({ value, score }) => ({
            value: JSON.parse(value) as T,
            score
        }));
    }

    public static async sortedGetScore<T>(setName: string, data: T): Promise<number> {
        const stringValue = JSON.stringify(data);
        const score = await Redis.client.zScore(setName, stringValue);
        return score ? score : 0;
    }
}
