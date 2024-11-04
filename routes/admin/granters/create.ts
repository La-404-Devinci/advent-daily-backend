import ClubController from "@/controllers/clubs";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const body = z.object({
    clubId: z.number(),
    email: z.string(),
    password: z.string()
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
