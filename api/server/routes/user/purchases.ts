import { Router } from "express";
import passport from "passport";
import { routeResponse } from "../index";
import { userRepository } from "../../../appDataSource";
import { User } from "../../../appDataSource/entity";

export const purchasesRouter = Router();

purchasesRouter.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { id } = req.user as User;

  try {
    const userOnDb = await userRepository.findOne({
      where: { id },
      relations: { orders: { address: true, products: { product: true } } },
    });
    if (!userOnDb) return res.send(routeResponse(false, "User not found"));
    const completedOrders = userOnDb.orders.filter((order) => order.status === "completed");
    return res.send(routeResponse(true, "Successfully retrieved orders", completedOrders));
  } catch (e) {
    return res.send(routeResponse(false, (e as Error).message));
  }
});
