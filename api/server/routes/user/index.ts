import { Router } from "express";
import { userInfoRouter } from "./userInfo";

export const userRouter = Router();

userRouter.use("/", userInfoRouter);
