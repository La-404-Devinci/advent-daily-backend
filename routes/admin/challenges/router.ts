import { Router } from "express";
import Route_AdminChallenges_Create from "./create";
import Route_AdminChallenges_Delete from "./delete";
import Route_AdminChallenges_List from "./list";
import Route_AdminChallenges_Update from "./update";

const adminChallengesRouter = Router();

adminChallengesRouter.get("/", Route_AdminChallenges_List);
adminChallengesRouter.post("/", Route_AdminChallenges_Create);
adminChallengesRouter.put("/:id", Route_AdminChallenges_Update);
adminChallengesRouter.delete("/:id", Route_AdminChallenges_Delete);

export default adminChallengesRouter;
