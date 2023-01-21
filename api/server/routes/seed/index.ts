import { Router } from "express";
import { initialData } from "./seed-data";
import { productImageRepository, productRepository, userRepository } from "../../../appDataSource";
import { User } from "../../../appDataSource/entity";
import { SeedProduct, SeedUser } from "../../../interfaces";
import passport from "passport";
import { routeResponse } from "..";

export const seedRouter = Router();

seedRouter.get("/", passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const user = req.user as User;

    if (!user.roles.includes("admin")) {
      res.status(401).send(routeResponse(false, "Unauthorized"));
      return;
    }

    await productRepository.createQueryBuilder("product").delete().where({}).execute();
    await userRepository.createQueryBuilder("user").delete().where({}).execute();

    const products = initialData.products;
    const adminSeed = initialData.admin;

    let adminPromise = createUser(adminSeed);

    const admin = await Promise.resolve(adminPromise);

    let productPromises: any = [];
    products.forEach((product) => {
      productPromises.push(createProduct(product, admin));
    });

    await Promise.all(productPromises);

    res.send(routeResponse(true, "Seed executed"));
  } catch (error) {
    const reason = handleError(error);
    res.send(routeResponse(false, reason));
  }
});

const createUser = async (user: SeedUser) => {
  const newUser = userRepository.create(user);
  await userRepository.save(newUser);
  return newUser;
};

const createProduct = async (product: SeedProduct, user: User) => {
  const { images = [], ...productInfo } = product;
  const newImages = images.map((image) =>
    productImageRepository.create({
      url: `https://res.cloudinary.com/ds0c4q873/image/upload/FanShop/products/${image}`,
    })
  );
  const newProduct = productRepository.create({
    ...productInfo,
    images: newImages,
    user,
  });
  await productRepository.save(newProduct);
  return { ...newProduct, images };
};

const handleError = (error: any) => {
  console.log(error);
  return "Unknown error, please check console";
};
