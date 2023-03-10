import { User } from "../auth/user";
import { APIResponse } from "../";

export interface APIProductResponse extends APIResponse {
  data: ProductAdminReponse[];
}

export interface ProductAdminReponse {
  id: string;
  title: string;
  price: number;
  stock: number;
  user: User;
}
