import { Order } from '@/types/order';

const ORDERS_KEY = 'tsr_orders';

export const saveOrder = (order: Order) => {
  if (typeof window === 'undefined') return;
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem(ORDERS_KEY);
  return saved ? JSON.parse(saved) : [];
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  if (typeof window === 'undefined') return [];
  const orders = getOrders();
  const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
  return updated;
};
