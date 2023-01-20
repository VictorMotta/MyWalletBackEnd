import { Router } from "express";
import { getRegisters, sendRegisters } from "../controller/RegistersControllers.js";

const registerRouter = Router();

registerRouter.post("/registers", sendRegisters);

registerRouter.get("/registers", getRegisters);

export default registerRouter;
