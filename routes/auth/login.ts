import AuthController from "@/controllers/auth";
import CypherController from "@/controllers/cypher";
import UserController from "@/controllers/users";
import Status from "@/models/status";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const body = z.object({
    email: z.string(),
    password: z.string()
});

export default async function Route_Auth_Login(req: Request, res: Response, next: NextFunction) {
    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const user = await UserController.getAuthUserByEmail(bodyPayload.data.email);

    if (!user) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    if (!CypherController.verifyPassword(bodyPayload.data.password, user.hashpass)) {
        return Status.send(req, next, {
            status: 401,
            error: "errors.auth.invalid"
        });
    }

    const authToken = AuthController.generateAuthToken(user.email);

    return Status.send(req, next, {
        status: 200,
        data: authToken
    });
}
