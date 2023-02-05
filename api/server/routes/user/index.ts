import { Router } from "express";
import { accountRouter } from "./account";
import { userInfoRouter } from "./userInfo";

export const userRouter = Router();

userRouter.use("/", userInfoRouter);
userRouter.use("/account", accountRouter);
