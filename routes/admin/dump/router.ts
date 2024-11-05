import { Router } from "express";
import Route_AdminDump_Read from "./read";
import Route_AdminDump_Write from "./write";

const adminDumpRouter = Router();

adminDumpRouter.get("/", Route_AdminDump_Read);
adminDumpRouter.post("/", Route_AdminDump_Write);

export default adminDumpRouter;
