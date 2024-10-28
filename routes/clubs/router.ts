import { Router } from "express";
import Route_Clubs_List from "./list";
import Route_Clubs_Get from "./get";

const clubsRouter = Router();

clubsRouter.get("/", Route_Clubs_List);
clubsRouter.get("/:id", Route_Clubs_Get);

export default clubsRouter;
