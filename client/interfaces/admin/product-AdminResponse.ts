import { User } from "../user";

export interface ProductAdminReponse {
  title: string;
  price: number;
  stock: number;
  user: User;
}
