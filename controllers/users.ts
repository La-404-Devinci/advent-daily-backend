import DB from "@/database/config";
import { users } from "@/database/schema/users";
import Logger from "@/log/logger";
import { count, eq } from "drizzle-orm";

export default abstract class UserController {
    public static async getUser(uuid: string) {
        const user = await DB.instance
            .select({
                uuid: users.uuid,
                clubId: users.clubId,
                username: users.username,
                avatarUrl: users.avatarUrl
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

    public static async createUser(username: string, email: string, hashpass: string) {
        try {
            // return all columns but the haspass
            const user = await DB.instance
                .insert(users)
                .values({
                    username: username,
                    email: email,
                    hashpass: hashpass
                })
                .returning({
                    uuid: users.uuid,
                    clubId: users.clubId,
                    username: users.username,
                    avatarUrl: users.avatarUrl,
                    createdAt: users.createdAt,
                    updatedAt: users.updatedAt,
                    quote: users.quote,
                    email: users.email
                });

            return user[0];
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    public static async updateUser(username?: string, avatarUrl?: string) {
        try {
            const user = await DB.instance
                .update(users)
                .set({
                    username: username,
                    avatarUrl: avatarUrl
                })
                .returning();

            return user[0];
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }
}
