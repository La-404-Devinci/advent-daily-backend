import ClubController from "@/controllers/clubs";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

/**
 * Handles the /daily route.
 * Retrieves the daily club information.
 * Sends a response with a status of 200 and the daily club information.
 */
export default async function Route_Daily_Read(req: Request, res: Response, next: NextFunction) {
    const club = await ClubController.getDailyClub();

    if (!club) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    return Status.send(req, next, {
        status: 200,
        data: club
    });
}
