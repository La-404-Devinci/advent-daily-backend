import UserController from "@/controllers/users";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { string, z } from "zod";

const params = z.object({
    id: string()
});

/**
 * Handles the GET /users/:id route.
 * Retrieves the user with the given id
 * and sends a response with a status of 200 and the user data and challenges.
 *
 * If the id is invalid, sends a response with a status of 400 and an error message.
 * If the user does not exist, sends a response with a status of 404 and an error message.
 */
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

    const challenges = await UserController.getChallengesByUser(payload.data.id);

    return Status.send(req, next, {
        status: 200,
        data: {
            user: user,
            challenges: challenges
        }
    });
}
