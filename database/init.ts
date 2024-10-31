import { initDrizzle } from "./config";
import Redis from "./redis";

export function initDatabase() {
    initDrizzle();
    Redis.init();

    return () => {
        Redis.close();
    };
}
