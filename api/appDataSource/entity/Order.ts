import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Address } from "./Address";
import { OrderedProduct } from "./OrderedProduct";

type OrderStatus = "completed" | "incomplete" | "in-progress";

@Entity()
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { default: "incomplete" })
  status: OrderStatus;

  @Column("text", { default: "pending" })
  paypalId: string;

  @Column("float", { default: 0 })
  total: number;

  @ManyToOne(() => Address, (address) => address.orders)
  address: Address;

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToMany(() => OrderedProduct)
  @JoinTable()
  products: OrderedProduct[];
}
