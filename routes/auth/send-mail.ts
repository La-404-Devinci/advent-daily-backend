import Logger from "@/log/logger";
import Status from "@/models/status";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const body = z.object({
    /**
     * Validates an email address
     * - It must end with @edu.devinci.fr
     * - It must be a valid email
     */
    email: z.string().regex(/^[a-zA-Z0-9._%+-]+@edu\.devinci\.fr$/)
});

export default async function Route_Auth_Sendmail(req: Request, res: Response, next: NextFunction) {
    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const userExists = false;
    // TODO: Check if user already exists

    if (!userExists) {
        return Status.send(req, next, {
            status: 409,
            error: "errors.auth.conflict.email"
        });
    }

    try {
        // TODO: Send email
    } catch (e) {
        Logger.error("send-mail.ts::Route_Auth_Sendmail: Error while sending email", e);
    }

    return Status.send(req, next, {
        status: 201
    });
}
