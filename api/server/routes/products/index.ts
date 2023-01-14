import e, { Router } from "express";
import { productRepository } from "../../../appDataSource";

export const productsRouter = Router();

productsRouter.get("/products", async (req, res) => {
  try {
    const productsOnDb = await productRepository.find({});
    res.send(productsOnDb);
  } catch (err) {
    console.log(err);
  }
});
