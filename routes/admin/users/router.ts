import { Router } from "express";
import Route_AdminUsers_List from "./list";
import Route_AdminUsers_Update from "./update";
import Route_AdminUsers_Delete from "./delete";

const adminUsersRouter = Router();

adminUsersRouter.get("/", Route_AdminUsers_List);
adminUsersRouter.put("/:id", Route_AdminUsers_Update);
adminUsersRouter.delete("/:id", Route_AdminUsers_Delete);

export default adminUsersRouter;
