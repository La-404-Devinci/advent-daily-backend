import ChallengesController from "@/controllers/challenges";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const body = z.object({
    clubId: z.number(),
    score: z.number(),
    name: z.string()
});

export default async function Route_AdminChallenges_Create(req: Request, res: Response, next: NextFunction) {
    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const challenge = await ChallengesController.createChallenge(
        bodyPayload.data.clubId,
        bodyPayload.data.score,
        bodyPayload.data.name
    );

    if (!challenge) {
        return Status.send(req, next, {
            status: 500,
            error: "system.internal"
        });
    }

    return Status.send(req, next, {
        status: 201,
        data: challenge
    });
}
