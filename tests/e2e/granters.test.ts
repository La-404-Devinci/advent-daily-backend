import createApp from "@/app";
import globals from "@/env/env";
import { toDateString } from "@/utils/date";
import { del, get, post } from "../utils";
import AuthController from "@/controllers/auth";

const app = createApp("e2e-challenges");

const testGlobals = {
    clubId: 0,
    granterId: 0,
    granterPassword: ""
};

describe("Test granters", () => {
    test("should get permission denied", async () => {
        const res = await get(app, "/admin/granters", undefined, undefined, {
            "X-ADMIN-KEY": "definitely wrong"
        });

        expect(res.body).toStrictEqual({
            masterStatus: 401,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 401,
                    success: false,
                    error: "errors.auth.admin",
                    translatedError: "Invalid X-ADMIN-KEY header"
                }
            ]
        });
    });

    test("should create a club and a granter", async () => {
        const resClub = await post(
            app,
            "/admin/clubs",
            {
                name: "club with granters",
                avatarUrl: "https://placehold.co/500",
                description: "this isn't a real description",
                dailyDate: toDateString(new Date("2022-10-01"))
            },
            {
                "X-ADMIN-KEY": globals.env.ADMIN_TOKEN
            }
        );

        testGlobals.clubId = resClub.body.response[0].data.id ?? "invalid";

        const res = await post(
            app,
            "/admin/granters",
            {
                clubId: testGlobals.clubId,
                email: "test-granters@no-reply.local"
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
                        clubId: testGlobals.clubId,
                        email: "test-granters@no-reply.local",
                        password: expect.stringMatching(
                            /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/
                        )
                    }
                }
            ]
        });

        testGlobals.granterId = res.body.response[0].data.id ?? "invalid";
        testGlobals.granterPassword = res.body.response[0].data.password ?? "invalid";
    });

    test("should get all granters", async () => {
        const res = await get(app, "/admin/granters", undefined, undefined, {
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
                            id: expect.any(Number),
                            clubId: testGlobals.clubId,
                            email: "test-granters@no-reply.local"
                        }
                    ])
                }
            ]
        });
    });

    test("should delete a granter", async () => {
        const res = await del(
            app,
            "/admin/granters/:id",
            { id: testGlobals.granterId },
            { "X-ADMIN-KEY": globals.env.ADMIN_TOKEN }
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

    test("should get permission denied", async () => {
        const res = await post(
            app,
            "/granters/grant",
            {
                userUuid: "none",
                challengeId: -1
            },
            {
                authorization: `Bearer definitely wrong`
            }
        );

        expect(res.body).toStrictEqual({
            masterStatus: 401,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 401,
                    success: false,
                    error: "errors.auth.granters",
                    translatedError: "Invalid granter auth"
                }
            ]
        });
    });

    test("should login as a granter", async () => {
        const res = await post(app, "/granters/login", {
            email: "test-granters@no-reply.local",
            password: testGlobals.granterPassword
        });

        expect(res.body).toStrictEqual({
            masterStatus: 200,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 200,
                    success: true,
                    data: {
                        token: AuthController.generateGranterAuthToken("test-granters@no-reply.local"),
                        clubId: testGlobals.clubId
                    }
                }
            ]
        });
    });
});
