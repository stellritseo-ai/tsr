import url from 'url';

// Import all our handlers from the ignored _handlers folder
import getProducts from './_handlers/get-products';
import createProduct from './_handlers/create-product';
import updateProduct from './_handlers/update-product';
import deleteProduct from './_handlers/delete-product';
import getCustomers from './_handlers/get-customers';
import createCustomer from './_handlers/create-customer';
import getOrders from './_handlers/get-orders';
import createOrder from './_handlers/create-order';
import updateOrderStatus from './_handlers/update-order-status';
import createCheckoutSession from './_handlers/create-checkout-session';
import sendContactMessage from './_handlers/send-contact-message';
import adminLogin from './_handlers/admin/login';
import adminChangePassword from './_handlers/admin/change-password';

export default async function handler(req: any, res: any) {
  // Parse URL to get the path
  const parsedUrl = url.parse(req.url || '', true);
  const pathname = parsedUrl.pathname || '';

  // Clean pathname to handle Vercel routing variations
  const cleanPath = pathname.replace(/\/$/, '');

  console.log(`[Vercel API Router] Route: ${cleanPath} | Method: ${req.method}`);

  try {
    switch (cleanPath) {
      case '/api/get-products':
        return await getProducts(req, res);
      case '/api/create-product':
        return await createProduct(req, res);
      case '/api/update-product':
        return await updateProduct(req, res);
      case '/api/delete-product':
        return await deleteProduct(req, res);
      case '/api/get-customers':
        return await getCustomers(req, res);
      case '/api/create-customer':
        return await createCustomer(req, res);
      case '/api/get-orders':
        return await getOrders(req, res);
      case '/api/create-order':
        return await createOrder(req, res);
      case '/api/update-order-status':
        return await updateOrderStatus(req, res);
      case '/api/create-checkout-session':
        return await createCheckoutSession(req, res);
      case '/api/send-contact-message':
        return await sendContactMessage(req, res);
      case '/api/admin/login':
        return await adminLogin(req, res);
      case '/api/admin/change-password':
        return await adminChangePassword(req, res);
      default:
        res.status(404).json({ success: false, error: `Route ${cleanPath} not found` });
    }
  } catch (err: any) {
    console.error(`[Vercel API Router Error] ${cleanPath}:`, err);
    res.status(500).json({ success: false, error: err.message });
  }
}
