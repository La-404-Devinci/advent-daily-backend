import globals from "@/env/env";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

export const isAdmin = (req: Request) => {
    return req.header("X-Admin-Key") === globals.env.ADMIN_TOKEN;
};

export default function middlewareAdmin(req: Request, res: Response, next: NextFunction) {
    if (!isAdmin(req)) {
        return Status.send(req, next, {
            status: 401,
            error: "errors.auth.admin"
        });
    }

    return next();
}
