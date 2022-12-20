import { Router } from "express";
import { productRepository } from "../../../appDataSource";

export const productsAdminRouter = Router();

productsAdminRouter.get("/", async (req, res) => {
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
