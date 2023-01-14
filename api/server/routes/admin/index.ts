import { Router } from "express";
import { productsAdminRouter } from "./products";

export const adminRouter = Router();

adminRouter.use("/products", productsAdminRouter);
