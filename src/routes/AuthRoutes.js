import { Router } from "express";
import { signUp, signIn, logoutUser } from "../controller/AuthControllers.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { loginSchema, registerUserSchema } from "../schemas/AuthSchemas.js";
import { authValidation } from "../middlewares/AuthMiddleware.js";

const AuthRouter = Router();

AuthRouter.post("/sign-up", validateSchema(registerUserSchema), signUp);

AuthRouter.post("/sign-in", validateSchema(loginSchema), signIn);

AuthRouter.delete("/logout", authValidation, logoutUser);

export default AuthRouter;
