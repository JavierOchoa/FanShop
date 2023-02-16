import { Router } from "express";
import { internalOrderRouter } from "./internalOrder";
import { paypalRouter } from "./paypalRouter";

export const orderRouter = Router();

orderRouter.use("/", internalOrderRouter);
orderRouter.use("/paypal", paypalRouter);
