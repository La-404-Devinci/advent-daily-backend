import { Router } from "express";
import Route_Users_Create from "./create";
import Route_Users_Get from "./get";
import Route_Users_Update from "./update";

const usersRouter = Router();

usersRouter.get("/:id", Route_Users_Get);
usersRouter.put("/:id", Route_Users_Update);
usersRouter.post("/", Route_Users_Create);

export default usersRouter;
