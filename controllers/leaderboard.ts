import DB from "@/database/config";
import Redis from "@/database/redis";
import { acquired } from "@/database/schema/acquired";
import { challenges } from "@/database/schema/challenges";
import { users } from "@/database/schema/users";
import Logger from "@/log/logger";
import { eq, sum } from "drizzle-orm";
import UserController from "./users";
import { clubs } from "@/database/schema/clubs";
import ClubController from "./clubs";

export default abstract class LeaderboardController {
    public static async getLeaderboardEtag() {
        return await Redis.get<string>("leaderboard:etag");
    }

    public static async getUserLeaderboard() {
        const leaderboardUuids = await Redis.sortedAll<string>("leaderboard:users");
        const allUsers = await DB.instance
            .select({
                uuid: users.uuid,
                username: users.username,
                quote: users.quote,
                avatarUrl: users.avatarUrl
            })
            .from(users);

        const usersMap = new Map(allUsers.map((user) => [user.uuid, user]));
        return leaderboardUuids.map((set) => ({
            score: set.score,
            user: usersMap.get(set.value)
        }));
    }

    public static async getClubLeaderboard() {
        const leaderboardUuids = await Redis.sortedAll<number>(`leaderboard:clubs`);
        const allClubs = await ClubController.getAllClubs();

        const clubsMap = new Map(allClubs.map((club) => [club.id, club]));
        return leaderboardUuids.map((set) => ({
            score: set.score,
            club: clubsMap.get(set.value)
        }));
    }

    public static async grant(userUuid: string, challengeId: number) {
        // Check if the user exists
        const user = await UserController.getUser(userUuid);
        if (!user) return false;

        // Create a new acquired record
        try {
            await DB.instance.insert(acquired).values({
                userUuid: userUuid,
                challengeId: challengeId
            });
        } catch (error: unknown) {
            Logger.error("leaderboard.ts::grant", error);
            return false;
        }

        const userScoreRequest = await DB.instance
            .select({
                score: sum(challenges.score).as("score")
            })
            .from(acquired)
            .innerJoin(challenges, eq(acquired.challengeId, challenges.id))
            .where(eq(acquired.userUuid, userUuid));

        if (userScoreRequest.length !== 1) return false;
        const userScore = parseInt(userScoreRequest[0].score ?? "0");

        // Add/update the user's score in the leaderboard
        await Redis.sortedSet("leaderboard:users", userScore, userUuid);

        if (user.clubId) {
            // Add/update the club's score in the leaderboard

            //! Not sure if this is the MORE efficient way but,
            // every granter is a physical person. so they can't
            // grant a lot of challenges per second and overload
            // the server. That said, it's not that bad.

            const clubScoreRequest = await DB.instance
                .select({
                    score: sum(challenges.score).as("score")
                })
                .from(clubs)
                .innerJoin(users, eq(clubs.id, users.clubId))
                .innerJoin(acquired, eq(users.uuid, acquired.userUuid))
                .where(eq(clubs.id, user.clubId));

            if (clubScoreRequest.length !== 1) return false;
            const clubScore = parseInt(clubScoreRequest[0].score ?? "0");

            await Redis.sortedSet(`leaderboard:clubs`, clubScore, user.clubId);
        }

        // Add ETag to the user's leaderboard
        await Redis.set(`leaderboard:etag`, crypto.randomUUID());

        return true;
    }
}