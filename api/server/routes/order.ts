import { Router } from "express";
import passport from "passport";
import { routeResponse } from ".";
import { orderRepository } from "../../appDataSource";
import { Order, User } from "../../appDataSource/entity";

export const orderRouter = Router();

orderRouter.get("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const user = req.user as User;

  try {
    const newOrder = new Order();
    newOrder.user = user;
    await orderRepository.save(newOrder);
    res.send(routeResponse(true, "Order created", newOrder.id));
  } catch (err) {
    res.send(routeResponse(false, (err as Error).message));
  }
});
