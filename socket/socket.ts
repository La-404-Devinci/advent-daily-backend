import Logger from "@/log/logger";
import { Socket } from "socket.io";
import { InvalidationSubject, TypedServer } from "./types";

export default abstract class SocketIO {
    private static io: TypedServer;

    public static init(io: TypedServer) {
        io.on("connection", (socket: Socket) => {
            Logger.info(`SocketIO::connection | New connection: ${socket.id}`);
        });

        SocketIO.io = io;
    }

    public static sendInvalidationNotification(subject: InvalidationSubject) {
        if (!SocketIO.io) return Logger.warn("SocketIO::sendInvalidationNotification | SocketIO is not initialized");

        SocketIO.io.emit("invalidate", subject);
    }

    public static sendRawNotification(title: string, message: string, iconUrl?: string) {
        if (!SocketIO.io) return Logger.warn("SocketIO::sendRawNotification | SocketIO is not initialized");

        SocketIO.io.emit("notification", title, message, iconUrl);
    }
}
