import { NextFunction, Request, Response } from "express";
import Logger from "../log/logger";

export function logIncoming(req: Request, res: Response, next: NextFunction) {
    const randomUUID = Math.random().toString(36).substring(7);
    const receivedAt = Date.now();

    req.uuid = randomUUID;
    req.receivedAt = receivedAt;

    Logger.writeRaw(`[REQ] (<--) ${req.uuid} ${req.method} ${req.url} | ${req.ip} ${req.headers["user-agent"]}`);
    next();
}

export function logOutgoing(err: unknown, req: Request, res: Response, next: NextFunction) {
    const responseTime = Date.now() - req.receivedAt;
    Logger.writeRaw(`[RES] (-->) ${req.uuid} ${res.statusCode} (${responseTime}ms)`);
    next(err);
}
