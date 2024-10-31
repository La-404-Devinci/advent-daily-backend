import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

/**
 * Handles the / route.
 * Sends a response with a status of 204 and no data.
 */
export default function Route_Index_Read(req: Request, res: Response, next: NextFunction) {
    return Status.send(req, next, {
        status: 204
    });
}
