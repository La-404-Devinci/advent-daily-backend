import createApp from "@/app";
import AuthController from "@/controllers/auth";
import { get, post, put } from "../utils";

const app = createApp("e2e-users");

describe("Test users", () => {
    const email = "test-users@no-reply.local";
    const token = AuthController.generateCreationToken(email);

    test("should get 'invalid token' error", async () => {
        const res = await post(app, "/users", {
            email: "test-users-invalid-token@no-reply.local",
            token: "definitely not a valid token",
            password: "password",
            username: "test-users-invalid-token"
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

    let userUuid: string;

    test("should create a user", async () => {
        const res = await post(app, "/users", {
            email: email,
            token: token,
            password: "password",
            username: "test-users"
        });

        expect(res.body).toStrictEqual({
            masterStatus: 201,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 201,
                    success: true,
                    data: {
                        uuid: expect.any(String),
                        email: email,
                        clubId: null,
                        avatarUrl: null,
                        quote: null,
                        username: "test-users",
                    }
                }
            ]
        });

        userUuid = res.body.response[0].data.uuid ?? "invalid";
    });

    test("should get 'email already exists' error", async () => {
        const res = await post(app, "/users", {
            email: email,
            token: token,
            password: "password",
            username: "another-test-users"
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
            username: "test-users"
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

    test("should edit the user", async () => {
        const res = await put(
            app,
            "/users/:uuid",
            { uuid: userUuid },
            { quote: "test" },
            { Authorization: `Bearer ${authToken}` }
        );

        expect(res.body).toStrictEqual({
            masterStatus: 200,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 200,
                    success: true,
                    data: {
                        uuid: userUuid,
                        email: email,
                        username: "test-users",
                        avatarUrl: null,
                        clubId: null,
                        quote: "test"
                    }
                }
            ]
        });
    });

    test("should get 'invalid token' error", async () => {
        const res = await put(
            app,
            "/users/:uuid",
            { uuid: userUuid },
            { quote: "another-test" },
            { Authorization: `Bearer definitely not a valid token` }
        );

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

    test("should get the user", async () => {
        const res = await get(app, "/users/:uuid", { uuid: userUuid }, undefined, {
            Authorization: `Bearer ${authToken}`
        });

        expect(res.body).toStrictEqual({
            masterStatus: 200,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 200,
                    success: true,
                    data: {
                        uuid: userUuid,
                        email: email,
                        username: "test-users",
                        avatarUrl: null,
                        clubId: null,
                        quote: "test"
                    }
                }
            ]
        });
    });
});
