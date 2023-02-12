import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order";
import { User } from "./User";

@Entity()
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  fullName: string;

  @Column("text")
  address: string;

  @Column("bigint")
  phone: number;

  @Column("text")
  city: string;

  @Column("text")
  state: string;

  @Column("text")
  country: string;

  @OneToMany(() => Order, (order) => order.address)
  orders: Order[];

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}
