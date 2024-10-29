import globals from "@/env/env";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

export default function middlewareAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.header("X-Admin-Key") !== globals.env.ADMIN_TOKEN) {
        return Status.send(req, next, {
            status: 401,
            error: "errors.auth.admin"
        });
    }

    return next();
}
