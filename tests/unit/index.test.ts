import request from "supertest";
import createApp from "@/app";

const app = createApp("unit-index");

describe("GET /", () => {
    it("should send an empty response", async () => {
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
});
