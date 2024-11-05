import { znumber } from "@/env/extras";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const body = z.object({
    userUuid: z.string(),
    challengeId: znumber()
});

export default async function Route_Granters_Grant(req: Request, res: Response, next: NextFunction) {
    if (!req.granters) {
        return Status.send(req, next, {
            status: 401,
            error: "errors.auth.granters"
        });
    }

    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    return Status.send(req, next, {
        status: 500,
        error: "not.implemented.yet"
    });
}
