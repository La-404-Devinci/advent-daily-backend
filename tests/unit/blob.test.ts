import createApp from "@/app";
import { get } from "../utils";

const app = createApp("unit-blob");

describe("Test status page", () => {
    test("should get a 'image not found' error", async () => {
        const res = await get(app, "/blob/:uuid", { uuid: "definitely-not-a-valid-uuid" });

        expect(res.body).toStrictEqual({
            masterStatus: 404,
            sentAt: expect.any(Number),
            response: [
                {
                    status: 404,
                    success: false,
                    error: "errors.image.notFound",
                    translatedError: "Image not found"
                }
            ]
        });
    });
});
