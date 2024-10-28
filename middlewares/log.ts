import { NextFunction, Request, Response } from "express";
import Logger from "../log/logger";
import { Payload } from "@/models/status";

export function logIncoming(req: Request, res: Response, next: NextFunction) {
    const randomUUID = Math.random().toString(36).substring(7);
    const receivedAt = Date.now();

    req.uuid = randomUUID;
    req.receivedAt = receivedAt;

    Logger.writeRaw(`[REQ] (<--) ${req.uuid} ${req.method} ${req.url} | ${req.ip} ${req.headers["user-agent"]}`);
    next();
}

export function logOutgoing(err: Payload | Error, req: Request, res: Response, next: NextFunction) {
    const responseTime = Date.now() - req.receivedAt;
    Logger.writeRaw(
        `[RES] (-->) ${req.uuid} ${err instanceof Error ? err.name : err.masterStatus} (${responseTime}ms)`
    );
    next(err);
}
