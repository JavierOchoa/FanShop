// Generated by https://quicktype.io

import { ImageInProduct } from "./ImageInProducts";
import { APIResponse } from "..";

export interface APIProductInformation extends APIResponse {
  data: ProductInformation;
}

export interface CleanProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: string[];
  gender: string;
  tags: string[];
}

export interface ProductInformation extends CleanProduct {
  images: ImageInProduct[];
}
