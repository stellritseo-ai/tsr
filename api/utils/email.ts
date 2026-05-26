import nodemailer from 'nodemailer';
import { Order } from '../../src/types/order';

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
              ${
                item.image
                  ? `<td style="padding-right: 20px; vertical-align: top; width: 80px;">
                      <img src="${item.image}" alt="${item.name}" width="72" height="72" style="border-radius: 10px; object-fit: cover; border: 1px solid #EAE6DF; display: block;" />
                     </td>`
                  : ''
              }
              <td style="vertical-align: top;">
                <div style="font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #C5A880; margin-bottom: 4px;">Product Name</div>
                ${
                  item.link
                    ? `<a href="${item.link}" style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 600; color: #1C1B19; text-decoration: underline; text-underline-offset: 3px;">${item.name}</a>`
                    : `<div style="font-family: 'Playfair Display', Georgia, serif; font-size: 16px; font-weight: 600; color: #1C1B19;">${item.name}</div>`
                }
                ${
                  item.link
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
              ${
                item.image
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
                        <a href="${order.items[0]?.link?.replace('/products', '') || 'https://tsrskincare.com'}/products"
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
                    Questions? Contact us at <a href="mailto:support@tsrskincare.com" style="color: #C5A880; text-decoration: none;">support@tsrskincare.com</a> or call <strong>407-694-8624</strong>
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

  const resendApiKey  = getEnv('RESEND_API_KEY');
  const customerEmail = order.email;

  if (!customerEmail) {
    console.warn('[TSR Email] No customer email on order — skipping customer confirmation.');
    return false;
  }

  const subject = `✅ Order Confirmed — ${order.id} | TSR Skin & Hair Care`;
  const html    = generateCustomerConfirmationEmailHtml(order);

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
          to:   customerEmail,
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
        host:   smtpHost,
        port:   smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      const info = await transporter.sendMail({
        from:    smtpFrom,
        to:      customerEmail,
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
    const transporter  = nodemailer.createTransport({
      host:   'smtp.ethereal.email',
      port:   587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await transporter.sendMail({
      from:    `"TSR Skin & Hair Care" <${testAccount.user}>`,
      to:      customerEmail,
      subject,
      html,
    });

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
 *
 * Priority of email transports:
 *   1. Resend API  — if RESEND_API_KEY is set
 *   2. SMTP        — if SMTP_USER + SMTP_PASS are set
 *   3. Ethereal    — automatic dev-mode fallback (no credentials needed!)
 *                    generates a live preview URL you can open in your browser.
 */
export async function sendOrderEmail(order: Order, envOverrides?: Record<string, string>): Promise<boolean> {
  const getEnv = (key: string): string => {
    return (envOverrides && envOverrides[key]) || process.env[key] || '';
  };

  const merchantEmail = getEnv('MERCHANT_EMAIL') || 'jitensony@gmail.com';
  const resendApiKey  = getEnv('RESEND_API_KEY');

  const subject = `✨ New Ritual Order ${order.id} Placed — $${order.total.toFixed(2)}`;
  const html    = generateOrderEmailHtml(order);

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
          to:   merchantEmail,
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
            to:   order.email,
            subject: customerSubject,
            html: customerHtml,
          }),
        });

        const customerData = await customerResponse.json() as { id?: string; message?: string; name?: string };
        if (customerResponse.ok) {
          console.log(`✅ [TSR Email] Customer confirmation delivered via Resend. Email ID: ${customerData.id}`);
        } else {
          console.error(`❌ [TSR Email] Resend rejected customer email to ${order.email}:`, JSON.stringify(customerData));
          console.error('   ↳ If you see "You can only send testing emails to your own email address",');
          console.error('     go to resend.com → Domains → verify your domain, then update SMTP_FROM in .env');
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
        host:   smtpHost,
        port:   smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from:    smtpFrom,
        to:      merchantEmail,
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
  // No credentials required. Ethereal creates a free throw-away account and
  // returns a preview URL you can open in your browser to see the rendered email.
  console.log('[TSR Email] No production transport configured — using Ethereal preview (dev mode)...');
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter  = nodemailer.createTransport({
      host:   'smtp.ethereal.email',
      port:   587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from:    `"TSR Skin & Hair Care" <${testAccount.user}>`,
      to:      merchantEmail,
      subject,
      html,
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('');
    console.log('┌──────────────────────────────────────────────────────────────────┐');
    console.log('│  📬  TSR Skin & Hair Care — Order Email Preview (Dev Mode / Ethereal)  │');
    console.log('│                                                                  │');
    console.log(`│  Order  : ${order.id.padEnd(56)}│`);
    console.log(`│  To     : ${merchantEmail.padEnd(56)}│`);
    console.log('│                                                                  │');
    console.log('│  ✅ Open this link in your browser to see the full email:        │');
    console.log(`│  ${String(previewUrl).padEnd(66)}│`);
    console.log('│                                                                  │');
    console.log('│  To send REAL emails, add one of these to your .env file:        │');
    console.log('│    • RESEND_API_KEY=re_...   (resend.com — free tier)            │');
    console.log('│    • SMTP_HOST / SMTP_USER / SMTP_PASS  (Gmail App Password)     │');
    console.log('└──────────────────────────────────────────────────────────────────┘');
    console.log('');

    return true;
  } catch (etherealErr) {
    console.error('[TSR Email] Ethereal preview also failed:', etherealErr);
  }

  return false;
}
