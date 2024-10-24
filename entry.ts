import app from "./app";
import globals from "./env/env";
import init from "./init";
import Logger from "./log/logger";

init()
    .then(() => {
        app(undefined, false).listen(globals.env.PORT, () => {
            Logger.info(`entry.ts::[root] | Server is running on port ${globals.env.PORT}`);
        });
    })
    .catch((e) => {
        console.error("Migration error:", e);
        process.exit(1);
    });
