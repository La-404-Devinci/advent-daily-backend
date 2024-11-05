import middlewareAdmin from "@/middlewares/auth/admin";
import { Router } from "express";

import adminChallengesRouter from "./challenges/router";
import adminClubsRouter from "./clubs/router";
import adminGrantersRouter from "./granters/router";

const adminRouter = Router();

adminRouter.use(middlewareAdmin);

adminRouter.use("/clubs", adminClubsRouter);
adminRouter.use("/challenges", adminChallengesRouter);
adminRouter.use("/granters", adminGrantersRouter);

export default adminRouter;
