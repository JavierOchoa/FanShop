import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Address {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  fullName: string;

  @Column("text")
  address: string;

  @Column("int")
  phone: bigint;

  @Column("text")
  city: string;

  @Column("text")
  state: string;

  @Column("text")
  country: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user: User;
}