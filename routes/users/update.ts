import UserController from "@/controllers/users";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { string, z } from "zod";

const params = z.object({
    id: string()
});

const body = z.object({
    username: z.string().optional(),
    avatarUrl: z.string().optional(),
    quote: z.string().optional()
});

export default async function Route_Users_Update(req: Request, res: Response, next: NextFunction) {
    const paramsPayload = params.safeParse(req.params);
    const bodyPayload = body.safeParse(req.body);

    if (!paramsPayload.success || !bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const user = await UserController.getUser(paramsPayload.data.id);

    if (!user) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    const updatedUser = await UserController.updateUser(
        user.uuid,
        bodyPayload.data.username || user.username,
        bodyPayload.data.avatarUrl || user.avatarUrl || undefined,
        bodyPayload.data.quote || undefined
    );

    if (!updatedUser) {
        return Status.send(req, next, {
            status: 500,
            error: "errors.server"
        });
    }

    return Status.send(req, next, {
        status: 200,
        data: updatedUser
    });
}
