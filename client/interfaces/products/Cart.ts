export interface CartItem {
  id: string;
  title: string;
  image: string;
  quantity: number;
  size: string;
  price: number;
}

export interface CartItemToRemove {
  id: string;
  size: string;
}
