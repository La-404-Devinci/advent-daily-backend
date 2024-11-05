import LeaderboardController from "@/controllers/leaderboard";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

export default async function Route_Leaderboard_Etag(req: Request, res: Response, next: NextFunction) {
    return Status.send(req, next, {
        status: 200,
        data: await LeaderboardController.getLeaderboardEtag()
    });
}
