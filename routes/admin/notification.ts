import Logger from "@/log/logger";
import Status from "@/models/status";
import SocketIO from "@/socket/socket";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const body = z.object({
    title: z.string(),
    message: z.string(),
    iconUrl: z.string().optional()
});

export default async function Route_Admin_Notification(req: Request, res: Response, next: NextFunction) {
    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    Logger.info(
        `Route_Admin_Notification | Dispatching notification: ${bodyPayload.data.title} - ${bodyPayload.data.message}`
    );
    SocketIO.sendRawNotification(bodyPayload.data.title, bodyPayload.data.message, bodyPayload.data.iconUrl);

    return Status.send(req, next, {
        status: 204
    });
}
