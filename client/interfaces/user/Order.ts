import { AddressBody, APIResponse, User } from "../index";
import { CleanProduct } from "../products/ProductInformation";

type OrderStatus = "completed" | "incomplete" | "in-progress";

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
  status: OrderStatus;
  total: number;
  user: User;
  products: ProductElement[];
  address: AddressBody;
}

export interface APIOrderStatusResponse extends APIResponse {
  data: OrderStatus;
}

export interface CreatePaypalOrder {
  orderId: string;
  total: number;
  addressId: string;
}

export interface CreatePaypalOrderResponse {
  id: string;
  status: string;
  payment_source: PaymentSource;
  links: Link[];
}

interface Link {
  href: string;
  rel: string;
  method: string;
}

interface PaymentSource {
  paypal: Paypal;
}

interface Paypal {}
