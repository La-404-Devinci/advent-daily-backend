import middlewareAdmin from "@/middlewares/auth/admin";
import { Router } from "express";

import adminChallengesRouter from "./challenges/router";
import adminClubsRouter from "./clubs/router";
import adminGrantersRouter from "./granters/router";
import adminUsersRouter from "./users/router";
import Route_Admin_Notification from "./notification";
import adminDumpRouter from "./dump/router";

const adminRouter = Router();

adminRouter.use(middlewareAdmin);

adminRouter.use("/clubs", adminClubsRouter);
adminRouter.use("/challenges", adminChallengesRouter);
adminRouter.use("/granters", adminGrantersRouter);
adminRouter.use("/users", adminUsersRouter);
adminRouter.use("/dump", adminDumpRouter);

adminRouter.post("/notification", Route_Admin_Notification);

export default adminRouter;
