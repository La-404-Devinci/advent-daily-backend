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
        avatarUrl: users.avatarUrl,
      })
      .from(users)
      .where(eq(users.uuid, uuid))
      .limit(1);
      
    return user.length ? user[0] : null;
  }

  public static async existsUserByEmail(email: string) {
    const user = await DB.instance
      .select({
        count: count(users.email),
      })
      .from(users)
      .where(eq(users.email, email))
      
    return user[0].count > 0;
  }

  public static async createUser(username: string, email: string, hashpass: string) {
    try {
      const user = await DB.instance
        .insert(users)
        .values({
          email: email,
          username: username,
          hashpass: hashpass,
        })
        .returning();

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
          avatarUrl: avatarUrl,
        })
        .returning();

      return user[0];
    } catch (error) {
      Logger.error(error);
      return null;
    }
  }

}