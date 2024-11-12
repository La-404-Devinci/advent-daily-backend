import createApp from "@/app";
import globals from "@/env/env";
import { toDateString } from "@/utils/date";
import { get, post } from "../utils";

const app = createApp("e2e-daily");

const testGlobals = {
    clubId: 0
};

describe("Daily challenges", () => {
    test("should create a daily club and challenge", async () => {
        const resClub = await post(
            app,
            "/admin/clubs",
            {
                name: "daily club",
                avatarUrl: "https://placehold.co/400",
                description: "description",
                dailyDate: toDateString() // Today
            },
            {
                "X-ADMIN-KEY": globals.env.ADMIN_TOKEN
            }
        );

        testGlobals.clubId = resClub.body.response[0].data.id ?? "invalid";

        const res = await post(
            app,
            "/admin/challenges",
            {
                clubId: testGlobals.clubId,
                score: 100,
                name: "daily challenge"
            },
            {
                "X-ADMIN-KEY": globals.env.ADMIN_TOKEN
            }
        );

        expect(res.body).toStrictEqual({
            masterStatus: 201,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 201,
                    success: true,
                    data: {
                        id: expect.any(Number),
                        score: 100,
                        name: "daily challenge",
                        clubId: testGlobals.clubId
                    }
                }
            ]
        });
    });

    test("should get daily club", async () => {
        const res = await get(app, "/daily");

        expect(res.body).toStrictEqual({
            masterStatus: 200,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 200,
                    success: true,
                    data: expect.arrayContaining([
                        {
                            avatarUrl: "https://placehold.co/400",
                            name: "daily club",
                            description: "description",
                            location: null
                        }
                    ])
                }
            ]
        });
    });

    test("should get daily challenges", async () => {
        const res = await get(app, "/daily/challenges");

        expect(res.body).toStrictEqual({
            masterStatus: 200,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 200,
                    success: true,
                    data: expect.arrayContaining([
                        {
                            clubId: testGlobals.clubId,
                            id: expect.any(Number),
                            name: "daily challenge",
                            score: 100
                        }
                    ])
                }
            ]
        });
    });
});
