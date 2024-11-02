import ChallengesController from "@/controllers/challenges";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

/**
 * Handles the /daily/challenges route.
 * Retrieves the daily challenges information.
 * Sends a response with a status of 200 and the challenges information.
 */
export default async function Route_DailyChallenges_Get(req: Request, res: Response, next: NextFunction) {
    const challenges = await ChallengesController.getDailyChallenges();

    if (!challenges) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    return Status.send(req, next, {
        status: 200,
        data: challenges
    });
}
