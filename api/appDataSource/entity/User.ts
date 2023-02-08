import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Order } from "./Order";
import { Product } from "./Product";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { unique: true })
  email: string;

  @Column("text", { select: false })
  password: string;

  @Column("text", { nullable: true })
  fullName: string;

  @Column("bool", { default: true })
  isActive: boolean;

  @Column("text", { array: true, default: ["user"] })
  roles: string[];

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email?.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
