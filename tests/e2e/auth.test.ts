import createApp from "@/app";
import { post } from "../utils";
import globals from "@/env/env";
import AuthController from "@/controllers/auth";

const app = createApp("e2e-auth");

describe("Test authentication", () => {
    test("should send an email", async () => {
        const email = "test@no-reply.local";

        const res = await post(app, "/send-mail", { email: email }, { "X-ADMIN-KEY": globals.env.ADMIN_TOKEN });

        const token = AuthController.generateCreationToken(email);
        const redirectUrl = globals.env.MAIL_REDIRECT_URL.replace("{token}", token);

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
});
