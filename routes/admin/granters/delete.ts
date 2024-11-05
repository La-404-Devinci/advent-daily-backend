import GrantersController from "@/controllers/granters";
import { znumber } from "@/env/extras";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const params = z.object({
    id: znumber()
});

export default async function Route_AdminGranters_Delete(req: Request, res: Response, next: NextFunction) {
    const paramsPayload = params.safeParse(req.params);

    if (!paramsPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    await GrantersController.deleteGranters(paramsPayload.data.id);

    return Status.send(req, next, {
        status: 204
    });
}
