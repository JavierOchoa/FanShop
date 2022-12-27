import { User } from "../user";

export interface DetailedProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: Size[];
  gender: Gender;
  tags: Tag[];
  user?: User;
  images: Image[];
}

enum Gender {
  Kid = "kid",
  Men = "men",
  Unisex = "unisex",
  Women = "women",
}

interface Image {
  id: string;
  url: string;
}

enum Size {
  L = "L",
  M = "M",
  S = "S",
  Xl = "XL",
  Xs = "XS",
  Xxl = "XXL",
}

enum Tag {
  Hats = "hats",
  Hoodie = "hoodie",
  Jacket = "jacket",
  Shirt = "shirt",
  Sweatshirt = "sweatshirt",
}
