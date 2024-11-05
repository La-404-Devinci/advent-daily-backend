import AuthController from "@/controllers/auth";
import UserController from "@/controllers/users";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

export default async function middlewareUser(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization");
    const authorizationType = req.header("Authorization-Type") || "user";

    if (!authorization || !authorization.startsWith("Bearer ") || authorizationType !== "user") return next();

    const token = authorization.split("Bearer ")[1];
    if (!token) return next();

    const userEmail = AuthController.validateAuthToken(token);
    if (!userEmail) return next();

    if (!(await UserController.existsUserByEmail(userEmail))) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    const user = await UserController.getAuthUserByEmail(userEmail);

    if (!user) return next();

    req.user = {
        uuid: user.uuid,
        email: user.email
    };

    return next();
}
