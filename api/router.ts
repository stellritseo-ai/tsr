import url from 'url';
import crypto from 'crypto';
import Stripe from 'stripe';
import { MongoClient, Db, ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';

// ─── TYPES & INTERFACES ──────────────────────────────────────────────────────
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

// ─── MONGO DATABASE CONNECTION pooling (optimized for serverless) ───
const uri = process.env.MONGODB_URI || '';

if (!uri) {
  console.warn('[MongoDB Connect Warning] MONGODB_URI is not set in environment variables.');
}

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    try {
      // Fast check to verify connection is still active/alive
      await cachedClient.db("tsr-commerce").command({ ping: 1 });
      return { client: cachedClient, db: cachedDb };
    } catch (pingError) {
      console.warn('[MongoDB Cache Warning] Cached client ping failed, re-establishing connection...');
      cachedClient = null;
      cachedDb = null;
    }
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db("tsr-commerce");

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// ─── EMAIL TRANSACTIONAL NOTIFICATIONS (inlined templates & send logic) ───

/**
 * Generates an elegant, high-fidelity luxury HTML email template for the merchant.
 * Designed to match the elegant botanical theme of TSR Skin & Hair Care.
 */
function generateOrderEmailHtml(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #EAE6DF;">
        <td style="padding: 20px 0; vertical-align: top;">
          <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <tr>
              ${item.image
          ? `<td style="padding-right: 20px; vertical-align: top; width: 80px;">
                      <img src="${item.image}" alt="${item.name}" width="72" height="72" style="border-radius: 10px; object-fit: cover; border: 1px solid #EAE6DF; display: block;" />
                     </td>`
          : ''
        }
              <td style="vertical-align: top;">
                <div style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #C5A880; margin-bottom: 4px;">Product Name</div>
                ${item.link
          ? `<a href="${item.link}" style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 600; color: #1C1B19; text-decoration: underline; text-underline-offset: 3px;">${item.name}</a>`
          : `<div style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 600; color: #1C1B19;">${item.name}</div>`
        }
                ${item.link
          ? `<div style="margin-top: 4px;"><a href="${item.link}" style="font-family: 'Inter', sans-serif; font-size: 11px; color: #8A857C; text-decoration: none;">View Product →</a></div>`
          : ''
        }
                <div style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.08em; color: #8A857C; margin-top: 6px;">Qty: ${item.quantity} &nbsp;·&nbsp; $${item.price.toFixed(2)} each</div>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding: 20px 0; text-align: right; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: #1C1B19; vertical-align: top; white-space: nowrap;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>New Ritual Order Received</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&display=swap');
        body {
          margin: 0;
          padding: 0;
          width: 100% !important;
          background-color: #FDFCF9;
          -webkit-text-size-adjust: none;
          -ms-text-size-adjust: none;
        }
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #FDFCF9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FDFCF9; padding: 40px 20px;">
        <tr>
          <td align="center" valign="top">
            <!-- Email Container -->
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #EAE6DF; box-shadow: 0 10px 30px rgba(28, 27, 25, 0.03);">
              
              <!-- Brand Header -->
              <tr>
                <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #F6F4F0; background-color: #FFFFFF;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td align="center">
                        <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #1C1B19; margin-bottom: 6px;">TSR SKIN & HAIR CARE</div>
                        <div style="font-family: 'Inter', sans-serif; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: #C5A880; font-weight: 600;">Premium Botanical Care</div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Alert Bar -->
              <tr>
                <td style="padding: 24px 40px; background-color: #F8F6F2; border-bottom: 1px solid #EAE6DF;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td>
                        <span style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #C5A880; display: block; margin-bottom: 4px;">New Order Placed</span>
                        <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 600; color: #1C1B19; line-height: 1.3;">Order ${order.id} is ready for shipping</h1>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Main Content Area -->
              <tr>
                <td style="padding: 40px 40px 20px 40px;">
                  
                  <!-- Section: Customer Info -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                    <tr>
                      <td>
                        <h3 style="margin: 0 0 16px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 600; color: #1C1B19; border-bottom: 1px solid #EAE6DF; padding-bottom: 8px;">Shipping Information</h3>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #8A857C; width: 120px; font-weight: 500;">Customer:</td>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; font-weight: 600;">${order.customerName}</td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #8A857C; font-weight: 500;">Email:</td>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; font-weight: 600;">
                              <a href="mailto:${order.email}" style="color: #1C1B19; text-decoration: underline;">${order.email}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #8A857C; font-weight: 500;">Phone:</td>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; font-weight: 600;">${order.phone || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #8A857C; font-weight: 500; vertical-align: top;">Address:</td>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; font-weight: 600; line-height: 1.5;">
                              ${order.address}<br />
                              ${order.city}, ${order.zipCode}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Section: Order Meta Details -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px; background-color: #FDFCF9; border-radius: 12px; border: 1px solid #F1EDE7;">
                    <tr>
                      <td style="padding: 16px 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #8A857C;">Order Date:</td>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #1C1B19; text-align: right; font-weight: 500;">${order.date}</td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #8A857C;">Payment Status:</td>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #E05A47; text-align: right; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
                              ${order.status}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- Section: Order Items -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                    <thead>
                      <tr>
                        <th align="left" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #8A857C; padding-bottom: 12px; border-bottom: 2px solid #EAE6DF;">Product Details</th>
                        <th align="right" style="font-family: 'Inter', sans-serif; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #8A857C; padding-bottom: 12px; border-bottom: 2px solid #EAE6DF; width: 80px;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>

                  <!-- Section: Totals -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 10px; margin-bottom: 20px;">
                    <tr>
                      <td style="padding: 6px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #8A857C;">Subtotal:</td>
                      <td align="right" style="padding: 6px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; font-weight: 500;">$${order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 6px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #8A857C;">Ritual Shipping:</td>
                      <td align="right" style="padding: 6px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; font-weight: 500;">
                        ${order.shipping === 0 ? 'Complimentary' : `$${order.shipping.toFixed(2)}`}
                      </td>
                    </tr>
                    <tr style="border-top: 1px solid #EAE6DF;">
                      <td style="padding: 16px 0 6px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 20px; font-weight: 600; color: #1C1B19;">Grand Total:</td>
                      <td align="right" style="padding: 16px 0 6px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 700; color: #C5A880;">$${order.total.toFixed(2)}</td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Elegant Footer -->
              <tr>
                <td align="center" style="padding: 30px 40px 40px 40px; background-color: #F8F6F2; border-top: 1px solid #EAE6DF; text-align: center;">
                  <p style="margin: 0 0 12px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #8A857C; line-height: 1.6; font-style: italic;">
                    "Handcrafting self-care rituals with ethical botanicals."
                  </p>
                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 0.05em; color: #A09B92;">
                    TSR Skin & Hair Care Admin Panel &copy; ${new Date().getFullYear()}
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Generates a beautiful customer-facing order confirmation email.
 * Sent to the customer after they successfully complete a purchase.
 */
function generateCustomerConfirmationEmailHtml(order: Order): string {
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #EAE6DF;">
        <td style="padding: 18px 0; vertical-align: top;">
          <table cellpadding="0" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <tr>
              ${item.image
          ? `<td style="padding-right: 16px; vertical-align: top; width: 72px;">
                      <img src="${item.image}" alt="${item.name}" width="64" height="64" style="border-radius: 10px; object-fit: cover; border: 1px solid #EAE6DF; display: block;" />
                     </td>`
          : ''
        }
              <td style="vertical-align: top;">
                <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 15px; font-weight: 600; color: #1C1B19; margin-bottom: 4px;">${item.name}</div>
                <div style="font-family: 'Inter', sans-serif; font-size: 12px; color: #8A857C;">Qty: ${item.quantity} &nbsp;·&nbsp; $${item.price.toFixed(2)} each</div>
              </td>
            </tr>
          </table>
        </td>
        <td style="padding: 18px 0; text-align: right; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 600; color: #1C1B19; vertical-align: top; white-space: nowrap;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Your Order Is Confirmed — TSR Skin &amp; Hair Care</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&display=swap');
        body { margin: 0; padding: 0; width: 100% !important; background-color: #FDFCF9; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #FDFCF9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FDFCF9; padding: 40px 20px;">
        <tr>
          <td align="center" valign="top">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #EAE6DF; box-shadow: 0 10px 30px rgba(28,27,25,0.04);">

              <!-- Brand Header -->
              <tr>
                <td align="center" style="padding: 36px 40px 28px 40px; border-bottom: 1px solid #F6F4F0;">
                  <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 26px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #1C1B19; margin-bottom: 6px;">TSR SKIN &amp; HAIR CARE</div>
                  <div style="font-family: 'Inter', sans-serif; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: #C5A880; font-weight: 600;">Premium Botanical Care</div>
                </td>
              </tr>

              <!-- Hero Confirmation Banner -->
              <tr>
                <td align="center" style="padding: 40px 40px 32px; background: linear-gradient(135deg, #F8F5EF 0%, #FDF9F4 100%); border-bottom: 1px solid #EAE6DF;">
                  <div style="width: 64px; height: 64px; background-color: #C5A880; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                    <div style="font-size: 28px; line-height: 64px; text-align: center;">✓</div>
                  </div>
                  <div style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #C5A880; margin-bottom: 10px;">Order Confirmed</div>
                  <h1 style="margin: 0 0 12px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 600; color: #1C1B19; line-height: 1.3;">Thank you, ${order.customerName.split(' ')[0]}!</h1>
                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #8A857C; line-height: 1.6; max-width: 420px;">
                    Your order <strong style="color: #1C1B19;">${order.id}</strong> has been confirmed and is being prepared with care. We'll be in touch once it ships.
                  </p>
                </td>
              </tr>

              <!-- Order Summary -->
              <tr>
                <td style="padding: 36px 40px 20px 40px;">

                  <!-- Shipping Info -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px; background-color: #FDFCF9; border-radius: 12px; border: 1px solid #F1EDE7;">
                    <tr>
                      <td style="padding: 18px 20px;">
                        <div style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #C5A880; margin-bottom: 12px;">Shipping To</div>
                        <div style="font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; font-weight: 600; line-height: 1.7;">
                          ${order.customerName}<br/>
                          ${order.address}<br/>
                          ${order.city}, ${order.zipCode}
                        </div>
                      </td>
                    </tr>
                  </table>

                  <!-- Order Items -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                    <thead>
                      <tr>
                        <th align="left" style="font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #8A857C; padding-bottom: 10px; border-bottom: 2px solid #EAE6DF; font-weight: 600;">Your Items</th>
                        <th align="right" style="font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: #8A857C; padding-bottom: 10px; border-bottom: 2px solid #EAE6DF; width: 80px; font-weight: 600;">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${itemsHtml}
                    </tbody>
                  </table>

                  <!-- Totals -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px;">
                    <tr>
                      <td style="padding: 5px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #8A857C;">Subtotal:</td>
                      <td align="right" style="padding: 5px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; font-weight: 500;">$${order.subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td style="padding: 5px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #8A857C;">Shipping:</td>
                      <td align="right" style="padding: 5px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #C5A880; font-weight: 500;">
                        ${order.shipping === 0 ? 'Free ✨' : `$${order.shipping.toFixed(2)}`}
                      </td>
                    </tr>
                    <tr style="border-top: 1px solid #EAE6DF;">
                      <td style="padding: 14px 0 4px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 600; color: #1C1B19;">Order Total:</td>
                      <td align="right" style="padding: 14px 0 4px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 22px; font-weight: 700; color: #C5A880;">$${order.total.toFixed(2)}</td>
                    </tr>
                  </table>

                  <!-- Order Details Row -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 32px; background-color: #FDFCF9; border-radius: 12px; border: 1px solid #F1EDE7;">
                    <tr>
                      <td style="padding: 16px 20px;">
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="font-family: 'Inter', sans-serif; font-size: 12px; color: #8A857C; padding: 3px 0;">Order ID:</td>
                            <td align="right" style="font-family: 'Inter', sans-serif; font-size: 12px; color: #1C1B19; font-weight: 600; padding: 3px 0;">${order.id}</td>
                          </tr>
                          <tr>
                            <td style="font-family: 'Inter', sans-serif; font-size: 12px; color: #8A857C; padding: 3px 0;">Order Date:</td>
                            <td align="right" style="font-family: 'Inter', sans-serif; font-size: 12px; color: #1C1B19; font-weight: 600; padding: 3px 0;">${order.date}</td>
                          </tr>
                          <tr>
                            <td style="font-family: 'Inter', sans-serif; font-size: 12px; color: #8A857C; padding: 3px 0;">Payment Status:</td>
                            <td align="right" style="font-family: 'Inter', sans-serif; font-size: 12px; color: #22A55B; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 3px 0;">Paid ✓</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 12px;">
                    <tr>
                      <td align="center">
                        <a href="${order.items[0]?.link?.replace('/products', '') || 'https://tsrskinandhaircare.com'}/products"
                           style="display: inline-block; background-color: #1C1B19; color: #FFFFFF; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.3em; text-transform: uppercase; text-decoration: none; padding: 16px 40px; border-radius: 100px;">
                          Shop More Botanicals →
                        </a>
                      </td>
                    </tr>
                  </table>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td align="center" style="padding: 28px 40px 36px 40px; background-color: #F8F6F2; border-top: 1px solid #EAE6DF; text-align: center;">
                  <p style="margin: 0 0 8px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #8A857C; line-height: 1.6;">
                    Questions? Contact us at <a href="mailto:support@tsrskinandhaircare.com" style="color: #C5A880; text-decoration: none;">support@tsrskinandhaircare.com</a> or call <strong>407-694-8624</strong>
                  </p>
                  <p style="margin: 0 0 8px 0; font-family: 'Inter', sans-serif; font-size: 11px; color: #A09B92; font-style: italic;">
                    "Premium botanical care, crafted for you."
                  </p>
                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 0.05em; color: #B0ABA2;">
                    TSR Skin &amp; Hair Care &copy; ${new Date().getFullYear()} · Orlando, FL 32835
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Sends a confirmation email to the customer after their order is placed.
 */
export async function sendCustomerConfirmationEmail(order: Order, envOverrides?: Record<string, string>): Promise<boolean> {
  const getEnv = (key: string): string => {
    return (envOverrides && envOverrides[key]) || process.env[key] || '';
  };

  const resendApiKey = getEnv('RESEND_API_KEY');
  const customerEmail = order.email;

  if (!customerEmail) {
    console.warn('[TSR Email] No customer email on order — skipping customer confirmation.');
    return false;
  }

  const subject = `✅ Order Confirmed — ${order.id} | TSR Skin & Hair Care`;
  const html = generateCustomerConfirmationEmailHtml(order);

  console.log(`\n📧 [TSR Email] Sending customer confirmation for order ${order.id} → ${customerEmail}`);

  // ─── Transport 1: Resend API ──────────────────────────────────────────────
  if (resendApiKey) {
    try {
      const fromEmail = getEnv('SMTP_FROM') || 'TSR Skin & Hair Care <onboarding@resend.dev>';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: customerEmail,
          subject,
          html,
        }),
      });

      const data = await response.json() as { id?: string; message?: string };
      if (response.ok) {
        console.log(`✅ [TSR Email] Customer confirmation delivered via Resend. Email ID: ${data.id}`);
        return true;
      }
      console.error('[TSR Email] Resend rejected customer confirmation:', data);
    } catch (err) {
      console.error('[TSR Email] Resend network error (customer confirmation):', err);
    }
  }

  // ─── Transport 2: SMTP / Nodemailer ──────────────────────────────────────
  const smtpHost = getEnv('SMTP_HOST');
  const smtpPort = parseInt(getEnv('SMTP_PORT') || '587', 10);
  const smtpUser = getEnv('SMTP_USER');
  const smtpPass = getEnv('SMTP_PASS');
  const smtpFrom = getEnv('SMTP_FROM') || `"TSR Skin & Hair Care" <${smtpUser}>`;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to: customerEmail,
        subject,
        html,
      });

      console.log(`✅ [TSR Email] Customer confirmation delivered via SMTP. Message-ID: ${info.messageId}`);
      return true;
    } catch (err) {
      console.error('[TSR Email] SMTP error (customer confirmation):', err);
    }
  }

  // ─── Transport 3: Ethereal (dev fallback) ────────────────────────────────
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await transporter.sendMail({
      from: `"TSR Skin & Hair Care" <${testAccount.user}>`,
      to: customerEmail,
      subject,
      html,
    } as any);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`\n📬 [TSR Email] Customer confirmation preview (dev): ${previewUrl}\n`);
    return true;
  } catch (etherealErr) {
    console.error('[TSR Email] Ethereal fallback failed (customer confirmation):', etherealErr);
  }

  return false;
}

/**
 * Sends a notification email to the store owner about a completed order.
 */
export async function sendOrderEmail(order: Order, envOverrides?: Record<string, string>): Promise<boolean> {
  const getEnv = (key: string): string => {
    return (envOverrides && envOverrides[key]) || process.env[key] || '';
  };

  const merchantEmail = getEnv('MERCHANT_EMAIL') || 'tsrskinandhair@gmail.com';
  const resendApiKey = getEnv('RESEND_API_KEY');

  const subject = `✨ New Ritual Order ${order.id} Placed — $${order.total.toFixed(2)}`;
  const html = generateOrderEmailHtml(order);

  console.log(`\n📧 [TSR Email] Preparing notification for order ${order.id} → ${merchantEmail}`);

  // ─── Transport 1: Resend API ──────────────────────────────────────────────
  if (resendApiKey) {
    console.log('[TSR Email] Sending via Resend API...');
    try {
      const fromEmail = getEnv('SMTP_FROM') || 'TSR Skin & Hair Care <onboarding@resend.dev>';

      // Send merchant notification
      const merchantResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: merchantEmail,
          subject,
          html,
        }),
      });

      const merchantData = await merchantResponse.json() as { id?: string; message?: string; name?: string };
      if (merchantResponse.ok) {
        console.log(`✅ [TSR Email] Merchant email delivered via Resend. Email ID: ${merchantData.id}`);
      } else {
        console.error('[TSR Email] Resend rejected merchant email:', JSON.stringify(merchantData));
      }

      // Send customer confirmation using the same transport
      if (order.email) {
        console.log(`[TSR Email] Sending customer confirmation to ${order.email} via Resend...`);
        const customerHtml = generateCustomerConfirmationEmailHtml(order);
        const customerSubject = `✅ Order Confirmed — ${order.id} | TSR Skin & Hair Care`;

        const customerResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: fromEmail,
            to: order.email,
            subject: customerSubject,
            html: customerHtml,
          }),
        });

        const customerData = await customerResponse.json() as { id?: string; message?: string; name?: string };
        if (customerResponse.ok) {
          console.log(`✅ [TSR Email] Customer confirmation delivered via Resend. Email ID: ${customerData.id}`);
        } else {
          console.error(`❌ [TSR Email] Resend rejected customer email to ${order.email}:`, JSON.stringify(customerData));
        }
      }

      if (merchantResponse.ok) return true;
    } catch (err) {
      console.error('[TSR Email] Resend network error:', err);
    }
  }

  // ─── Transport 2: SMTP / Nodemailer ──────────────────────────────────────
  const smtpHost = getEnv('SMTP_HOST');
  const smtpPort = parseInt(getEnv('SMTP_PORT') || '587', 10);
  const smtpUser = getEnv('SMTP_USER');
  const smtpPass = getEnv('SMTP_PASS');
  const smtpFrom = getEnv('SMTP_FROM') || `"TSR Skin & Hair Care" <${smtpUser}>`;

  if (smtpHost && smtpUser && smtpPass) {
    console.log(`[TSR Email] Sending via SMTP (${smtpHost}:${smtpPort})...`);
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to: merchantEmail,
        subject,
        html,
      });

      console.log(`✅ [TSR Email] Delivered via SMTP. Message-ID: ${info.messageId}`);
      return true;
    } catch (err) {
      console.error('[TSR Email] SMTP error:', err);
    }
  }

  // ─── Transport 3: Ethereal (automatic dev-mode preview) ──────────────────
  console.log('[TSR Email] No production transport configured — using Ethereal preview (dev mode)...');
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `"TSR Skin & Hair Care" <${testAccount.user}>`,
      to: merchantEmail,
      subject,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`\n📬 [TSR Email] Merchant preview (dev): ${previewUrl}\n`);
    return true;
  } catch (etherealErr) {
    console.error('[TSR Email] Ethereal preview also failed:', etherealErr);
  }

  return false;
}

/**
 * Generates an elegant, HTML luxury email template for contact inquiries.
 */
function generateContactEmailHtml(contact: { name: string; email: string; phone: string; subject: string; message: string }): string {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>New Correspondence Received</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style type="text/css">
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Inter:wght@300;400;500;600;700&display=swap');
        body { margin: 0; padding: 0; width: 100% !important; background-color: #FDFCF9; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #FDFCF9; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FDFCF9; padding: 40px 20px;">
        <tr>
          <td align="center" valign="top">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #EAE6DF; box-shadow: 0 10px 30px rgba(28, 27, 25, 0.03);">
              <tr>
                <td align="center" style="padding: 40px 40px 30px 40px; border-bottom: 1px solid #F6F4F0; background-color: #FFFFFF;">
                  <div style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: #1C1B19; margin-bottom: 6px;">TSR SKIN & HAIR CARE</div>
                  <div style="font-family: 'Inter', sans-serif; font-size: 9px; letter-spacing: 0.3em; text-transform: uppercase; color: #C5A880; font-weight: 600;">Premium Botanical Care</div>
                </td>
              </tr>
              <tr>
                <td style="padding: 24px 40px; background-color: #F8F6F2; border-bottom: 1px solid #EAE6DF;">
                  <span style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #C5A880; display: block; margin-bottom: 4px;">Client Inquiry</span>
                  <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; font-size: 24px; font-weight: 600; color: #1C1B19; line-height: 1.3;">New message from ${contact.name}</h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px 40px 20px 40px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 35px;">
                    <tr>
                      <td>
                        <h3 style="margin: 0 0 16px 0; font-family: 'Playfair Display', Georgia, serif; font-size: 18px; font-weight: 600; color: #1C1B19; border-bottom: 1px solid #EAE6DF; padding-bottom: 8px;">Contact Credentials</h3>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #8A857C; width: 120px; font-weight: 500;">Name:</td>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; font-weight: 600;">${contact.name}</td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #8A857C; font-weight: 500;">Email:</td>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; font-weight: 600;">
                              <a href="mailto:${contact.email}" style="color: #1C1B19; text-decoration: underline;">${contact.email}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #8A857C; font-weight: 500;">Phone:</td>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; font-weight: 600;">${contact.phone || 'N/A'}</td>
                          </tr>
                          <tr>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #8A857C; font-weight: 500;">Subject:</td>
                            <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #1C1B19; font-weight: 600;">${contact.subject || 'General Inquiry'}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 25px;">
                    <tr>
                      <td style="background-color: #FDFCF9; border-radius: 12px; border: 1px solid #F1EDE7; padding: 24px 24px; font-family: 'Inter', sans-serif; font-size: 14px; color: #1C1B19; line-height: 1.6; font-style: italic;">
                        ${contact.message.replace(/\n/g, '<br />')}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding: 30px 40px 40px 40px; background-color: #F8F6F2; border-top: 1px solid #EAE6DF; text-align: center;">
                  <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 10px; letter-spacing: 0.05em; color: #A09B92;">
                    TSR Skin & Hair Care Correspondence System &copy; ${new Date().getFullYear()}
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

/**
 * Sends a notification email to the store owner about a new contact message.
 */
export async function sendContactFormEmail(contactData: any, envOverrides?: Record<string, string>): Promise<boolean> {
  const getEnv = (key: string): string => {
    return (envOverrides && envOverrides[key]) || process.env[key] || '';
  };

  const merchantEmail = getEnv('MERCHANT_EMAIL') || 'tsrskinandhair@gmail.com';
  const resendApiKey = getEnv('RESEND_API_KEY');

  const subject = `📩 New TSR Message from ${contactData.name}: ${contactData.subject || 'General'}`;
  const html = generateContactEmailHtml(contactData);

  console.log(`\n📧 [TSR Contact Email] Preparing message notification → ${merchantEmail}`);

  // Resend API
  if (resendApiKey) {
    try {
      const fromEmail = getEnv('SMTP_FROM') || 'TSR Skin & Hair Care <onboarding@resend.dev>';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: merchantEmail,
          subject,
          html,
        }),
      });

      if (response.ok) {
        console.log(`✅ [TSR Contact Email] Delivered via Resend.`);
        return true;
      }
    } catch (err) {
      console.error('[TSR Contact Email] Resend error:', err);
    }
  }

  // SMTP Configuration
  const smtpHost = getEnv('SMTP_HOST');
  const smtpPort = parseInt(getEnv('SMTP_PORT') || '587', 10);
  const smtpUser = getEnv('SMTP_USER');
  const smtpPass = getEnv('SMTP_PASS');
  const smtpFrom = getEnv('SMTP_FROM') || `"TSR Skin & Hair Care" <${smtpUser}>`;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: merchantEmail,
        subject,
        html,
      });

      console.log(`✅ [TSR Contact Email] Delivered via SMTP.`);
      return true;
    } catch (err) {
      console.error('[TSR Contact Email] SMTP error:', err);
    }
  }

  // Ethereal Dev Preview Fallback
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await transporter.sendMail({
      from: `"TSR Skin & Hair Care" <${testAccount.user}>`,
      to: merchantEmail,
      subject,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`\n📬 [TSR Contact Email] Preview (dev): ${previewUrl}\n`);
    return true;
  } catch (err) {
    console.error('[TSR Contact Email] Ethereal fallback failed:', err);
  }

  return false;
}

// ─── HELPER: HASH PASSWORD ──────────────────────────────────────────────────
function hashPassword(password: string): string {
  const salt = 'tsr_secret_salt_2026';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// ─── 1. GET PRODUCTS ────────────────────────────────────────────────────────
async function handleGetProducts(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    let productsList: any[] = await db.collection("products").find({}).toArray();

    if (productsList.length === 0) {
      const initialProducts = [
        {
          id: "oil",
          name: "TSR™ Growth Oil",
          price: 19.99,
          category: "hair",
          description: "A nutrient-rich botanical oil blend designed to nourish the scalp, strengthen roots, reduce breakage, and support healthier-looking hair growth while adding softness and shine.",
          ingredients: ["Castor Oil", "Rosemary Oil", "Argan Oil", "Vitamin E"],
          benefits: ["Helps reduce breakage", "Nourishes scalp", "Adds softness", "Supports healthier-looking hair"],
          image: "/src/assets/product-growth-oil.jpg"
        },
        {
          id: "spray",
          name: "TSR™ Hydrating Spray",
          price: 16.99,
          category: "hair",
          description: "A lightweight moisture mist formulated to hydrate dry hair, soften texture, refresh curls, and revitalize the scalp throughout the day.",
          ingredients: ["Aloe Vera", "Peppermint", "Vitamin E", "Glycerin"],
          benefits: ["Lightweight hydration", "Refreshes hair", "Softens strands", "Revitalizes scalp"],
          image: "/src/assets/Hydrating-Spray.jpg"
        },
        {
          id: "butter",
          name: "TSR™ Hair Butter",
          price: 24.99,
          category: "hair",
          description: "A rich botanical butter crafted to deeply nourish strands, seal in moisture, soften texture, protect ends, and support fuller-looking healthy hair.",
          ingredients: ["Shea Butter", "Mango Oil", "Batana Oil", "Vitamin E"],
          benefits: ["Deep moisture", "Protects ends", "Softens texture", "Enhances fullness"],
          image: "/src/assets/Hair-Butter-v2.jpg"
        },
        {
          id: "bundle",
          name: "TSR™ 3-Step Hair Growth Bundle",
          price: 49.99,
          category: "bundles",
          description: "A complete luxury botanical hair ritual featuring Growth Oil, Hydrating Spray, and Hair Butter designed to hydrate, strengthen, nourish, and protect hair in one premium system.",
          includes: ["Growth Oil", "Hydrating Spray", "Hair Butter"],
          benefits: ["Complete hair ritual", "Moisture + nourishment", "Strength support", "Fuller-looking hair"],
          image: "/src/assets/3-Step-Hair-Growth.jpg"
        },
        {
          id: "lotion",
          name: "TSR™ Rosemary & Clove Lotion",
          price: 13.99,
          category: "skin",
          description: "A nourishing botanical lotion designed to hydrate skin deeply while leaving it soft, smooth, refreshed, and lightly scented with luxurious rosemary and clove notes.",
          ingredients: ["Rosemary", "Clove", "Shea Butter", "Vitamin E"],
          benefits: ["Deep hydration", "Smooth texture", "Lightweight moisture", "Luxurious finish"],
          image: "/src/assets/Rosemary.jpg"
        },
        {
          id: "aloe-bar",
          name: "TSR™ Aloe Shea Moisturizing Bar",
          price: 9.99,
          category: "skin",
          description: "A moisturizing cleansing bar enriched with aloe and shea butter to gently cleanse while helping maintain soft, hydrated skin.",
          ingredients: ["Aloe Vera", "Shea Butter", "Botanical Oils"],
          benefits: ["Gentle cleansing", "Moisturizing care", "Soft skin finish", "Everyday luxury cleansing"],
          image: "/src/assets/Aloe-Shea.jpg"
        },
        {
          id: "charcoal-bar",
          name: "TSR™ Charcoal Detox Bar",
          price: 10.99,
          category: "skin",
          description: "A detoxifying charcoal cleansing bar designed to deeply cleanse impurities while refreshing and revitalizing the skin.",
          ingredients: ["Activated Charcoal", "Essential Oils", "Botanical Base"],
          benefits: ["Detoxifying cleanse", "Removes impurities", "Refreshes skin", "Clean luxury feel"],
          image: "/src/assets/Charcoal-Detox.jpg"
        },
        {
          id: "goat-milk-bar",
          name: "TSR™ Goat Milk Honey Bar",
          price: 11.99,
          category: "skin",
          description: "A creamy goat milk and honey cleansing bar crafted to nourish and soften skin while delivering a luxurious bathing experience.",
          ingredients: ["Goat Milk", "Honey", "Nourishing Oils"],
          benefits: ["Nourishing cleanse", "Soft smooth skin", "Rich creamy lather", "Luxury moisture care"],
          image: "/src/assets/Goat-Milk.jpg"
        },
        {
          id: "turmeric-glow-bar",
          name: "TSR™ Turmeric Glow Bar",
          price: 10.99,
          category: "skin",
          description: "A brightening bar infused with turmeric to help improve the appearance of uneven skin tone while enhancing your natural glow.",
          ingredients: ["Turmeric", "Botanical Base", "Essential Oils"],
          benefits: ["Brightens dull skin", "Helps even skin tone", "Promotes a radiant glow"],
          image: "/src/assets/Turmeric-Glow.png"
        },
        {
          id: "soap-bundle",
          name: "TSR™ 3 Soap Bundle",
          price: 27.99,
          category: "bundles",
          description: "A premium bundle featuring the complete TSR™ luxury soap collection designed to cleanse, hydrate, soften, and refresh skin.",
          includes: ["Aloe Shea Bar", "Charcoal Detox Bar", "Goat Milk Honey Bar"],
          benefits: ["Complete skin ritual", "Diverse cleansing", "Hydration + Detox", "Luxury gift set"],
          image: "/src/assets/3-shop.jpg"
        },
        {
          id: "men-butter",
          name: "TSR™ Men’s Repair Hair Butter",
          price: 29.99,
          category: "men",
          description: "A rich restorative hair butter designed specifically for men to deeply moisturize, soften texture, nourish dry hair, and support healthier-looking hair.",
          ingredients: ["Botanical Butters", "Growth Oils", "Vitamin E"],
          benefits: ["Deep moisture", "Texture softening", "Nourishes hair", "Helps reduce dryness"],
          image: "/src/assets/Men’s-Repair-Hair.jpg"
        },
        {
          id: "men-spray",
          name: "TSR™ Leave-In Hydrating Spray",
          price: 19.99,
          category: "men",
          description: "A lightweight leave-in hydration spray designed for men to refresh hair, add moisture, soften texture, and support daily hair maintenance.",
          ingredients: ["Aloe Vera", "Hydration Complex", "Mint"],
          benefits: ["Lightweight moisture", "Refreshes hair", "Daily hydration", "Soft texture support"],
          image: "/src/assets/Leave-In-Hydrating.jpg"
        },
        {
          id: "men-oil",
          name: "TSR™ Men’s Bald Spot Restore Oil",
          price: 27.99,
          category: "men",
          description: "A concentrated botanical oil blend crafted to nourish the scalp and support healthier-looking hair in thinning or sparse areas.",
          ingredients: ["Restorative Oils", "Botanical Extracts", "Biotin"],
          benefits: ["Nourishes scalp", "Supports fuller appearance", "Adds shine", "Lightweight oil care"],
          image: "/src/assets/Men’s-Bald-Spot.jpg"
        }
      ];
      await db.collection("products").insertMany(initialProducts);
      productsList = initialProducts;
    }
    res.status(200).json(productsList);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── CLOUDINARY SIGNATURE GENERATION ─────────────────────────────────────────
async function handleGetCloudinarySignature(req: any, res: any) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || "q64fglez";
    const apiKey = process.env.CLOUDINARY_API_KEY || "858366267216782";
    const apiSecret = process.env.CLOUDINARY_API_SECRET || "Acl5fRzfRFq5jcyi9w68tx0Egic";

    if (!apiSecret) {
      return res.status(500).json({ success: false, error: "Cloudinary API Secret is missing in server environment" });
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = "tsr_products";

    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(stringToSign).digest('hex');

    res.status(200).json({
      success: true,
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder
    });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── 2. CREATE PRODUCT ─────────────────────────────────────────────────────
async function handleCreateProduct(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const product = req.body;
    const result = await db.collection("products").insertOne(product);
    res.status(200).json({ success: true, insertedId: result.insertedId });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── 3. UPDATE PRODUCT ─────────────────────────────────────────────────────
async function handleUpdateProduct(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const { id, ...updateFields } = req.body;
    const result = await db.collection("products").updateOne({ id }, { $set: updateFields });
    res.status(200).json({ success: true, updatedCount: result.modifiedCount });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── 4. DELETE PRODUCT ─────────────────────────────────────────────────────
async function handleDeleteProduct(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const { productId } = req.body;
    const result = await db.collection("products").deleteOne({ id: productId });
    res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── 5. GET CUSTOMERS ──────────────────────────────────────────────────────
async function handleGetCustomers(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const customers = await db.collection("customers").find({}).toArray();
    res.status(200).json(customers);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── 6. CREATE CUSTOMER ────────────────────────────────────────────────────
async function handleCreateCustomer(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const customer = req.body;
    const result = await db.collection("customers").insertOne(customer);
    res.status(200).json({ success: true, insertedId: result.insertedId });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── 7. GET ORDERS ─────────────────────────────────────────────────────────
async function handleGetOrders(req: any, res: any) {
  try {
    const { db } = await connectToDatabase();
    const orders = await db.collection("orders").find({}).sort({ _id: -1 }).toArray();
    res.status(200).json(orders);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── 8. CREATE ORDER ───────────────────────────────────────────────────────
async function handleCreateOrder(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const order = req.body;
    const result = await db.collection("orders").insertOne(order);

    // Send merchant notification email
    try {
      await sendOrderEmail(order);
    } catch (emailError) {
      console.error('[Email Notification Error] Failed to send merchant notification:', emailError);
    }

    // Send customer order confirmation email
    try {
      await sendCustomerConfirmationEmail(order);
    } catch (emailError) {
      console.error('[Email Notification Error] Failed to send customer confirmation:', emailError);
    }

    res.status(200).json({ success: true, orderId: result.insertedId });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── 9. UPDATE ORDER STATUS ────────────────────────────────────────────────
async function handleUpdateOrderStatus(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const { orderId, status } = req.body;
    const result = await db.collection("orders").updateOne({ id: orderId }, { $set: { status } });
    res.status(200).json({ success: true, updatedCount: result.modifiedCount });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── 10. CREATE CHECKOUT SESSION ──────────────────────────────────────────
async function handleCreateCheckoutSession(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { items } = req.body;
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ success: false, error: 'Missing items array' });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51O1dummy', {
      apiVersion: '2025-02-24.acacia' as any,
    });

    const lineItems = items.map((item: any) => {
      const validImage = item.image && item.image.startsWith('http') && !item.image.includes('localhost')
        ? [item.image]
        : undefined;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.name,
            images: validImage,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      };
    });

    const host = req.headers.host || 'tsrskinandhaircare.com';
    const protocol = host.includes('localhost') ? 'http' : 'https';
    const origin = `${protocol}://${host}`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      payment_intent_data: {
        description: items.map((i: any) => i.name).join(', '),
      },
      success_url: `${origin}/success`,
      cancel_url: `${origin}/checkout`,
    });

    res.status(200).json({ url: session.url });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

// ─── 11. SEND CONTACT MESSAGE ──────────────────────────────────────────────
async function handleSendContactMessage(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const contactData = req.body;
    const result = await db.collection("contact_messages").insertOne({
      ...contactData,
      createdAt: new Date().toISOString()
    });

    try {
      await sendContactFormEmail(contactData);
    } catch (emailError) {
      console.error('[Email Notification Error] Failed to forward contact message:', emailError);
    }

    res.status(200).json({ success: true, insertedId: result.insertedId });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

async function handleGetContactMessages(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const messages = await db.collection("contact_messages").find({}).sort({ createdAt: -1 }).toArray();
    res.status(200).json({ success: true, messages });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

async function handleDeleteContactMessage(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, error: 'Missing message ID' });

    const result = await db.collection("contact_messages").deleteOne({
      _id: new ObjectId(id)
    });
    res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

async function handleChatStart(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const { customerName, customerEmail } = req.body;
    if (!customerName || !customerEmail) {
      return res.status(400).json({ success: false, error: 'Missing name or email' });
    }

    const chatId = `chat-${Math.floor(100000 + Math.random() * 900000)}`;
    const newChat = {
      id: chatId,
      customerName,
      customerEmail,
      lastMessage: "Consultation started",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      unread: true,
      messages: [
        {
          sender: "admin",
          text: `Hello ${customerName}! Welcome to TSR Skin & Hair Care. How can we support your self-care ritual today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    await db.collection("chats").insertOne(newChat);
    res.status(200).json({ success: true, chat: newChat });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

async function handleChatGet(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const parsedUrl = url.parse(req.url, true);
    const id = parsedUrl.query.id as string;
    if (!id) return res.status(400).json({ success: false, error: 'Missing chat ID' });

    const chat = await db.collection("chats").findOne({ id });
    if (!chat) return res.status(404).json({ success: false, error: 'Chat not found' });

    res.status(200).json({ success: true, chat });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

async function handleChatSend(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const { chatId, sender, text } = req.body;
    if (!chatId || !sender || !text) {
      return res.status(400).json({ success: false, error: 'Missing parameters' });
    }

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = { sender, text, timestamp };

    const updateDoc: any = {
      $push: { messages: newMessage },
      $set: { 
        lastMessage: text,
        timestamp: timestamp
      }
    };

    if (sender === 'customer') {
      updateDoc.$set.unread = true;
    }

    await db.collection("chats").updateOne(
      { id: chatId },
      updateDoc
    );

    res.status(200).json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

async function handleChatList(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const chats = await db.collection("chats").find({}).toArray();
    res.status(200).json({ success: true, chats });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

async function handleChatRead(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const { chatId } = req.body;
    await db.collection("chats").updateOne(
      { id: chatId },
      { $set: { unread: false } }
    );
    res.status(200).json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

async function handleDeleteOrder(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const { id } = req.body;
    if (!id) return res.status(400).json({ success: false, error: 'Missing order id' });
    const result = await db.collection("orders").deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.status(200).json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

async function handleIncrementVisitors(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    await db.collection("visitors").updateOne(
      { id: "stats" },
      { $inc: { count: 1 } },
      { upsert: true }
    );
    res.status(200).json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

async function handleGetVisitorsCount(req: any, res: any) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection("visitors").findOne({ id: "stats" });
    const count = doc ? doc.count : 0;
    res.status(200).json({ success: true, count });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── 12. ADMIN LOGIN ───────────────────────────────────────────────────────
async function handleAdminLogin(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const { username, password } = req.body;

    let user = await db.collection("admin_user").findOne({ username });
    if (!user) {
      const count = await db.collection("admin_user").countDocuments();
      if (count === 0 && username === 'tsr_admin') {
        const hashedPassword = hashPassword('tsr123456');
        await db.collection("admin_user").insertOne({
          username: 'tsr_admin',
          password: hashedPassword
        });
        user = { username: 'tsr_admin', password: hashedPassword } as any;
      }
    }

    if (user) {
      const hashedInput = hashPassword(password);
      let isValid = false;

      if (user.password === hashedInput) {
        isValid = true;
      } else if (user.password === password) {
        isValid = true;
        await db.collection("admin_user").updateOne(
          { _id: user._id },
          { $set: { password: hashedInput } }
        );
      }

      if (isValid) {
        res.status(200).json({ success: true, token: 'tsr_admin_session_token' });
      } else {
        res.status(401).json({ success: false, error: 'Invalid username or password' });
      }
    } else {
      res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── 13. ADMIN CHANGE PASSWORD ─────────────────────────────────────────────
async function handleAdminChangePassword(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });
  try {
    const { db } = await connectToDatabase();
    const { currentPassword, newPassword } = req.body;

    const user = await db.collection("admin_user").findOne({ username: 'tsr_admin' });
    const hashedDefault = hashPassword('tsr123456');
    const finalUser = user || { password: hashedDefault };

    const hashedCurrentInput = hashPassword(currentPassword);
    let isValid = false;

    if (finalUser.password === hashedCurrentInput) {
      isValid = true;
    } else if (finalUser.password === currentPassword) {
      isValid = true;
    }

    if (isValid) {
      const hashedNew = hashPassword(newPassword);
      const result = await db.collection("admin_user").updateOne(
        { username: 'tsr_admin' },
        { $set: { password: hashedNew } },
        { upsert: true }
      );
      res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
    } else {
      res.status(400).json({ success: false, error: 'Incorrect current password' });
    }
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}

// ─── MAIN GATEWAY ROUTER HANDLER ────────────────────────────────────────────
export default async function handler(req: any, res: any) {
  // Parse Vercel system header containing the original matched path before the rewrite
  const matchedPath = req.headers['x-matched-path'] as string;

  let pathname = '';
  if (matchedPath) {
    pathname = url.parse(matchedPath).pathname || '';
  } else {
    pathname = url.parse(req.url || '', true).pathname || '';
  }

  const cleanPath = pathname.replace(/\/$/, '');

  console.log(`[Vercel API Router] Route: ${cleanPath} | Vercel Matched: ${matchedPath || 'None'} | Method: ${req.method}`);

  try {
    switch (cleanPath) {
      case '/api/cloudinary-signature':
        return await handleGetCloudinarySignature(req, res);
      case '/api/get-products':
        return await handleGetProducts(req, res);
      case '/api/create-product':
        return await handleCreateProduct(req, res);
      case '/api/update-product':
        return await handleUpdateProduct(req, res);
      case '/api/delete-product':
        return await handleDeleteProduct(req, res);
      case '/api/get-customers':
        return await handleGetCustomers(req, res);
      case '/api/create-customer':
        return await handleCreateCustomer(req, res);
      case '/api/get-orders':
        return await handleGetOrders(req, res);
      case '/api/create-order':
        return await handleCreateOrder(req, res);
      case '/api/update-order-status':
        return await handleUpdateOrderStatus(req, res);
      case '/api/create-checkout-session':
        return await handleCreateCheckoutSession(req, res);
      case '/api/send-contact-message':
        return await handleSendContactMessage(req, res);
      case '/api/get-contact-messages':
        return await handleGetContactMessages(req, res);
      case '/api/delete-contact-message':
        return await handleDeleteContactMessage(req, res);
      case '/api/chat/start':
        return await handleChatStart(req, res);
      case '/api/chat/get':
        return await handleChatGet(req, res);
      case '/api/chat/send':
        return await handleChatSend(req, res);
      case '/api/chat/list':
        return await handleChatList(req, res);
      case '/api/chat/read':
        return await handleChatRead(req, res);
      case '/api/delete-order':
        return await handleDeleteOrder(req, res);
      case '/api/visitors/increment':
        return await handleIncrementVisitors(req, res);
      case '/api/visitors/count':
        return await handleGetVisitorsCount(req, res);
      case '/api/admin/login':
        return await handleAdminLogin(req, res);
      case '/api/admin/change-password':
        return await handleAdminChangePassword(req, res);
      default:
        res.status(404).json({ success: false, error: `Route ${cleanPath} not found` });
    }
  } catch (err: any) {
    console.error(`[Vercel API Router Error] ${cleanPath}:`, err);
    res.status(500).json({ success: false, error: err.message });
  }
}
