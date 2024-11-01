import middlewareAdmin from "@/middlewares/auth/admin";
import { Router } from "express";
import adminChallengesRouter from "./challenges/router";
import adminClubsRouter from "./clubs/router";

const adminRouter = Router();

adminRouter.use(middlewareAdmin);

adminRouter.use("/clubs", adminClubsRouter);
adminRouter.use("/challenges", adminChallengesRouter);

export default adminRouter;
