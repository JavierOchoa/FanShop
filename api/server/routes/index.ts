import { Router } from "express";
import { authRouter } from "./user";

export const routes = Router();

routes.use("/auth", authRouter);
