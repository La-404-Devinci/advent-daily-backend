import UserController from "@/controllers/users";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { string, z } from "zod";

const params = z.object({
    id: string()
});

export default async function Route_Users_Get(req: Request, res: Response, next: NextFunction) {
    const payload = params.safeParse(req.params);
    if (!payload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const user = await UserController.getUser(payload.data.id);

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
