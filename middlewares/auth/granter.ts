import AuthController from "@/controllers/auth";
import GrantersController from "@/controllers/granters";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";

export default async function middlewareGranter(req: Request, res: Response, next: NextFunction) {
    const authorization = req.header("Authorization");
    const authorizationType = req.header("Authorization-Type") || "user";

    if (!authorization || !authorization.startsWith("Bearer ") || authorizationType !== "granter") return next();

    const token = authorization.split("Bearer ")[1];
    if (!token) return next();

    const granterEmail = AuthController.validateGranterAuthToken(token);
    if (!granterEmail) return next();

    const granter = await GrantersController.getGranterByEmail(granterEmail);

    if (!granter) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    req.granters = {
        id: granter.id,
        email: granter.email,
        clubId: granter.clubId
    };

    return next();
}
