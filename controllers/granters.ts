import DB from "@/database/config";
import { granters } from "@/database/schema/granters";
import { eq } from "drizzle-orm";

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
                email: granters.email
            })
            .from(granters)
            .where(eq(granters.clubId, clubId));

        return allGranters;
    }
}
