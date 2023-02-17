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

export interface OrderResume {
  id: string;
  status: OrderStatus;
  paypalId: string;
  total: number;
  products: ProductElement[];
  address: AddressBody;
}

export interface OrderInformation extends OrderResume {
  user: User;
}

export interface APIOrderHistoryResponse extends APIResponse {
  data: OrderResume[];
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
