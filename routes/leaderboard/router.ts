import { Router } from "express";
import Route_Leaderboard_Read from "./read";
import Route_Leaderboard_Etag from "./etag";

const leaderboardRouter = Router();

leaderboardRouter.get("/", Route_Leaderboard_Read);
leaderboardRouter.get("/etag", Route_Leaderboard_Etag);

export default leaderboardRouter;
