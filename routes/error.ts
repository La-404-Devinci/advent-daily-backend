import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

export default function Route_Error(req: Request, res: Response, next: NextFunction) {
    return Status.send(req, next, {
        status: 400,
        error: "errors.template"
    });
}
