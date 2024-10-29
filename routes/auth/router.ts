import { Router } from "express";

const authRouter = Router();

authRouter.post("/send-mail");
authRouter.post("/login");
authRouter.get("/me");
authRouter.get("/me/qr");

export default authRouter;
