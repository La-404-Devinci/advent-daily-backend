import { initDrizzle } from "./config";
import Redis from "./redis";
import S3 from "./s3";

export function initDatabase() {
    initDrizzle();
    Redis.init();
    S3.init();

    return () => {
        Redis.close();
    };
}
