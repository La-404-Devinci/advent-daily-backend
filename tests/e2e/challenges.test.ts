import createApp from "@/app";
import globals from "@/env/env";
import { del, get, post, put } from "../utils";

const app = createApp("e2e-challenges");

const testGlobals = {
    testId: 0,
    challengedId: 0
};

describe("Test challenges", () => {

  test("should get permission denied", async () => {
    const res = await get(app, "/admin/challenges", undefined, undefined, {
      "X-ADMIN-KEY": "definitely wrong"
    });

    expect(res.body).toStrictEqual({
        masterStatus: 401,
        sentAt: expect.any(Number),
        response: [
            {
                status: 401,
                success: false,
                error: "errors.auth.admin",
                translatedError: "Invalid X-ADMIN-KEY header"
            }
        ]
    });
  });

  test("should create a challenge", async () => {
    const res = await post(app, "/admin/challenges", {
      clubId: 1,
      score: 100,
      name: "test challenge"
    }, {
        "X-ADMIN-KEY": globals.env.ADMIN_TOKEN
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
            score: 100,
            name: "test challenge",
            clubId: 1,
          }
        }
      ]
    });

    testGlobals.challengedId = res.body.response[0].data.id ?? "invalid";
    
  });
  
  
  test("should edit a challenge", async () => {
    const res = await put(app, "/admin/challenges/:id", 
      { id: testGlobals.challengedId },
      {
      name: "edited challenge"
    }, {
      "X-ADMIN-KEY": globals.env.ADMIN_TOKEN
    });
    
    expect(res.body).toStrictEqual({
      masterStatus: 200,
      sentAt: expect.any(Number),
      response: [
        {
          status: 200,
          success: true,
          data: {
            id: testGlobals.challengedId,
            score: 100,
            name: "edited challenge",
            clubId: 1,
          }
        }
      ]
    });
  });

  test("should get all challenges", async () => {
    const res = await get(app, "/admin/challenges", undefined, undefined, {
        "X-ADMIN-KEY": globals.env.ADMIN_TOKEN
    });

    expect(res.body).toStrictEqual({
      masterStatus: 200,
      sentAt: expect.any(Number),
      response: [
        {
          status: 200,
          success: true,
          data: expect.arrayContaining([
            {
              id: expect.any(Number),
              score: 100,
              name: "edited challenge",
              clubId: 1,
            }
          ])
        }
      ]
    });    
  });

  test("should delete a challenge", async () => {
    const res = await del(app, "/admin/challenges/:id", 
    { id: testGlobals.challengedId },
    { "X-ADMIN-KEY": globals.env.ADMIN_TOKEN}
    );

    expect(res.body).toStrictEqual({
      masterStatus: 204,
      sentAt: expect.any(Number),
      response: [
        {
          status: 204,
          success: true,
        }
      ]
    });
  });

});
