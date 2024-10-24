import DB from "@/database/config";
import { users } from "@/database/schema/users";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const body = z.object({
    firstName: z.string()
});

export default async function Route_PostUsers(req: Request, res: Response, next: NextFunction) {
    const payload = body.safeParse(req.body);
    if (!payload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const user = await DB.instance
        .insert(users)
        .values(payload.data)
        .returning({ id: users.id, firstName: users.firstName });

    if (user.length !== 1) {
        return Status.send(req, next, {
            status: 500,
            error: "errors.database"
        });
    }

    return Status.send(req, next, {
        status: 200,
        data: user[0]
    });
}
