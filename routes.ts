import { Router } from "express";
import clubsRouter from "./routes/clubs/router";
import adminRouter from "./routes/admin/router";
import Route_Index_Read from "./routes/index";
import Route_Daily_Read from "./routes/daily";

const router = Router();

router.get("/", Route_Index_Read);
router.get("/daily", Route_Daily_Read);

router.use("/clubs", clubsRouter);
router.use("/admin", adminRouter);

export default router;
