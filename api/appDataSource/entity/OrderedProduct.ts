import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Product";

@Entity()
export class OrderedProduct {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("int")
  quantity: number;

  @Column("text")
  size: string;

  @Column("float")
  price: number;

  @ManyToOne(() => Product, (product) => product.ordered)
  product: Product;
}
