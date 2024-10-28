import { Router } from "express";
import clubsRouter from "./routes/clubs/router";
import adminRouter from "./routes/admin/router";
import Route_Index_Read from "./routes/index";

const router = Router();

router.get("/", Route_Index_Read);
router.use("/clubs", clubsRouter);
router.use("/admin", adminRouter);

export default router;
