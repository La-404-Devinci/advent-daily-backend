import ChallengesController from "@/controllers/challenges";
import ClubController from "@/controllers/clubs";
import LeaderboardController from "@/controllers/leaderboard";
import { znumber } from "@/env/extras";
import Status from "@/models/status";
import SocketIO from "@/socket/socket";
import { InvalidationSubject } from "@/socket/types";
import { isDailyDate } from "@/utils/date";
import { NextFunction, Request, Response } from "express";
import { z } from "zod";

const body = z.object({
    userUuid: z.string(),
    challengeId: znumber()
});

export default async function Route_Granters_Grant(req: Request, res: Response, next: NextFunction) {
    if (!req.granters) {
        return Status.send(req, next, {
            status: 401,
            error: "errors.auth.granters"
        });
    }

    const bodyPayload = body.safeParse(req.body);

    if (!bodyPayload.success) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.validation"
        });
    }

    // Check if the challenge exists
    const challenge = await ChallengesController.getChallengeWithDetails(bodyPayload.data.challengeId);
    if (!challenge) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    // Check if the granter is allowed to grant
    if (req.granters.clubId !== challenge.clubId) {
        return Status.send(req, next, {
            status: 403,
            error: "errors.granters.notAllowed"
        });
    }

    // Check if the challenge is daily
    const club = await ClubController.getClubWithDetails(challenge.clubId);
    if (!club) {
        return Status.send(req, next, {
            status: 404,
            error: "errors.notFound"
        });
    }

    if (!club.dailyDate || !isDailyDate(club.dailyDate)) {
        return Status.send(req, next, {
            status: 400,
            error: "errors.granters.notDaily"
        });
    }

    // Grant the challenge
    const grantStatus = await LeaderboardController.grant(bodyPayload.data.userUuid, bodyPayload.data.challengeId);
    if (!grantStatus) {
        return Status.send(req, next, {
            status: 500,
            error: "system.internal"
        });
    }

    SocketIO.sendInvalidationNotification(InvalidationSubject.LEADERBOARD);

    return Status.send(req, next, {
        status: 500,
        error: "not.implemented.yet"
    });
}
