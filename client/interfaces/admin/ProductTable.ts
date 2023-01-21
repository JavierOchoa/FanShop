import { errorStatus } from "..";
export interface TableHeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

export interface ProductBody {
  id?: string;
  title: string;
  price: string;
  description: string;
  stock: string;
  gender: string;
}

export interface SizeState {
  XS: boolean;
  S: boolean;
  M: boolean;
  L: boolean;
  XL: boolean;
  XXL: boolean;
}

export interface TagState {
  shirt: boolean;
  pant: boolean;
  hoodie: boolean;
  jacket: boolean;
  hat: boolean;
  sweatshirt: boolean;
}

export interface ProductErrorState {
  title: errorStatus;
  price: errorStatus;
  description: errorStatus;
  stock: errorStatus;
  gender: errorStatus;
}

// interface errorStatus {
//   status: boolean;
//   message: string;
// }
