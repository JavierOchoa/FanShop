import { Router } from "express";
import passport from "passport";
import { productImageRepository, productRepository } from "../../../appDataSource";
import { Product, User } from "../../../appDataSource/entity";

export const productsAdminRouter = Router();

productsAdminRouter.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const user = req.user as User;
    if (!user.roles.includes("admin")) {
      res.send({
        successful: false,
        message: "Unauthorized",
      });
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
    res.send(sortedProducts);
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

productsAdminRouter.post(
  "/edit",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { id, title, price, description, stock, gender, sizes, tags, images } = req.body;

    if (!id) {
      res.send({
        successful: false,
        message: "Product ID missing",
      });
      return;
    }

    try {
      const productOnDb = await productRepository.findOne({ where: { id } });
      if (!productOnDb) {
        res.send({
          successful: false,
          message: `No product found with ID: ${id}`,
        });
        return;
      }

      const newImages = images.map((image: { id: number; url: string }) =>
        productImageRepository.create({
          url: image.url,
        })
      );
      productOnDb.title = title;
      productOnDb.price = price;
      productOnDb.description = description;
      productOnDb.stock = stock;
      productOnDb.gender = gender;
      productOnDb.sizes = sizes;
      productOnDb.tags = tags;
      productOnDb.images = newImages;
      await productRepository.save(productOnDb);
      res.send({
        successful: true,
        message: `Product ${id} has been updated successfully`,
      });
    } catch (err) {
      res.send({
        successful: false,
        message: (err as Error).message,
      });
      return;
    }
  }
);

productsAdminRouter.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const user = req.user as User;
    const { title, price, description, stock, gender, sizes, tags, images } = req.body;

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
      res.send({
        successful: true,
        message: `Product has been created`,
      });
    } catch (err) {
      res.send({
        successful: false,
        message: (err as Error).message,
      });
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
      res.send({
        successful: false,
        message: "Unauthorized",
      });
    }
    try {
      const productOnDb = await productRepository.findOne({ where: { id } });
      if (!productOnDb) {
        res.send({
          successful: false,
          message: `No product with ID: ${id}`,
        });
        return;
      }
      await productRepository
        .createQueryBuilder("product")
        .delete()
        .from(Product)
        .where("id = :id", { id })
        .execute();

      res.send({
        successful: true,
        message: `Product with ID: ${id} has been deleted`,
      });
    } catch (err) {
      console.log(err);
      res.send({
        successful: true,
        message: (err as Error).message,
      });
    }
  }
);
