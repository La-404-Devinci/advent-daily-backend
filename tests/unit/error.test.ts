import request from "supertest";
import createApp from "@/app";

const app = createApp("unit-error");

describe("GET /error", () => {
    it("should send an empty response", async () => {
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
