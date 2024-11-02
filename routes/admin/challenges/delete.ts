import ChallengesController from "@/controllers/challenges";
import { znumber } from "@/env/extras";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const params = z.object({
    id: znumber()
});

export default async function Route_AdminChallenges_Delete(req: Request, res: Response, next: NextFunction) {
    const paramsPayload = params.safeParse(req.params);

    if (!paramsPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const challenge = await ChallengesController.getChallenge(paramsPayload.data.id);

    if (!challenge) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    await ChallengesController.deleteChallenge(paramsPayload.data.id);

    return Status.send(req, next, {
        status: 204
    });
}
