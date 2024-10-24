import globals from "./env/env";
import express from "express";
import cookieParser from "cookie-parser";
import middlewareI18n from "./middlewares/i18n";
import Logger from "./log/logger";
import routes from "./routes";
import Status from "./models/status";
import { logIncoming, logOutgoing } from "./middlewares/log";
import middlewareCore from "./middlewares/core";
import loadEnv from "./env/loader";
import { initDatabase } from "./database/config";

export default (logSuffix?: string, initDb = true) => {
    if (initDb) {
        loadEnv();
        initDatabase();
    }

    Logger.init(logSuffix);

    const app = express();

    app.set("trust proxy", globals.env.TRUST_PROXY ? 1 : 0);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(middlewareI18n);

    app.use(logIncoming);
    app.use(routes);
    app.all("*", (req, res, next) => Status.send(req, next, { status: 404, error: "system.notFound" }));
    app.use(logOutgoing);
    app.use(middlewareCore);

    return app;
};
