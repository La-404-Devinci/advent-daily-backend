import DB from "@/database/config";
import Redis from "@/database/redis";
import { acquired } from "@/database/schema/acquired";
import { challenges } from "@/database/schema/challenges";
import { users } from "@/database/schema/users";
import Logger from "@/log/logger";
import { eq, sum } from "drizzle-orm";

export default abstract class LeaderboardController {

    public static async getLeaderboard() {
        const leaderboardUuids = await Redis.sortedAll<string>("leaderboard");
        const allUsers = await DB.instance
            .select({
                uuid: users.uuid,
                username: users.username,
                quote: users.quote,
                avatarUrl: users.avatarUrl,
            })
            .from(users)

        const usersMap = new Map(allUsers.map(user => [user.uuid, user])) 
        return leaderboardUuids.map(set => ({
            score: set.score,
            user: usersMap.get(set.value)
        }))
    }

    public static async grant(userUuid: string, challengeId: number) {
        // Create a new acquired record
        try {
            await DB.instance
                .insert(acquired)
                .values({
                    userUuid: userUuid,
                    challengeId: challengeId
                })            
                
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
            .where(eq(acquired.userUuid, userUuid))        

        if (userScoreRequest.length !== 1) return false;
        const userScore = parseInt(userScoreRequest[0].score ?? "0");

        // Add/update the user's score in the leaderboard  
        await Redis.sortedSet("leaderboard", userScore, userUuid);
        
        // Add ETag to the user's leaderboard
        await Redis.set(`leaderboard:etag`, crypto.randomUUID());

        return true;
    }
}