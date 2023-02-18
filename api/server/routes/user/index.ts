import { Router } from "express";
import { accountRouter } from "./account";
import { userInfoRouter } from "./userInfo";
import { purchasesRouter } from "./purchases";

export const userRouter = Router();

userRouter.use("/", userInfoRouter);
userRouter.use("/account", accountRouter);
userRouter.use("/purchases", purchasesRouter);
