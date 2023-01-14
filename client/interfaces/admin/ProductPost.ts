export interface ProductPost {
  sizes: string[];
  tags: string[];
  images: {
    id: number;
    url: string;
  }[];
  id?: string | undefined;
  title: string;
  price: string;
  description: string;
  stock: string;
  gender: string;
}
