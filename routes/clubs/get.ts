import ClubController from "@/controllers/clubs";
import { znumber } from "@/env/extras";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const params = z.object({
    id: znumber()
});

/**
 * Get a club by id
 */
export default async function Route_Clubs_Get(req: Request, res: Response, next: NextFunction) {
    const payload = params.safeParse(req.params);
    if (!payload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const club = await ClubController.getClub(payload.data.id);

    if (!club) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    return Status.send(req, next, {
        status: 200,
        data: club
    });
}
