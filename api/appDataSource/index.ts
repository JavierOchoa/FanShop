import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, Product, ProductImage, Order, Address, OrderedProduct } from "./entity";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: [User, Product, ProductImage, Order, Address, OrderedProduct],
  synchronize: true,
  dropSchema: true,
  logging: false,
});

export const userRepository = AppDataSource.getRepository(User);
export const productRepository = AppDataSource.getRepository(Product);
export const productImageRepository = AppDataSource.getRepository(ProductImage);
export const orderRepository = AppDataSource.getRepository(Order);
export const addressRepository = AppDataSource.getRepository(Address);
export const orderedProductRepository = AppDataSource.getRepository(OrderedProduct);
