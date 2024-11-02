import ChallengesController from "@/controllers/challenges";
import { znumber } from "@/env/extras";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const params = z.object({
    id: znumber()
});

const body = z.object({
    score: z.number().optional(),
    name: z.string().optional()
});

export default async function Route_AdminChallenges_Update(req: Request, res: Response, next: NextFunction) {
    const bodyPayload = body.safeParse(req.body);
    const paramsPayload = params.safeParse(req.params);

    if (!paramsPayload.success || !bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const challenge = await ChallengesController.getChallengeWithDetails(paramsPayload.data.id);

    if (!challenge) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    const updatedChallenge = await ChallengesController.updateChallenge(
        paramsPayload.data.id,
        bodyPayload.data.score,
        bodyPayload.data.name
    );

    if (!updatedChallenge) {
        return Status.send(req, next, {
            status: 500,
            error: "system.internal"
        });
    }

    return Status.send(req, next, {
        status: 200,
        data: updatedChallenge
    });
}
