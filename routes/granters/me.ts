import Status from "@/models/status";
import { Request, Response, NextFunction } from "express";

export default async function Route_Granters_Me(req: Request, res: Response, next: NextFunction) {
    if (!req.granters) {
        return Status.send(req, next, {
            status: 401,
            error: "errors.auth.granters"
        });
    }

    return Status.send(req, next, {
        status: 200,
        data: {
            clubId: req.granters.clubId,
            email: req.granters.email
        }
    });
}
