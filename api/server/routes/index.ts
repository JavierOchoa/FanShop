import { Router } from "express";
import { seedRouter } from "./seed";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { authRouter } from "./auth";
import { productRouter } from "./products";
import { orderRouter } from "./order";

export const routes = Router();

routes.use("/auth", authRouter);
routes.use("/seed", seedRouter);
routes.use("/admin", adminRouter);
routes.use("/user", userRouter);
routes.use("/products", productRouter);
routes.use("/order", orderRouter);

export const routeResponse = (successful: boolean, message: string, data?: any, token?: string) => {
  return {
    successful,
    message,
    ...(data && { data }),
    ...(token && { token }),
  };
};
