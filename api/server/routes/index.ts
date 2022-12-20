import { Router } from "express";
import { productsRouter } from "./products";
import { seedRouter } from "./seed";
import { authRouter } from "./user";
import { adminRouter } from "./admin";

export const routes = Router();

routes.use("/auth", authRouter);
routes.use("/seed", seedRouter);
routes.use("/admin", adminRouter);
