import { User } from "../auth/user";

export interface DetailedProduct {
  id?: string;
  title: string;
  price: number;
  description: string;
  slug?: string;
  stock: number;
  sizes: string[];
  gender: string;
  tags: string[];
  images: Image[];
  user?: User;
}

export interface Image {
  id: string;
  url: string;
}
