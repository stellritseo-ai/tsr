export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  link?: string;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'completed' | 'cancelled';
  date: string;
}
