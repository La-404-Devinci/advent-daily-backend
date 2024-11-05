import app from "./app";
import globals from "./env/env";
import init from "./init";
import Logger from "./log/logger";
import http from "http";
import { Server } from "socket.io";
import SocketIO from "./socket/socket";

init()
    .then(() => {
        const express = app(undefined, false);
        const server = http.createServer(express);
        const io = new Server(server);

        SocketIO.init(io);

        server.listen(globals.env.PORT, () => {
            Logger.info(`entry.ts::[root] | Server is running on port ${globals.env.PORT}`);
        });
    })
    .catch((e) => {
        console.error("Migration error:", e);
        process.exit(1);
    });
