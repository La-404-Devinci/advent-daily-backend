import { Router } from "express";
import Route_Error from "./routes/error";
import Route_Index from "./routes/index";
import Route_UnhandledError from "./routes/unhandled";
import usersRouter from "./routes/users/routes";

const router = Router();

router.get("/", Route_Index);
router.get("/error", Route_Error);
router.get("/unhandled", Route_UnhandledError);

router.use("/users", usersRouter);

export default router;
