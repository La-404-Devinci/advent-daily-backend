import AuthController from "@/controllers/auth";
import ClubController from "@/controllers/clubs";
import CypherController from "@/controllers/cypher";
import LeaderboardController from "@/controllers/leaderboard";
import UserController from "@/controllers/users";
import { znumber } from "@/env/extras";
import Status from "@/models/status";
import SocketIO from "@/socket/socket";
import { InvalidationSubject } from "@/socket/types";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const body = z.object({
    username: z.string().max(20),
    avatar: z.string().optional(),
    email: z.string(),
    password: z.string(),
    token: z.string(),
    clubId: znumber().optional()
});

/**
 * Handles the create user route.
 * Creates a new user and returns it.
 */
export default async function Route_Users_Create(req: Request, res: Response, next: NextFunction) {
    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const token = bodyPayload.data.token;
    const tokenPayload = AuthController.validateCreationToken(token);

    if (!tokenPayload) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.auth.invalid.token"
        });
    }

    if (tokenPayload !== bodyPayload.data.email) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.auth.invalid.email"
        });
    }

    if (bodyPayload.data.clubId) {
        const clubExists = await ClubController.getClub(bodyPayload.data.clubId);

        if (!clubExists) {
            return Status.send(req, next, {
                status: 404,
                error: "errors.clubs.notFound"
            });
        }
    }

    const userExists = await UserController.existsUserByEmail(bodyPayload.data.email);

    if (userExists) {
        return Status.send(req, next, {
            status: 409,
            error: "errors.auth.conflict.email"
        });
    }

    const user = await UserController.createUser(
        bodyPayload.data.username,
        bodyPayload.data.email,
        CypherController.hashPassword(bodyPayload.data.password),
        bodyPayload.data.clubId
    );

    if (!user) {
        return Status.send(req, next, {
            status: 409,
            error: "errors.auth.conflict.username"
        });
    }

    LeaderboardController.revalidate(user.uuid, user.clubId);
    SocketIO.sendInvalidationNotification(InvalidationSubject.LEADERBOARD);

    return Status.send(req, next, {
        status: 201,
        data: user
    });
}
