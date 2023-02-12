import { Router } from "express";
import passport from "passport";
import { routeResponse } from ".";
import {
  orderedProductRepository,
  orderRepository,
  productRepository,
  userRepository,
} from "../../appDataSource";
import { Product, Order, User, OrderedProduct } from "../../appDataSource/entity";
import { CartItem } from "../../interfaces";

export const orderRouter = Router();

orderRouter.post("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const user = req.user as User;
  const { cartItems } = req.body;
  try {
    const userOnDb = await userRepository.findOne({ where: { id: user.id } });
    if (!userOnDb) return res.send(routeResponse(false, "User not found"));

    const itemsPromises = cartItems.map((item: CartItem) =>
      productRepository.findOne({ where: { id: item.id } })
    );
    const products: Product[] = await Promise.all(itemsPromises);

    const orderedProductsCreationPromise = products.map((product) => {
      const itemToCreate: CartItem = cartItems.filter(
        (item: CartItem) => product.id === item.id
      )[0];
      const newOrderProduct = new OrderedProduct();
      newOrderProduct.price = itemToCreate.price;
      newOrderProduct.size = itemToCreate.size;
      newOrderProduct.quantity = itemToCreate.quantity;
      newOrderProduct.product = product;
      return orderedProductRepository.save(newOrderProduct);
    });
    const orderedProducts = await Promise.all(orderedProductsCreationPromise);

    const total = products.reduce((acc, value) => acc + value.price, 0);
    const newOrder = new Order();
    newOrder.products = orderedProducts;
    newOrder.total = total;
    newOrder.user = userOnDb;
    await orderRepository.save(newOrder);
    res.send(routeResponse(true, "Order created", newOrder.id));
  } catch (err) {
    res.send(routeResponse(false, (err as Error).message));
  }
});

orderRouter.get("/:id", passport.authenticate("jwt", { session: false }), async (req, res) => {
  const { id: userId } = req.user as User;
  const { id } = req.params;
  try {
    const orderOnDb = await orderRepository.findOne({
      where: { id },
      relations: { user: true, products: { product: true } },
    });
    if (!orderOnDb) return res.send(routeResponse(false, "No order found"));
    if (orderOnDb.user.id !== userId) return res.send(routeResponse(false, "User mismatch"));
    res.send(routeResponse(true, "Order found", orderOnDb));
  } catch (e) {
    res.send(routeResponse(false, (e as Error).message));
  }
});
