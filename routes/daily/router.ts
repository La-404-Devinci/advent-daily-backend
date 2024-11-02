import { Router } from "express";
import Route_Daily_Read from "./read";

const dailyRouter = Router();

dailyRouter.get("/", Route_Daily_Read);
// dailyRouter.get("/challenges", Route_Daily_Challenges_Get);

export default dailyRouter;
