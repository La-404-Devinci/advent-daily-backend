import DB from "@/database/config";
import { acquired } from "@/database/schema/acquired";
import { challenges } from "@/database/schema/challenges";
import { clubs } from "@/database/schema/clubs";
import { granters } from "@/database/schema/granters";
import { users } from "@/database/schema/users";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const body = z.object({
    type: z.enum(["acquired", "challenges", "clubs", "granters", "users"]),
    data: z.array(z.any())
});

export default async function Route_AdminDump_Write(req: Request, res: Response, next: NextFunction) {
    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    try {
        switch (bodyPayload.data.type) {
            case "acquired":
                await DB.instance.insert(acquired).values(bodyPayload.data.data);
                break;
            case "challenges":
                await DB.instance.insert(challenges).values(bodyPayload.data.data);
                break;
            case "clubs":
                await DB.instance.insert(clubs).values(bodyPayload.data.data);
                break;
            case "granters":
                await DB.instance.insert(granters).values(bodyPayload.data.data);
                break;
            case "users":
                await DB.instance.insert(users).values(bodyPayload.data.data);
                break;
            default:
                return Status.send(req, next, {
                    status: 400,
                    error: "errors.validation"
                });
        }
    } catch (e) {
        return Status.send(req, next, {
            status: 200,
            data: {
                success: false,
                error: e
            }
        });
    }

    return Status.send(req, next, {
        status: 200,
        data: {
            success: true,
            error: null
        }
    });
}
