import { Router } from "express";
import { deleteRegister, getRegisters, sendRegisters } from "../controller/RegistersControllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { sendRegistersSchema } from "../schemas/RegistersSchemas.js";
import { authValidation } from "../middlewares/AuthMiddleware.js";

const registerRouter = Router();
registerRouter.use(authValidation);
registerRouter.post("/registers", validateSchema(sendRegistersSchema), sendRegisters);
registerRouter.get("/registers", getRegisters);
registerRouter.delete("/registers/:idRegister", deleteRegister);

export default registerRouter;
