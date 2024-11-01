import ChallengesController from "@/controllers/challenges";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

export default async function Route_AdminChallenges_List(req: Request, res: Response, next: NextFunction) {
    return Status.send(req, next, {
        status: 200,
        data: await ChallengesController.getAllChallengesWithDetails()
    });
}