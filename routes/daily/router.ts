import { Router } from "express";
import Route_DailyChallenges_Get from "./challenges";
import Route_Daily_Read from "./read";

const dailyRouter = Router();

dailyRouter.get("/", Route_Daily_Read);
dailyRouter.get("/challenges", Route_DailyChallenges_Get);

export default dailyRouter;
