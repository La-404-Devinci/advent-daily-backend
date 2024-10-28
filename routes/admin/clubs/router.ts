import { Router } from "express";
import Route_AdminClubs_List from "./list";
import Route_AdminClubs_Create from "./create";
import Route_AdminClubs_Update from "./update";
import Route_AdminClubs_Delete from "./delete";

const adminClubsRouter = Router();

adminClubsRouter.get("/", Route_AdminClubs_List);
adminClubsRouter.post("/", Route_AdminClubs_Create);
adminClubsRouter.put("/:id", Route_AdminClubs_Update);
adminClubsRouter.delete("/:id", Route_AdminClubs_Delete);

export default adminClubsRouter;
