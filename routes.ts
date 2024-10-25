import { Router } from "express";
import Route_Index from "./routes/index";

const router = Router();

router.get("/", Route_Index);

export default router;
