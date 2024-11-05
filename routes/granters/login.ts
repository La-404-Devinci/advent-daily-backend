import AuthController from "@/controllers/auth";
import CypherController from "@/controllers/cypher";
import GrantersController from "@/controllers/granters";
import Status from "@/models/status";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const body = z.object({
    email: z.string(),
    password: z.string()
});

/**
 * Handles the login route.
 */
export default async function Route_Granters_Login(req: Request, res: Response, next: NextFunction) {
    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    const granter = await GrantersController.getGranterByEmail(bodyPayload.data.email);

    if (!granter) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.granters.notFound"
        });
    }

    if (!CypherController.verifyPassword(bodyPayload.data.password, granter.password)) {
        return Status.send(req, next, {
            status: 401,
            error: "errors.auth.invalid.credentials"
        });
    }

    const authToken = AuthController.generateGranterAuthToken(granter.password);

    return Status.send(req, next, {
        status: 200,
        data: {
            token: authToken,
            clubId: granter.clubId
        }
    });
}
