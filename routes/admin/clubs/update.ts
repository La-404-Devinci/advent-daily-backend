import ClubController from "@/controllers/clubs";
import { zdate, znumber } from "@/env/extras";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const params = z.object({
    id: znumber()
});

const body = z.object({
    name: z.string().optional(),
    avatarUrl: z.string().optional(),
    description: z.string().optional(),
    dailyDate: zdate().optional()
});

export default async function Route_AdminClubs_Update(req: Request, res: Response, next: NextFunction) {
    const paramsPayload = params.safeParse(req.params);
    const bodyPayload = body.safeParse(req.body);

    if (!paramsPayload.success || !bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const club = await ClubController.getClubWithDetails(paramsPayload.data.id);

    if (!club) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    const updatedClub = await ClubController.updateClub(
        paramsPayload.data.id,
        bodyPayload.data.name || club.name,
        bodyPayload.data.avatarUrl || club.avatarUrl,
        bodyPayload.data.description || club.description || undefined,
        bodyPayload.data.dailyDate || club.dailyDate || undefined
    );

    return Status.send(req, next, {
        status: 200,
        data: {
            from: club,
            to: updatedClub
        }
    });
}
