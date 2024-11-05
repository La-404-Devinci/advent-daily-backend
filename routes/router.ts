import { Router } from "express";

import Route_Index_Read from "./index";
import Route_Blob_Read from "./blob";

import dailyRouter from "./daily/router";

import clubsRouter from "./clubs/router";
import authRouter from "./auth/router";
import usersRouter from "./users/router";
import leaderboardRouter from "./leaderboard/router";

import grantersRouter from "./granters/router";

import adminRouter from "./admin/router";

const router = Router();

router.get("/", Route_Index_Read);
router.get("/blob/:hash", Route_Blob_Read);

router.use("/daily", dailyRouter);

router.use("/clubs", clubsRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/leaderboard", leaderboardRouter);

router.use("/granters", grantersRouter);

router.use("/admin", adminRouter);

export default router;
