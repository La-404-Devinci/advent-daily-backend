import DB from "@/database/config";
import { users } from "@/database/schema/users";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

export default async function Route_GetUsers(req: Request, res: Response, next: NextFunction) {
    const allUsers = await DB.instance.select().from(users);

    return Status.send(req, next, {
        status: 200,
        data: allUsers
    });
}
