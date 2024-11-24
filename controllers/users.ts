import DB from "@/database/config";
import { acquired } from "@/database/schema/acquired";
import { challenges } from "@/database/schema/challenges";
import { users } from "@/database/schema/users";
import Logger from "@/log/logger";
import { count, eq } from "drizzle-orm";
import CypherController from "./cypher";

export default abstract class UserController {
    public static async getAllUsersWithDetails() {
        const allUsers = await DB.instance
            .select({
                uuid: users.uuid,
                clubId: users.clubId,
                email: users.email,
                username: users.username,
                avatarUrl: users.avatarUrl,
                quote: users.quote,
                updatedAt: users.updatedAt,
                createdAt: users.createdAt
            })
            .from(users);

        return allUsers;
    }

    public static async updateUserWithDetails(
        uuid: string,
        clubId?: number,
        email?: string,
        password?: string,
        username?: string,
        avatarUrl?: string | null,
        quote?: string
    ) {
        try {
            const user = await DB.instance
                .update(users)
                .set({
                    clubId: clubId,
                    email: email,
                    hashpass: password ? CypherController.hashPassword(password) : undefined,
                    username: username,
                    avatarUrl: avatarUrl,
                    quote: quote
                })
                .where(eq(users.uuid, uuid))
                .returning();

            return user[0];
        } catch (error: unknown) {
            Logger.error("users.ts::updateUser", error);
            return null;
        }
    }

    public static async deleteUser(uuid: string) {
        try {
            const user = await DB.instance.delete(users).where(eq(users.uuid, uuid)).returning();

            return user[0];
        } catch (error: unknown) {
            Logger.error("users.ts::deleteUser", error);
            return null;
        }
    }

    public static async getUser(uuid: string) {
        const user = await DB.instance
            .select({
                uuid: users.uuid,
                username: users.username,
                avatarUrl: users.avatarUrl,
                clubId: users.clubId,
                quote: users.quote
            })
            .from(users)
            .where(eq(users.uuid, uuid))
            .limit(1);

        return user.length ? user[0] : null;
    }

    public static async getAuthUserByEmail(email: string) {
        const user = await DB.instance
            .select({
                uuid: users.uuid,
                email: users.email,
                hashpass: users.hashpass
            })
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        return user.length ? user[0] : null;
    }

    public static async existsUserByEmail(email: string) {
        const user = await DB.instance
            .select({
                count: count(users.email)
            })
            .from(users)
            .where(eq(users.email, email));

        return user[0].count > 0;
    }

    public static async createUser(username: string, email: string, hashpass: string, clubId?: number) {
        try {
            const user = await DB.instance
                .insert(users)
                .values({
                    username: username,
                    email: email,
                    hashpass: hashpass,
                    clubId: clubId
                })
                .returning({
                    uuid: users.uuid,
                    email: users.email,
                    username: users.username,
                    avatarUrl: users.avatarUrl,
                    clubId: users.clubId,
                    quote: users.quote
                });

            return user[0];
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    public static async updateUser(uuid: string, username?: string, avatarUrl?: string | null, quote?: string) {
        try {
            const user = await DB.instance
                .update(users)
                .set({
                    username: username,
                    avatarUrl: avatarUrl,
                    quote: quote
                })
                .where(eq(users.uuid, uuid))
                .returning({
                    uuid: users.uuid,
                    email: users.email,
                    username: users.username,
                    clubId: users.clubId,
                    avatarUrl: users.avatarUrl,
                    quote: users.quote
                });

            return user[0];
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    public static async getChallengesByUser(userUuid: string) {
        const allChallenges = await DB.instance
            .select({
                id: challenges.id,
                clubId: challenges.clubId,
                name: challenges.name,
                score: challenges.score
            })
            .from(challenges)
            .innerJoin(acquired, eq(challenges.id, acquired.challengeId))
            .where(eq(acquired.userUuid, userUuid));

        return allChallenges;
    }
}
