export interface CartItem {
  productId: string;
  quantity: number;
  price: number; 
  name: string; 
}

export interface Cart {
  userId: string;
  items: CartItem[];
  totalAmount: number;
} 