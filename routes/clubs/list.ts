import ClubController from "@/controllers/clubs";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

/**
 * Handles the route for listing all clubs.
 * Sends a response with a status of 200 and the list of all clubs.
 */
export default async function Route_Clubs_List(req: Request, res: Response, next: NextFunction) {
    return Status.send(req, next, {
        status: 200,
        data: await ClubController.getAllClubs()
    });
}
