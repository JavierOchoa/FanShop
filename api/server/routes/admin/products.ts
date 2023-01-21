import { Router } from "express";
import passport from "passport";
import { productImageRepository, productRepository } from "../../../appDataSource";
import { Product, User } from "../../../appDataSource/entity";
import { routeResponse } from "..";

export const productsAdminRouter = Router();

productsAdminRouter.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const user = req.user as User;
    if (!user.roles.includes("admin")) {
      res.status(401).send(routeResponse(false, "Unauthorized"));
      return;
    }
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
    const sortedProducts = productsOnDb.sort((a, b) => {
      var textA = a.title.toUpperCase();
      var textB = b.title.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    res.send(routeResponse(true, "Products fetched", sortedProducts));
  } catch (err) {
    res.send(routeResponse(false, (err as Error).message));
  }
});

productsAdminRouter.get(
  "/:productId",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { productId } = req.params;
    const user = req.user as User;
    if (!user.roles.includes("admin")) {
      res.status(401).send(routeResponse(false, "Unauthorized"));
      return;
    }
    if (!productId) {
      res.send(routeResponse(false, "No product id"));
      return;
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
      if (!productInformation) {
        res.send(routeResponse(false, `No product with ID: ${productId}`));
        return;
      }
      res.send(productInformation);
    } catch (err) {
      res.send(routeResponse(false, (err as Error).message));
    }
  }
);

productsAdminRouter.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id, title, price, description, stock, gender, sizes, tags, images } = req.body;
    const user = req.user as User;
    if (!user.roles.includes("admin")) {
      res.status(401).send(routeResponse(false, "Unauthorized"));
      return;
    }
    if (!id) {
      res.send(routeResponse(false, "Product ID missing"));
      return;
    }
    if (
      !/^[_A-z0-9]*((-|\s)*[_A-z0-9])*$/g.test(title) ||
      !/[\S\s]+[\S]*$/g.test(title) ||
      !/[\S\s]+[\S]*$/g.test(description) ||
      isNaN(stock) ||
      isNaN(price) ||
      !["kid", "men", "women", "unisex"].includes(gender) ||
      tags.length < 1 ||
      sizes.length < 1
    ) {
      res
        .status(400)
        .send(
          routeResponse(
            false,
            "Missing information or Wrong data. Please check all fields and select at least one size and tag"
          )
        );
      return;
    }
    try {
      const productOnDb = await productRepository.findOne({ where: { id } });
      if (!productOnDb) {
        res.send(routeResponse(false, `No product found with ID: ${id}`));
        return;
      }

      const newImages = images.map((image: { id: number; url: string }) =>
        productImageRepository.create({
          url: image.url,
        })
      );
      productOnDb.title = title;
      productOnDb.price = Number(price);
      productOnDb.description = description;
      productOnDb.stock = Number(stock);
      productOnDb.gender = gender;
      productOnDb.sizes = sizes;
      productOnDb.tags = tags;
      productOnDb.images = newImages;
      await productRepository.save(productOnDb);
      res.status(200).send(routeResponse(true, `Product ${id} has been updated successfully`));
    } catch (err) {
      res.send(routeResponse(false, (err as Error).message));
      return;
    }
  }
);

productsAdminRouter.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { title, price, description, stock, gender, sizes, tags, images } = req.body;
    const user = req.user as User;
    if (!user.roles.includes("admin")) {
      res.status(401).send(routeResponse(false, "Unauthorized"));
      return;
    }
    try {
      const newImages = images.map((image: { id: number; url: string }) =>
        productImageRepository.create({
          url: image.url,
        })
      );
      const newProduct = productRepository.create({
        title,
        price,
        description,
        stock,
        gender,
        sizes,
        tags,
        images: newImages,
        user,
      });
      await productRepository.save(newProduct);
      res.send(routeResponse(true, "Product has been created"));
    } catch (err) {
      res.send(routeResponse(false, (err as Error).message));
      return;
    }
  }
);

productsAdminRouter.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user as User;
    const { id } = req.params;
    if (!user.roles.includes("admin")) {
      res.status(401).send(routeResponse(false, "Unauthorized"));
    }
    try {
      const productOnDb = await productRepository.findOne({ where: { id } });
      if (!productOnDb) {
        res.send(routeResponse(false, `No product with ID: ${id}`));
        return;
      }
      await productRepository
        .createQueryBuilder("product")
        .delete()
        .from(Product)
        .where("id = :id", { id })
        .execute();

      res.send(routeResponse(true, `Product with ID: ${id} has been deleted`));
    } catch (err) {
      res.send(routeResponse(true, (err as Error).message));
    }
  }
);
