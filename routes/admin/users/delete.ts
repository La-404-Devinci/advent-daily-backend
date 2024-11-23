import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import Status from "@/models/status";
import UserController from "@/controllers/users";

const params = z.object({
    id: z.string()
});

export default async function Route_AdminUsers_Delete(req: Request, res: Response, next: NextFunction) {
    const paramsPayload = params.safeParse(req.params);

    if (!paramsPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const user = await UserController.deleteUser(paramsPayload.data.id);

    if (!user) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    return Status.send(req, next, {
        status: 200,
        data: user
    });
}
