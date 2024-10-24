import { Router } from "express";
import Route_GetUsers from "./getUsers";
import Route_PostUsers from "./postUsers";

const usersRouter = Router();

usersRouter.get("/", Route_GetUsers);
usersRouter.post("/", Route_PostUsers);

export default usersRouter;
