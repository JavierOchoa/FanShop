import { Router } from "express";
import passport from "passport";
import { routeResponse } from "..";
import { orderRepository, productRepository, userRepository } from "../../../appDataSource";
import { User } from "../../../appDataSource/entity";

export const statsAdminRouter = Router();

statsAdminRouter.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const user = req.user as User;
  if (!user.roles.includes("admin")) {
    res.status(401).send(routeResponse(false, "Unauthorized"));
    return;
  }
  try {
    const productsOnDb = await productRepository.find();
    const usersOnDb = await userRepository.find();
    const ordersOnDb = await orderRepository.find();

    const completedOrders = ordersOnDb.filter((order) => order.status === "completed");

    const stats = {
      products: productsOnDb.length,
      totalUsers: usersOnDb.length,
      normalUsers: usersOnDb.filter((user) => !user.roles.includes("admin")).length,
      adminUsers: usersOnDb.filter((user) => user.roles.includes("admin")).length,
      totalOrders: ordersOnDb.length,
      completedOrders: completedOrders.length,
      unfinishedOrders: ordersOnDb.filter(
        (order) => order.status === "incomplete" || order.status === "in-progress"
      ).length,
      totalRevenue: completedOrders.reduce((acc, currentValue) => acc + currentValue.total, 0),
    };
    res.send(routeResponse(true, "Stats fetched", stats));
  } catch (err) {
    res.send(routeResponse(false, (err as Error).message));
    return;
  }
});
