import DB from "@/database/config";
import { challenges } from "@/database/schema/challenges";
import { eq } from "drizzle-orm";

export default abstract class ChallengesController {
    public static async getAllChallengesWithDetails() {
        const allChallenges = await DB.instance
            .select({
                id: challenges.id,
                name: challenges.name,
                score: challenges.score,
                clubId: challenges.clubId
            })
            .from(challenges);

        return allChallenges;
    }

    public static async getChallenge(id: number) {
        const challenge = await DB.instance
            .select({
                id: challenges.id,
                name: challenges.name,
                score: challenges.score
            })
            .from(challenges)
            .where(eq(challenges.id, id))
            .limit(1);

        return challenge.length ? challenge[0] : null;
    }

    public static async getChallengeWithDetails(id: number) {
        const challenge = await DB.instance
            .select({
                id: challenges.id,
                name: challenges.name,
                score: challenges.score,
                clubId: challenges.clubId
            })
            .from(challenges)
            .where(eq(challenges.id, id));

        return challenge.length ? challenge[0] : null;
    }

    public static async createChallenge(clubId: number, score: number, name: string) {
        const challenge = await DB.instance
            .insert(challenges)
            .values({
                clubId,
                score,
                name
            })
            .returning({
                id: challenges.id,
                name: challenges.name,
                score: challenges.score,
                clubId: challenges.clubId
            });

        return challenge.length ? challenge[0] : null;
    }

    public static async updateChallenge(id: number, score?: number, name?: string) {
        const challenge = await DB.instance
            .update(challenges)
            .set({
                score,
                name
            })
            .where(eq(challenges.id, id))
            .returning({
                id: challenges.id,
                name: challenges.name,
                score: challenges.score,
                clubId: challenges.clubId
            });

        return challenge.length ? challenge[0] : null;
    }

    public static async deleteChallenge(id: number) {
        await DB.instance.delete(challenges).where(eq(challenges.id, id));
    }

    public static async getDailyChallenges() {}
}
