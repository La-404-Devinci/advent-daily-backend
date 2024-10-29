import ClubController from "@/controllers/clubs";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

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
