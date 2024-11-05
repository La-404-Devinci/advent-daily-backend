import { Router } from "express";
import Route_AdminGranters_List from "./list";
import Route_AdminGranters_Create from "./create";
import Route_AdminGranters_Delete from "./delete";

const adminGrantersRouter = Router();

adminGrantersRouter.get("/", Route_AdminGranters_List);
adminGrantersRouter.post("/", Route_AdminGranters_Create);
adminGrantersRouter.delete("/:id", Route_AdminGranters_Delete);

export default adminGrantersRouter;
