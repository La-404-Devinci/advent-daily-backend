import AuthController from "@/controllers/auth";
import UserController from "@/controllers/users";
import Redis from "@/database/redis";
import EmailTemplate from "@/email/email";
import globals from "@/env/env";
import Logger from "@/log/logger";
import { isAdmin } from "@/middlewares/auth/admin";
import Status from "@/models/status";
import { sendEmail } from "@/utils/email";
import { render } from "@react-email/components";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const body = z.object({
    /**
     * Validates an email address
     * - It must end with @edu.devinci.fr
     * - It must be a valid email
     */
    email: z.string()
});

/**
 * Send an email to the specified email address
 * to create a user.
 *
 * The email address must end with @edu.devinci.fr
 * and must not be used by an existing user.
 *
 * Returns the URL of the creation page if the
 * request is from an admin (X-ADMIN-KEY header).
 */
export default async function Route_Auth_Sendmail(req: Request, res: Response, next: NextFunction) {
    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const parsedEmail = bodyPayload.data.email.toLowerCase().replace(/\./g, "").replace(/\+.*@/g, "@");

    if (!isAdmin(req)) {
        if (/^[a-zA-Z0-9._%-]+@edu\.devinci\.fr$/.test(parsedEmail) === false) {
            return Status.send(req, next, {
                status: 400,
                error: "errors.auth.invalid.email"
            });
        }
    } else {
        const reasonIsDev = globals.env.NODE_ENV !== "production";
        const reasonIsAdmin = isAdmin(req);
        Logger.debug(
            `send-mail.ts::Route_Auth_Sendmail: Skipping email verification, reason: (isDev: ${reasonIsDev}, isAdmin: ${reasonIsAdmin})`
        );
    }

    if (await Redis.get(`timeout::${parsedEmail}`)) {
        return Status.send(req, next, {
            status: 429,
            error: "errors.auth.toomany"
        });
    }

    if (await UserController.existsUserByEmail(parsedEmail)) {
        return Status.send(req, next, {
            status: 409,
            error: "errors.auth.conflict.email"
        });
    }

    const creationToken = AuthController.generateCreationToken(parsedEmail, !isAdmin(req));
    const creationUrl = globals.env.MAIL_REDIRECT_URL.replace("{token}", creationToken);

    try {
        Logger.debug(`send-mail.ts::Route_Auth_Sendmail: Sending email to "${parsedEmail}" with link "${creationUrl}"`);

        // Render the email template
        const emailHtml = await render(EmailTemplate({ baseUrl: globals.env.MAIL_ASSETS_URL, magicLink: creationUrl }));

        // Send the email with Nodemailer
        if (isAdmin(req)) {
            Logger.debug(`send-mail.ts::Route_Auth_Sendmail: Skipping email sending (as admin)`);
        } else {
            await sendEmail(emailHtml, parsedEmail);
        }

        Redis.set(`timeout::${parsedEmail}`, true, 50);
    } catch (e) {
        Logger.error("send-mail.ts::Route_Auth_Sendmail: Error while sending email", e);
        return Status.send(req, next, {
            status: 500,
            error: "errors.auth.email.failed"
        });
    }

    return Status.send(req, next, {
        status: 201,
        data: isAdmin(req) ? creationUrl : undefined
    });
}
