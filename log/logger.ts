import path from "path";
import globals from "../env/env";
import { appendFile, appendFileSync, existsSync } from "fs";

export default class Logger {
    public static logfile: string;
    public static logSuffix?: string;

    /**
     * Formats a Date object into a string that can be used as a timestamp for logging.
     *
     * @returns A string in the format "YYYY-MM-DD-HH-MM-SS".
     */
    private static date() {
        const date = new Date();
        const t = (v: number) => v.toString().padStart(2, "0");
        return `${date.getFullYear()}-${t(date.getMonth() + 1)}-${t(date.getDate())}T${t(date.getHours())}-${t(date.getMinutes())}-${t(date.getSeconds())}`;
    }

    public static init(suffix?: string) {
        if (!globals.env.LOG_FOLDER) return;

        Logger.logfile = path.resolve(globals.env.LOG_FOLDER, `log-${Logger.date()}${suffix ? `-${suffix}` : ""}.log`);
        Logger.logSuffix = suffix;

        const fileAlreadyExists = existsSync(Logger.logfile);

        appendFileSync(Logger.logfile, `# LOGFILE: ${Logger.logfile}\n`);
        Logger.debug("Logger initialized with file", Logger.logfile);

        if (fileAlreadyExists) {
            Logger.warn("Appending to existing log file");
        }
    }

    public static prefix(isConsole: boolean = false) {
        let prefixStr = "";

        if (Logger.logSuffix && isConsole) {
            prefixStr += `\x1b[34m(${Logger.logSuffix}) \x1b[0m `;
        }

        prefixStr += new Date().toISOString();
        return prefixStr;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static log(...data: any[]) {
        console.log(Logger.prefix(true), "\x1b[32m[LOG]  \x1b[0m", ...data);
        if (!globals.env.LOG_FOLDER) return;
        appendFile(Logger.logfile, `${Logger.prefix()} [LOG]  ${data.map((d) => d.toString()).join(" ")}\n`, () => {});
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static error(...data: any[]) {
        console.error(Logger.prefix(true), "\x1b[31m[ERROR]\x1b[0m", ...data);
        if (!globals.env.LOG_FOLDER) return;
        appendFile(Logger.logfile, `${Logger.prefix()} [ERROR] ${data.map((d) => d.toString()).join(" ")}\n`, () => {});
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static warn(...data: any[]) {
        console.warn(Logger.prefix(true), "\x1b[33m[WARN] \x1b[0m", ...data);
        if (!globals.env.LOG_FOLDER) return;
        appendFile(Logger.logfile, `${Logger.prefix()} [WARN]  ${data.map((d) => d.toString()).join(" ")}\n`, () => {});
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static info(...data: any[]) {
        console.info(Logger.prefix(true), "\x1b[36m[INFO] \x1b[0m", ...data);
        if (!globals.env.LOG_FOLDER) return;
        appendFile(Logger.logfile, `${Logger.prefix()} [INFO]  ${data.map((d) => d.toString()).join(" ")}\n`, () => {});
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static debug(...data: any[]) {
        console.debug(Logger.prefix(true), "\x1b[34m[DEBUG]\x1b[0m", ...data);
        if (!globals.env.LOG_FOLDER) return;
        appendFile(
            Logger.logfile,
            `${Logger.prefix()} [DEBUG] ${data.map((d) => (typeof d === "string" ? d : JSON.stringify(d))).join(" ")}\n`,
            () => {}
        );
    }

    public static writeRaw(data: string) {
        console.log(Logger.prefix(true), data);
        if (!globals.env.LOG_FOLDER) return;
        appendFile(Logger.logfile, Logger.prefix() + " " + data + "\n", () => {});
    }
}
