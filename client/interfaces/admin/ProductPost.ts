export interface ProductPost {
  sizes: string[];
  tags: string[];
  images: {
    id: number;
    url: string;
  }[];
  id?: string | undefined;
  title: string;
  price: number;
  description: string;
  stock: number;
  gender: string;
}
