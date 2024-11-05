import LeaderboardController from "@/controllers/leaderboard";
import Status from "@/models/status";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const query = z.object({
    type: z.enum(["users", "clubs"]).default("users")
});

export default async function Route_Leaderboard_Read(req: Request, res: Response, next: NextFunction) {
    const queryPayload = query.safeParse(req.query);

    if (!queryPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    if (queryPayload.data.type === "users") {
        return Status.send(req, next, {
            status: 200,
            data: await LeaderboardController.getUserLeaderboard()
        });
    }

    // return Status.send(req, next, {
    //     status: 200,
    //     data: await LeaderboardController.getClubLeaderboard()
    // })
}
