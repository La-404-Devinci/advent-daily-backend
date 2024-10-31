import Status from "@/models/status";
import { Request, Response, NextFunction } from "express";

/**
 * Returns the authenticated user's UUID
 */
export default async function Route_Auth_Me(req: Request, res: Response, next: NextFunction) {
    if (!req.user) {
        return Status.send(req, next, {
            status: 401,
            error: "errors.auth.unauthorized"
        });
    }

    return Status.send(req, next, {
        status: 200,
        data: req.user.uuid
    });
}
