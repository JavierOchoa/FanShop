import { Router } from "express";
import passport from "passport";
import { productRepository, userRepository } from "../../../appDataSource";
import { User } from "../../../appDataSource/entity";

export const statsAdminRouter = Router();

statsAdminRouter.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const user = req.user as User;
  if (!user.roles.includes("admin")) {
    res.status(401).send({
      successful: false,
      message: "Unauthorized",
    });
    return;
  }
  try {
    const productsOnDb = await productRepository.find();
    const usersOnDb = await userRepository.find();

    const stats = {
      products: productsOnDb.length,
      totalUsers: usersOnDb.length,
      normalUsers: usersOnDb.filter((user) => !user.roles.includes("admin")).length,
      adminUsers: usersOnDb.filter((user) => user.roles.includes("admin")).length,
    };
    res.send(stats);
  } catch (err) {
    res.send({
      successful: false,
      message: (err as Error).message,
    });
    return;
  }
});
