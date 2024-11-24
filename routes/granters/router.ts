import { Router } from "express";
import Route_Granters_Login from "./login";
import Route_Granters_Grant from "./grant";
import Route_Granters_Me from "./me";
import Route_Granters_Ungrant from "./ungrant";

const grantersRouter = Router();

grantersRouter.get("/me", Route_Granters_Me);
grantersRouter.post("/login", Route_Granters_Login);
grantersRouter.post("/grant", Route_Granters_Grant);
grantersRouter.post("/ungrant", Route_Granters_Ungrant);

export default grantersRouter;
