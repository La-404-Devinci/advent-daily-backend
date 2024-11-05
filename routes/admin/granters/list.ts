import GrantersController from "@/controllers/granters";
import { znumber } from "@/env/extras";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const query = z.object({
    clubId: znumber().optional()
});

export default async function Route_AdminGranters_List(req: Request, res: Response, next: NextFunction) {
    const queryPayload = query.safeParse(req.query);

    if (!queryPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    if (queryPayload.data.clubId) {
        return Status.send(req, next, {
            status: 200,
            data: await GrantersController.getGrantersByClubId(queryPayload.data.clubId)
        });
    }

    return Status.send(req, next, {
        status: 200,
        data: await GrantersController.getAllGranters()
    });
}
