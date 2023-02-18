import { Router } from "express";
import { routeResponse } from ".";
import { productRepository } from "../../appDataSource";
import { Product } from "../../appDataSource/entity";

export const productRouter = Router();

productRouter.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  let productsResponse: Product[] = [];
  try {
    if (category === "all") {
      const productsOnDb = await productRepository.find({
        select: {
          id: true,
          title: true,
          price: true,
        },
        relations: {
          images: true,
        },
      });
      productsResponse = productsOnDb;
    } else {
      const productsOnDb = await productRepository.find({
        where: [{ gender: category }, { gender: "unisex" }],
        select: {
          id: true,
          title: true,
          price: true,
        },
        relations: {
          images: true,
        },
      });
      productsResponse = productsOnDb;
    }
    res.send(routeResponse(true, "Product List", productsResponse));
  } catch (err) {
    res.send(routeResponse(false, (err as Error).message));
  }
});

productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const productOnDb = await productRepository.findOne({
      where: { id },
      relations: { images: true },
    });
    if (!productOnDb) {
      return res.send(routeResponse(false, "No product with id"));
    }
    res.send(routeResponse(true, "Product Information Ready", productOnDb));
  } catch (err) {
    res.send(routeResponse(false, (err as Error).message));
  }
});
