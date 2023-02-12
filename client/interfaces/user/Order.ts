import { APIResponse, User } from "../index";
import { CleanProduct } from "../products/ProductInformation";

export interface APIOrderResponse extends APIResponse {
  data: OrderInformation;
}

export interface ProductElement {
  id: string;
  quantity: number;
  size: string;
  price: number;
  product: CleanProduct;
}

export interface OrderInformation {
  id: string;
  status: "complete" | "incomplete";
  total: number;
  user: User;
  products: ProductElement[];
}
