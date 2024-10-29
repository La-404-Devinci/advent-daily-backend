import createApp from "@/app";
import { get, post, put } from "../utils";
import globals from "@/env/env";
import AuthController from "@/controllers/auth";

const app = createApp("e2e-auth");

describe("Test authentication", () => {
    const email = "test@no-reply.local";
    const token = AuthController.generateCreationToken(email);
    const redirectUrl = globals.env.MAIL_REDIRECT_URL.replace("{token}", token);

    test("should send an email", async () => {
        // We use X-ADMIN-KEY to fetch back the redirect URL
        const res = await post(app, "/send-mail", { email: email }, { "X-ADMIN-KEY": globals.env.ADMIN_TOKEN });

        expect(res.body).toStrictEqual({
            masterStatus: 201,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 201,
                    success: true,
                    data: {
                        link: redirectUrl
                    }
                }
            ]
        });
    });

    test("should get 'too many requests' error", async () => {
        const res = await post(app, "/send-mail", { email: email });

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

    test("should get 'invalid token' error", async () => {
        const res = await post(app, "/users", {
            email: email,
            token: "definitely not a valid token",
            password: "password",
            username: "test"
        });

        expect(res.body).toStrictEqual({
            masterStatus: 400,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 400,
                    success: false,
                    error: "errors.auth.invalid",
                    translatedError: "Invalid credentials"
                }
            ]
        });
    });

    let userId: string;

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
                        id: expect.any(Number),
                        email: email,
                        username: "test",
                        createdAt: expect.any(String),
                        updatedAt: expect.any(String)
                    }
                }
            ]
        });

        userId = res.body.response[0].data.id;
    });

    test("should get 'email already exists' error", async () => {
        const res = await post(app, "/users", {
            email: email,
            token: token,
            password: "password",
            username: "another-test"
        });

        expect(res.body).toStrictEqual({
            masterStatus: 409,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 409,
                    success: false,
                    error: "errors.auth.conflict.email",
                    translatedError: "Email already in use"
                }
            ]
        });
    });

    test("should get 'username already exists' error", async () => {
        const anotherEmail = "another-test@no-reply.local";
        const anotherToken = AuthController.generateCreationToken(anotherEmail);

        const res = await post(app, "/users", {
            email: anotherEmail,
            token: anotherToken,
            password: "password",
            username: "test"
        });

        expect(res.body).toStrictEqual({
            masterStatus: 409,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 409,
                    success: false,
                    error: "errors.auth.conflict.username",
                    translatedError: "Username already in use"
                }
            ]
        });
    });

    const authToken = AuthController.generateAuthToken(email);

    test("should login a user", async () => {
        const res = await post(app, "/login", {
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
                    data: {
                        token: authToken
                    }
                }
            ]
        });
    });

    test("should get 'invalid credentials' error", async () => {
        const res = await post(app, "/login", {
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
                    error: "errors.auth.invalid",
                    translatedError: "Invalid credentials"
                }
            ]
        });
    });

    test("should edit the user", async () => {
        const res = await put(
            app,
            "/users/:id",
            {
                id: userId
            },
            {
                quote: "test"
            },
            {
                Authorization: `Bearer ${authToken}`
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

    test("should get the authenticated user", async () => {
        const res = await get(app, "/me", undefined, undefined, {
            Authorization: `Bearer ${authToken}`
        });

        expect(res.body).toStrictEqual({});
    });

    test("should get 'unauthorized' error", async () => {
        const res = await get(app, "/me", undefined, undefined, {
            Authorization: `Bearer invalid-token`
        });

        expect(res.body).toStrictEqual({
            masterStatus: 401,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 401,
                    success: false,
                    error: "errors.auth.invalid",
                    translatedError: "Invalid credentials"
                }
            ]
        });
    });
});
