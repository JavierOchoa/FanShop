import { Router } from "express";
import passport from "passport";
import { productRepository } from "../../../appDataSource";

export const productsAdminRouter = Router();

productsAdminRouter.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const productsOnDb = await productRepository.find({
      select: {
        id: true,
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

productsAdminRouter.get(
  "/:productId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
      return res.send({
        message: "No product id",
      });
    }
    try {
      const productInformation = await productRepository.findOne({
        where: {
          id: productId,
        },
        relations: {
          images: true,
          user: true,
        },
      });
      res.send(productInformation);
    } catch (err) {
      console.log(err);
    }
  }
);
