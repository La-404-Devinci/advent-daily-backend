import Logger from "@/log/logger";
import Status, { Payload } from "@/models/status";
import { NextFunction, Request, Response } from "express";

// Add this for unused imports, else it will throw an error
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function middlewareCore(err: Payload | Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof Error) {
        Logger.error("Request got an error", err);
        return res.status(500).json({
            masterStatus: 500,
            sentAt: Date.now(),
            response: Status.generatePayload(req.lang, {
                status: 500,
                error: "system.internal"
            })
        });
    }

    const payload = err as Payload;
    return res
        .status(payload.masterStatus === 204 ? 200 : payload.masterStatus)
        .header("Content-Type", "application/json")
        .header("X-Content-Type-Options", "nosniff")
        .header("X-Powered-By", "Kan-App")
        .json({
            masterStatus: payload.masterStatus,
            sentAt: Date.now(),
            response: payload.response
        });
}
