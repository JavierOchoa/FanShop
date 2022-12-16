import { Router } from "express";
import { seedRouter } from "./seed";
import { authRouter } from "./user";

export const routes = Router();

routes.use("/auth", authRouter);
routes.use("/seed", seedRouter);
