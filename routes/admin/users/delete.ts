import LeaderboardController from "@/controllers/leaderboard";
import UserController from "@/controllers/users";
import Status from "@/models/status";
import SocketIO from "@/socket/socket";
import { InvalidationSubject } from "@/socket/types";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

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

    LeaderboardController.revalidate(user.uuid, user.clubId);
    SocketIO.sendInvalidationNotification(InvalidationSubject.LEADERBOARD);

    return Status.send(req, next, {
        status: 200,
        data: user
    });
}
