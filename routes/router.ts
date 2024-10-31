import { Router } from "express";
import adminRouter from "./admin/router";
import authRouter from "./auth/router";
import clubsRouter from "./clubs/router";
import Route_Daily_Read from "./daily";
import Route_Index_Read from "./index";
import usersRouter from "./users/router";

const router = Router();

router.get("/", Route_Index_Read);
router.get("/daily", Route_Daily_Read);

router.use("/clubs", clubsRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);

router.use("/admin", adminRouter);

export default router;
