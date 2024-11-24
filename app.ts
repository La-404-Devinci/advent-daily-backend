import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { initDatabase } from "./database/init";
import globals from "./env/env";
import loadEnv from "./env/loader";
import Logger from "./log/logger";
import middlewareGranter from "./middlewares/auth/granter";
import middlewareUser from "./middlewares/auth/user";
import middlewareCore from "./middlewares/core";
import middlewareI18n from "./middlewares/i18n";
import { logIncoming, logOutgoing } from "./middlewares/log";
import Status from "./models/status";
import routes from "./routes/router";

export default (logSuffix?: string, initDb = true) => {
    if (initDb) {
        loadEnv();
        initDatabase();
    }

    Logger.init(logSuffix);

    const app = express();

    app.use(cors());

    app.set("trust proxy", globals.env.TRUST_PROXY ? 1 : 0);

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(middlewareI18n);
    app.use(middlewareUser);
    app.use(middlewareGranter);

    app.use(logIncoming);
    app.use(routes);
    app.all("*", (req, res, next) => Status.send(req, next, { status: 404, error: "system.notFound" }));
    app.use(logOutgoing);
    app.use(middlewareCore);

    return app;
};
