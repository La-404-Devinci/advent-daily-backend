import { initDrizzle } from "./config";
import Redis from "./redis";

export default function initDatabase() {
    initDrizzle();
    Redis.init();
}
