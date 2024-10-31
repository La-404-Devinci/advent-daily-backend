import createApp from "@/app";
import AuthController from "@/controllers/auth";
import globals from "@/env/env";
import { get, post } from "../utils";

const app = createApp("e2e-auth");

describe("Test authentication", () => {
    const email = "test-auth@no-reply.local";
    const token = AuthController.generateCreationToken(email, false);
    const redirectUrl = globals.env.MAIL_REDIRECT_URL.replace("{token}", token);

    test("should send an email", async () => {
        // We use X-ADMIN-KEY to fetch back the redirect URL without expiration
        const res = await post(app, "/auth/send-mail", { email: email }, { "X-ADMIN-KEY": globals.env.ADMIN_TOKEN });

        expect(res.body).toStrictEqual({
            masterStatus: 201,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 201,
                    success: true,
                    data: redirectUrl
                }
            ]
        });
    });

    test("should get 'too many requests' error", async () => {
        const res = await post(app, "/auth/send-mail", { email: email });

        expect(res.body).toStrictEqual({
            masterStatus: 429,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 429,
                    success: false,
                    error: "errors.auth.toomany",
                    translatedError: "Too many requests"
                }
            ]
        });
    });

    let userUuid: string;

    test("should create a user", async () => {
        const res = await post(app, "/users", {
            email: email,
            token: token,
            password: "password",
            username: "test"
        });

        expect(res.body).toStrictEqual({
            masterStatus: 201,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 201,
                    success: true,
                    data: {
                        avatarUrl: null,
                        clubId: null,
                        uuid: expect.any(String),
                        email: email,
                        quote: null,
                        username: "test"
                    }
                }
            ]
        });

        userUuid = res.body.response[0].data.uuid ?? "invalid";
    });

    const authToken = AuthController.generateAuthToken(email);

    test("should login a user", async () => {
        const res = await post(app, "/auth/login", {
            email: email,
            password: "password"
        });

        expect(res.body).toStrictEqual({
            masterStatus: 200,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 200,
                    success: true,
                    data: authToken
                }
            ]
        });
    });

    test("should get 'invalid credentials' error", async () => {
        const res = await post(app, "/auth/login", {
            email: email,
            password: "wrong-password"
        });

        expect(res.body).toStrictEqual({
            masterStatus: 401,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 401,
                    success: false,
                    error: "errors.auth.invalid.credentials",
                    translatedError: "Invalid credentials"
                }
            ]
        });
    });

    test("should get the authenticated user", async () => {
        const meRes = await get(app, "/auth/me", undefined, undefined, {
            Authorization: `Bearer ${authToken}`
        });

        expect(meRes.body).toStrictEqual({
            masterStatus: 200,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 200,
                    success: true,
                    data: userUuid
                }
            ]
        });
    });

    test("should get 'unauthorized' error", async () => {
        const res = await get(app, "/auth/me", undefined, undefined, {
            Authorization: `Bearer invalid-token`
        });

        expect(res.body).toStrictEqual({
            masterStatus: 401,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 401,
                    success: false,
                    error: "errors.auth.unauthorized",
                    translatedError: "You must be logged in"
                }
            ]
        });
    });
});
