import middlewareUser from "@/middlewares/auth/user";
import { Router } from "express";
import Route_LeaderboardAssociations_List from "./associations";
import Route_Leaderboard_Get from "./get";
import Route_Leaderboard_List from "./list";

const leaderboardRouter = Router();

leaderboardRouter.get('/', Route_Leaderboard_List);
leaderboardRouter.get('/associations', Route_LeaderboardAssociations_List);
leaderboardRouter.get('/me', middlewareUser, Route_Leaderboard_Get);

export default leaderboardRouter;