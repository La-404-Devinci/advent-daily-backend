import AuthController from "@/controllers/auth";
import UserController from "@/controllers/users";
import Redis from "@/database/redis";
import globals from "@/env/env";
import Logger from "@/log/logger";
import { isAdmin } from "@/middlewares/auth/admin";
import Status from "@/models/status";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const body = z.object({
    /**
     * Validates an email address
     * - It must end with @edu.devinci.fr
     * - It must be a valid email
     */
    email: z.string()
});

export default async function Route_Auth_Sendmail(req: Request, res: Response, next: NextFunction) {
    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    if (
        globals.env.NODE_ENV !== "production" &&
        /^[a-zA-Z0-9._%+-]+@edu\.devinci\.fr$/.test(bodyPayload.data.email) === false
    ) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    if (await Redis.get(`timeout::${bodyPayload.data.email}`)) {
        return Status.send(req, next, {
            status: 429,
            error: "errors.auth.toomany"
        });
    }

    if (!(await UserController.existsUserByEmail(bodyPayload.data.email))) {
        return Status.send(req, next, {
            status: 409,
            error: "errors.auth.conflict.email"
        });
    }

    const creationToken = AuthController.generateCreationToken(bodyPayload.data.email);
    const creationUrl = globals.env.MAIL_REDIRECT_URL.replace("{token}", creationToken);

    try {
        Redis.set(`timeout::${bodyPayload.data.email}`, true, 50);

        Logger.debug(
            `send-mail.ts::Route_Auth_Sendmail: Sending email to "${bodyPayload.data.email}" with link "${creationUrl}"`
        );

        // TODO: Send email
    } catch (e) {
        Logger.error("send-mail.ts::Route_Auth_Sendmail: Error while sending email", e);
    }

    return Status.send(req, next, {
        status: 201,
        data: isAdmin(req) ? creationUrl : undefined
    });
}
