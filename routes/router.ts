import { Router } from "express";
import adminRouter from "./admin/router";
import authRouter from "./auth/router";
import clubsRouter from "./clubs/router";
import dailyRouter from "./daily/router";
import Route_Index_Read from "./index";
import usersRouter from "./users/router";

const router = Router();

router.get("/", Route_Index_Read);
router.get("/daily", dailyRouter);

router.use("/clubs", clubsRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);

router.use("/admin", adminRouter);

export default router;
