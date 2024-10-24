import request from "supertest";
import createApp from "@/app";

const app = createApp("e2e-routes");

describe("Test multiple routes", () => {
    test("should send an empty response on GET /", async () => {
        const res = await request(app).get("/").expect("Content-Type", /json/).expect(200);

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

    test("should send an empty response GET /error", async () => {
        const res = await request(app)
            .get("/error")
            .set("Accept-Language", "en")
            .expect("Content-Type", /json/)
            .expect(400);

        expect(res.body).toStrictEqual({
            masterStatus: 400,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 400,
                    success: false,
                    error: "errors.template",
                    translatedError: "This is a template error message"
                }
            ]
        });
    });
});
