// Generated by https://quicktype.io

import { ImageInProduct } from "./ImageInProducts";
import { APIResponse } from "../admin";

export interface APIProductInformation extends APIResponse {
  data: ProductInformation;
}

export interface ProductInformation {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: string[];
  gender: string;
  tags: string[];
  images: ImageInProduct[];
}
