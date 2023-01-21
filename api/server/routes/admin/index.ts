import { Router } from "express";
import { productsAdminRouter } from "./products";
import { statsAdminRouter } from "./stats";
import { usersAdminRouter } from "./users";

export const adminRouter = Router();

adminRouter.use("/products", productsAdminRouter);
adminRouter.use("/users", usersAdminRouter);
adminRouter.use("/stats", statsAdminRouter);
