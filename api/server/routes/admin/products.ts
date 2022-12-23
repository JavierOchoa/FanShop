import { Router } from "express";
import passport from "passport";
import { productRepository } from "../../../appDataSource";

export const productsAdminRouter = Router();

productsAdminRouter.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const productsOnDb = await productRepository.find({
      select: {
        title: true,
        price: true,
        stock: true,
      },
      relations: {
        user: true,
      },
    });
    res.send(productsOnDb);
  } catch (err) {
    console.log(err);
  }
});

// productsAdminRouter.get("/edit");
