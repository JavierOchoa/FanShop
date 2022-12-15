import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text", { unique: true })
  title: string;

  @Column("float", { default: 0 })
  price: number;

  @Column("text", { nullable: true })
  description: true;

  @Column("text", { unique: true })
  slug: string;

  @Column("int", { default: 0 })
  stock: number;

  @Column("text", { array: true })
  sizes: string[];

  @Column("text")
  gender: string;

  @Column("text", { array: true, default: [] })
  tags: string[];

  @ManyToOne(() => User, (user) => user.product, { eager: true })
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
      this.slug = this.slug
        .toLowerCase()
        .replaceAll(" ", "_")
        .replaceAll("'", "");
    }
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(" ", "_")
      .replaceAll("'", "");
  }
}
