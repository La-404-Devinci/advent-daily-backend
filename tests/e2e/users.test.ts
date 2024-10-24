import request from "supertest";
import createApp from "@/app";

const app = createApp("e2e-users");

describe("Test users", () => {
    test("should create a user", async () => {
        const res = await request(app)
            .post("/users")
            .send({ firstName: "John" })
            .set("Accept-Language", "en")
            .expect("Content-Type", /json/)
            .expect(200);

        expect(res.body).toStrictEqual({
            masterStatus: 200,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 200,
                    success: true,
                    data: {
                        id: expect.any(Number),
                        firstName: "John"
                    }
                }
            ]
        });
    });

    test("should send created users", async () => {
        const res = await request(app).get("/users").expect("Content-Type", /json/).expect(200);

        expect(res.body).toStrictEqual({
            masterStatus: 200,
            sentAt: expect.any(Number),
            response: expect.arrayContaining([
                {
                    status: 200,
                    success: true,
                    data: [
                        {
                            id: expect.any(Number),
                            firstName: "John"
                        }
                    ]
                }
            ])
        });
    });
});
