import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

export default function Route_Index(req: Request, res: Response, next: NextFunction) {
    return Status.send(req, next, {
        status: 204
    });
}
