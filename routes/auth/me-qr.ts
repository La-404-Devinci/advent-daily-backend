import globals from "@/env/env";
import Status from "@/models/status";
import { Request, Response, NextFunction } from "express";
import qr from "qr-base64";

/**
 * Generate a QR code with the user's profile URL.
 * Returns the base64 encoded QR code.
 */
export default async function Route_Auth_MeQr(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return Status.send(req, next, {
            status: 401,
            error: "errors.auth.unauthorized"
        });
    }

    const b64qr = qr(globals.env.PROFILE_REDIRECT_URL.replace("{uuid}", req.user.uuid));

    return Status.send(req, next, {
        status: 200,
        data: b64qr
    });
}
