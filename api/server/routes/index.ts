import { Router } from "express";
import { productsRouter } from "./products";
import { seedRouter } from "./seed";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";

export const routes = Router();

routes.use("/auth", authRouter);
routes.use("/seed", seedRouter);
routes.use("/admin", adminRouter);
routes.use("/user", userRouter);
