import globals from "@/env/env";
import redis from "redis";

const client = redis.createClient({
    url: `redis://${globals.env.REDIS_HOST}:${globals.env.REDIS_PORT}`
});

const Redis = {
    async get<T>(key: string): Promise<T | null> {
        const value = await client.get(key);
        return value ? JSON.parse(value) : null;
    },

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const stringValue = JSON.stringify(value);
        if (ttl) {
            await client.setEx(key, ttl, stringValue);
        } else {
            await client.set(key, stringValue);
        }
    },

    async del(key: string): Promise<void> {
        await client.del(key);
    }
};

export default Redis;
