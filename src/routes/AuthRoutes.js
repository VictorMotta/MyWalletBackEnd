import { Router } from "express";
import { signUp, signIn, logoutUser } from "../controller/AuthControllers.js";

const AuthRouter = Router();

AuthRouter.post("/sign-up", signUp);

AuthRouter.post("/sign-in", signIn);

AuthRouter.delete("/logout", logoutUser);

export default AuthRouter;
