import DB from "@/database/config";
import { granters } from "@/database/schema/granters";
import { eq } from "drizzle-orm";
import CypherController from "./cypher";
import Logger from "@/log/logger";

export default abstract class GrantersController {
    public static async getAllGranters() {
        const allGranters = await DB.instance
            .select({
                id: granters.id,
                email: granters.email,
                clubId: granters.clubId
            })
            .from(granters);

        return allGranters;
    }

    public static async getGrantersByClubId(clubId: number) {
        const allGranters = await DB.instance
            .select({
                id: granters.id,
                email: granters.email,
                clubId: granters.clubId
            })
            .from(granters)
            .where(eq(granters.clubId, clubId));

        return allGranters;
    }

    public static async createGranter(clubId: number, email: string, password: string) {
        const hashpass = CypherController.hashPassword(password);

        try {
            const granter = await DB.instance
                .insert(granters)
                .values({
                    clubId: clubId,
                    email: email,
                    password: hashpass
                })
                .returning({
                    id: granters.id,
                    clubId: granters.clubId,
                    email: granters.email
                });

            return granter[0];
        } catch (error) {
            Logger.error("granters.ts::createGranters | Error creating granters", error);
            return null;
        }
    }

    public static async deleteGranters(id: number) {
        await DB.instance.delete(granters).where(eq(granters.id, id));
    }
}
