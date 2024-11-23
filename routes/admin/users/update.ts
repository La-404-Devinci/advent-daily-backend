import { NextFunction, Request, Response } from "express";
import { znumber } from "@/env/extras";
import { z } from "zod";
import Status from "@/models/status";
import UserController from "@/controllers/users";

const params = z.object({
    id: z.string()
});

const body = z.object({
    clubId: znumber().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    username: z.string().optional(),
    avatarUrl: z.string().optional(),
    quote: z.string().optional()
});

export default async function Route_AdminUsers_Update(req: Request, res: Response, next: NextFunction) {
    const paramsPayload = params.safeParse(req.params);
    const bodyPayload = body.safeParse(req.body);

    if (!paramsPayload.success || !bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const user = await UserController.updateUserWithDetails(
        paramsPayload.data.id,
        bodyPayload.data.clubId || undefined,
        bodyPayload.data.email || undefined,
        bodyPayload.data.password || undefined,
        bodyPayload.data.username || undefined,
        bodyPayload.data.avatarUrl || undefined,
        bodyPayload.data.quote || undefined
    );

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
