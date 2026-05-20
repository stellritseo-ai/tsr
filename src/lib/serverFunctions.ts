import { Order } from '@/types/order';

export const createOrder = async (order: Order) => {
  const response = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  return response.json();
};

export const getOrders = async (): Promise<Order[]> => {
  const response = await fetch('/api/get-orders');
  return response.json();
};

export const createCheckoutSession = async (items: any[]) => {
  // This will eventually point to /api/create-checkout-session
  return { url: '/success' };
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  // Placeholder for status updates
  return { success: true };
};
