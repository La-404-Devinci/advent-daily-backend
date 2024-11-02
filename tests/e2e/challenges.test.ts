import createApp from "@/app";
import globals from "@/env/env";
import { toDateString } from "@/utils/date";
import { del, get, post, put } from "../utils";

const app = createApp("e2e-challenges");

const testGlobals = {
  clubId: 0,
  challengedId: 0,
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

  test("should create a club and challenge", async () => {

    const resClub = await post(
      app,
      "/admin/clubs",
      {
          name: "challenge club test",
          avatarUrl: "https://placehold.co/400",
          description: "description",
          dailyDate: toDateString(new Date("2024-11-01"))
      },
      {
          "X-ADMIN-KEY": globals.env.ADMIN_TOKEN
      }
    );

    testGlobals.clubId = resClub.body.response[0].data.id ?? "invalid";
    
    const res = await post(app, "/admin/challenges", {
      clubId: testGlobals.clubId,
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
            clubId: testGlobals.clubId,
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
            clubId: testGlobals.clubId,
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
              clubId: testGlobals.clubId,
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
