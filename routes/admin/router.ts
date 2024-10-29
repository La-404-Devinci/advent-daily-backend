import { Router } from "express";
import adminClubsRouter from "./clubs/router";
import middlewareAdmin from "@/middlewares/auth/admin";

const adminRouter = Router();

adminRouter.use(middlewareAdmin);

adminRouter.use("/clubs", adminClubsRouter);

export default adminRouter;
