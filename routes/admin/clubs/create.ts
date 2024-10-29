import ClubController from "@/controllers/clubs";
import { zdate } from "@/env/extras";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const body = z.object({
    name: z.string(),
    avatarUrl: z.string(),
    description: z.string().optional(),
    dailyDate: zdate().optional()
});

export default async function Route_AdminClubs_Create(req: Request, res: Response, next: NextFunction) {
    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const club = await ClubController.createClub(
        bodyPayload.data.name,
        bodyPayload.data.avatarUrl,
        bodyPayload.data.description,
        bodyPayload.data.dailyDate
    );

    if (!club) {
        return Status.send(req, next, {
            status: 500,
            error: "system.internal"
        });
    }

    return Status.send(req, next, {
        status: 201,
        data: club
    });
}
