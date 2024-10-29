import { Router } from "express";
import clubsRouter from "./clubs/router";
import adminRouter from "./admin/router";
import Route_Index_Read from "./index";
import Route_Daily_Read from "./daily";
import authRouter from "./auth/router";

const router = Router();

router.get("/", Route_Index_Read);
router.get("/daily", Route_Daily_Read);

router.use("/clubs", clubsRouter);
router.use("/auth", authRouter);
router.use("/admin", adminRouter);

export default router;
