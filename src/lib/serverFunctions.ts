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
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  return response.json();
};

export const updateOrderStatus = async (orderId: string, status: Order['status']) => {
  const response = await fetch('/api/update-order-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, status }),
  });
  return response.json();
};

export const getProducts = async (): Promise<any[]> => {
  const response = await fetch('/api/get-products');
  return response.json();
};

export const createProduct = async (product: any) => {
  const response = await fetch('/api/create-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return response.json();
};

export const updateProduct = async (product: any) => {
  const response = await fetch('/api/update-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  return response.json();
};

export const deleteProduct = async (productId: string) => {
  const response = await fetch('/api/delete-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId }),
  });
  return response.json();
};

export const getManualCustomers = async (): Promise<any[]> => {
  const response = await fetch('/api/get-customers');
  return response.json();
};

export const createManualCustomer = async (customer: any) => {
  const response = await fetch('/api/create-customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(customer),
  });
  return response.json();
};

export const adminLogin = async (username: string, password: string) => {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return response.json();
};

export const changeAdminPassword = async (currentPassword: string, newPassword: string) => {
  const response = await fetch('/api/admin/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return response.json();
};

export const sendContactMessage = async (contactData: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) => {
  const response = await fetch('/api/send-contact-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData),
  });
  return response.json();
};

export const getContactMessages = async () => {
  const response = await fetch('/api/get-contact-messages');
  return response.json();
};

export const deleteContactMessage = async (id: string) => {
  const response = await fetch('/api/delete-contact-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  return response.json();
};

export const getCloudinarySignature = async () => {
  const response = await fetch('/api/cloudinary-signature');
  return response.json();
};

export const startChatThread = async (customerName: string, customerEmail: string) => {
  const response = await fetch('/api/chat/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerName, customerEmail }),
  });
  return response.json();
};

export const getChatThread = async (id: string) => {
  const response = await fetch(`/api/chat/get?id=${encodeURIComponent(id)}`);
  return response.json();
};

export const sendChatMessage = async (chatId: string, sender: 'customer' | 'admin', text: string) => {
  const response = await fetch('/api/chat/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId, sender, text }),
  });
  return response.json();
};

export const getChatThreads = async () => {
  const response = await fetch('/api/chat/list');
  return response.json();
};

export const readChatThread = async (chatId: string) => {
  const response = await fetch('/api/chat/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chatId }),
  });
  return response.json();
};

export const incrementVisitors = async () => {
  const response = await fetch('/api/visitors/increment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  return response.json();
};

export const getVisitorsCount = async () => {
  const response = await fetch('/api/visitors/count');
  return response.json();
};

export const deleteOrder = async (id: string) => {
  const response = await fetch('/api/delete-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  return response.json();
};


