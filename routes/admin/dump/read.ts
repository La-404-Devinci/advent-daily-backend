import DB from "@/database/config";
import { acquired } from "@/database/schema/acquired";
import { challenges } from "@/database/schema/challenges";
import { clubs } from "@/database/schema/clubs";
import { granters } from "@/database/schema/granters";
import { users } from "@/database/schema/users";
import Status from "@/models/status";
import { Request, Response, NextFunction } from "express";

export default async function Route_AdminDump_Read(req: Request, res: Response, next: NextFunction) {
    const dumpAcquired = await DB.instance.select().from(acquired);
    const dumpChallenges = await DB.instance.select().from(challenges);
    const dumpClubs = await DB.instance.select().from(clubs);
    const dumpGranters = await DB.instance.select().from(granters);
    const dumpUsers = await DB.instance.select().from(users);

    return Status.send(req, next, {
        status: 200,
        data: {
            acquired: dumpAcquired,
            challenges: dumpChallenges,
            clubs: dumpClubs,
            granters: dumpGranters,
            users: dumpUsers
        }
    });
}
