import { Router } from "express";
import adminRouter from "./routes/admin/router";
import clubsRouter from "./routes/clubs/router";
import Route_Daily_Read from "./routes/daily";
import Route_Index_Read from "./routes/index";
import usersRouter from "./routes/users/router";

const router = Router();

router.get("/", Route_Index_Read);
router.get("/daily", Route_Daily_Read);

router.use("/clubs", clubsRouter);
router.use("/users", usersRouter);

router.use("/admin", adminRouter);

export default router;
