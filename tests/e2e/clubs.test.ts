import createApp from "@/app";
import { del, get, post, put } from "../utils";
import globals from "@/env/env";
import { toDateISOString, toDateString } from "@/utils/date";

const app = createApp("e2e-users");

const testGlobals = {
    testId: 0,
    challengedId: 0
};

describe("Test users", () => {
    test("should create a non-challenger club", async () => {
        const res = await post(
            app,
            "/admin/clubs",
            {
                name: "test",
                avatarUrl: "https://placehold.co/200"
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
                        avatarUrl: "https://placehold.co/200",
                        name: "test",
                        description: null,
                        dailyDate: null,
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    }
                }
            ]
        });

        testGlobals.testId = res.body.response[0].data.id;
    });

    test("should create a challenger club", async () => {
        const res = await post(
            app,
            "/admin/clubs",
            {
                name: "daily test",
                avatarUrl: "https://placehold.co/400",
                description: "description",
                dailyDate: toDateString() // Today
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
                        avatarUrl: "https://placehold.co/400",
                        name: "daily test",
                        description: "description",
                        dailyDate: toDateISOString(),
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    }
                }
            ]
        });

        testGlobals.challengedId = res.body.response[0].data.id;
    });

    test("should get created clubs", async () => {
        const res = await get(app, "/admin/clubs", undefined, undefined, {
            "X-ADMIN-KEY": globals.env.ADMIN_TOKEN
        });

        expect(res.body).toStrictEqual({
            masterStatus: 200,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 200,
                    success: true,
                    data: expect.arrayContaining([
                        {
                            id: testGlobals.testId,
                            avatarUrl: "https://placehold.co/200",
                            name: "test",
                            description: null,
                            dailyDate: null
                        },
                        {
                            id: testGlobals.challengedId,
                            avatarUrl: "https://placehold.co/400",
                            name: "daily test",
                            description: "description",
                            dailyDate: toDateISOString()
                        }
                    ])
                }
            ]
        });
    });

    test("should edit a club", async () => {
        const res = await put(
            app,
            "/admin/clubs/:id",
            {
                id: testGlobals.challengedId
            },
            {
                name: "challenged",
                avatarUrl: "https://placehold.co/400",
                description: "description",
                dailyDate: toDateString()
            },
            {
                "X-ADMIN-KEY": globals.env.ADMIN_TOKEN
            }
        );

        expect(res.body).toStrictEqual({
            masterStatus: 200,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 200,
                    success: true,
                    data: {
                        from: expect.anything(),
                        to: {
                            id: testGlobals.challengedId,
                            avatarUrl: "https://placehold.co/400",
                            name: "challenged",
                            description: "description",
                            dailyDate: toDateISOString(),
                            createdAt: expect.any(String),
                            updatedAt: expect.any(String)
                        }
                    }
                }
            ]
        });
    });

    test("should delete a club", async () => {
        const res = await del(
            app,
            "/admin/clubs/:id",
            {
                id: testGlobals.testId
            },
            {
                "X-ADMIN-KEY": globals.env.ADMIN_TOKEN
            }
        );

        expect(res.body).toStrictEqual({
            masterStatus: 204,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 204,
                    success: true
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
                    data: {
                        avatarUrl: "https://placehold.co/400",
                        name: "challenged",
                        description: "description"
                    }
                }
            ]
        });
    });
});
