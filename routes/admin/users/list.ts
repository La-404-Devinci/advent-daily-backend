import { NextFunction, Request, Response } from "express";
import UserController from "@/controllers/users";
import Status from "@/models/status";

export default async function Route_AdminUsers_List(req: Request, res: Response, next: NextFunction) {
    return Status.send(req, next, {
        status: 200,
        data: await UserController.getAllUsersWithDetails()
    });
}
