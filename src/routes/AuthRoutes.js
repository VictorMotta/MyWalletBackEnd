import { Router } from "express";
import { signUp, signIn } from "../controller/AuthControllers.js";

const AuthRouter = Router();

AuthRouter.post("/sign-up", signUp);

AuthRouter.post("/sign-in", signIn);

export default AuthRouter;
