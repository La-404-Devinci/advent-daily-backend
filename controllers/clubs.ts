import DB from "@/database/config";
import { clubs } from "@/database/schema/clubs";
import Logger from "@/log/logger";
import { eq } from "drizzle-orm";

export default abstract class ClubController {
    public static async getAllClubs() {
        const allClubs = await DB.instance
            .select({
                id: clubs.id,
                avatarUrl: clubs.avatarUrl,
                name: clubs.name,
                location: clubs.location
            })
            .from(clubs)
            .orderBy(clubs.name);

        return allClubs;
    }

    public static async getAllClubsWithDetails() {
        const allClubs = await DB.instance
            .select({
                id: clubs.id,
                avatarUrl: clubs.avatarUrl,
                name: clubs.name,
                description: clubs.description,
                dailyDate: clubs.dailyDate,
                location: clubs.location
            })
            .from(clubs)
            .orderBy(clubs.name);

        return allClubs;
    }

    public static async getClub(id: number) {
        const club = await DB.instance
            .select({
                id: clubs.id,
                avatarUrl: clubs.avatarUrl,
                name: clubs.name,
                location: clubs.location
            })
            .from(clubs)
            .where(eq(clubs.id, id))
            .limit(1);

        return club.length ? club[0] : null;
    }

    public static async getClubWithDetails(id: number) {
        const club = await DB.instance
            .select({
                id: clubs.id,
                avatarUrl: clubs.avatarUrl,
                name: clubs.name,
                description: clubs.description,
                dailyDate: clubs.dailyDate,
                location: clubs.location
            })
            .from(clubs)
            .where(eq(clubs.id, id))
            .limit(1);

        return club.length ? club[0] : null;
    }

    public static async getDailyClubs() {
        const club = await DB.instance
            .select({
                avatarUrl: clubs.avatarUrl,
                name: clubs.name,
                description: clubs.description,
                location: clubs.location
            })
            .from(clubs)
            .where(eq(clubs.dailyDate, new Date()));

        return club;
    }

    public static async createClub(
        name: string,
        avatarUrl: string,
        description?: string,
        dailyDate?: Date,
        location?: string
    ) {
        try {
            const club = await DB.instance
                .insert(clubs)
                .values({
                    name: name,
                    avatarUrl: avatarUrl,
                    description: description,
                    dailyDate: dailyDate,
                    location: location
                })
                .returning();

            return club[0];
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    public static async updateClub(
        id: number,
        name: string,
        avatarUrl: string,
        description?: string,
        dailyDate?: Date,
        location?: string
    ) {
        try {
            const club = await DB.instance
                .update(clubs)
                .set({
                    name: name,
                    avatarUrl: avatarUrl,
                    description: description,
                    dailyDate: dailyDate,
                    location: location
                })
                .where(eq(clubs.id, id))
                .returning();

            return club[0];
        } catch (error) {
            Logger.error(error);
            return null;
        }
    }

    public static async deleteClub(id: number) {
        await DB.instance.delete(clubs).where(eq(clubs.id, id));
    }

    public static async deleteAllClubs() {
        await DB.instance.delete(clubs);
    }
}
