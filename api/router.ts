import url from 'url';
import crypto from 'crypto';
import Stripe from 'stripe';
import { connectToDatabase } from './_utils/mongodb.ts';
import { sendOrderEmail, sendCustomerConfirmationEmail, sendContactFormEmail } from './_utils/email.ts';

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
    let productsList = await db.collection("products").find({}).toArray();

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
