import ClubController from "@/controllers/clubs";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

export default async function Route_AdminClubs_List(req: Request, res: Response, next: NextFunction) {
    return Status.send(req, next, {
        status: 200,
        data: await ClubController.getAllClubsWithDetails()
    });
}
