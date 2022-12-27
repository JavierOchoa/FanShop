import { User } from "../user";

export interface ProductAdminReponse {
  id: string;
  title: string;
  price: number;
  stock: number;
  user: User;
}
