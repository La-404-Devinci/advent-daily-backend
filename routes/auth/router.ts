import { Router } from "express";
import Route_Auth_Sendmail from "./send-mail";
import Route_Auth_Login from "./login";
import Route_Auth_Me from "./me";
import Route_Auth_MeQr from "./me-qr";

const authRouter = Router();

authRouter.post("/send-mail", Route_Auth_Sendmail);
authRouter.post("/login", Route_Auth_Login);
authRouter.get("/me", Route_Auth_Me);
authRouter.get("/me/qr", Route_Auth_MeQr);

export default authRouter;
