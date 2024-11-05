import GrantersController from "@/controllers/granters";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const body = z.object({
    clubId: z.number(),
    email: z.string()
});

export default async function Route_AdminGranters_Create(req: Request, res: Response, next: NextFunction) {
    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const randomPassword = crypto.randomUUID();

    const granter = await GrantersController.createGranters(
        bodyPayload.data.clubId,
        bodyPayload.data.email,
        randomPassword
    );

    if (!granter) {
        return Status.send(req, next, {
            status: 500,
            error: "system.internal"
        });
    }

    return Status.send(req, next, {
        status: 201,
        data: granter
    });
}
