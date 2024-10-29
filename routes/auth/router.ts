import { Router } from "express";
import Route_Auth_Sendmail from "./send-mail";
import Route_Auth_Login from "./login";

const authRouter = Router();

authRouter.post("/send-mail", Route_Auth_Sendmail);
authRouter.post("/login", Route_Auth_Login);
authRouter.get("/me");
authRouter.get("/me/qr");

export default authRouter;
