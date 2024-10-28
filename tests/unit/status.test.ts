import request from "supertest";
import createApp from "@/app";

const app = createApp("unit-status");

describe("Test status page", () => {
    test("should send a 200", async () => {
        const res = await request(app).get("/").set("Accept-Language", "en").expect("Content-Type", /json/).expect(200);

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
});
