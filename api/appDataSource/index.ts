import "reflect-metadata";
import { DataSource } from "typeorm";
import { User, Product, ProductImage } from "./entity";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT),
  username: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  entities: [User, Product, ProductImage],
  synchronize: true,
  logging: false,
});

export const userRepository = AppDataSource.getRepository(User);
export const productRepository = AppDataSource.getRepository(Product);
export const productImageRepository = AppDataSource.getRepository(ProductImage);
