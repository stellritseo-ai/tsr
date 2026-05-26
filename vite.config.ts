import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import crypto from "crypto";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
  function hashPassword(password: string): string {
    const salt = 'tsr_secret_salt_2026';
    return crypto.createHash('sha256').update(password + salt).digest('hex');
  }
  
  return {
    plugins: [
      TanStackRouterVite(),
      react(),
      tailwindcss(),
      tsconfigPaths(),
      {
        name: 'api-middleware',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/api/')) {
              const { MongoClient } = await import('mongodb');
              const client = new MongoClient(env.MONGODB_URI || '');
              
              try {
                await client.connect();
                const db = client.db("tsr-commerce");
                
                if (req.url === '/api/create-order' && req.method === 'POST') {
                  let body = '';
                  req.on('data', chunk => { body += chunk; });
                  req.on('end', async () => {
                    try {
                      const order = JSON.parse(body);
                      const result = await db.collection("orders").insertOne(order);

                      // Send email notification to merchant (swallowing any errors to prevent blocking successful checkouts)
                      try {
                        const { sendOrderEmail } = await import('./api/utils/email');
                        await sendOrderEmail(order, env);
                      } catch (emailError) {
                        console.error('[Email Notification Error] Failed to send merchant notification:', emailError);
                      }

                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: true, orderId: result.insertedId }));
                    } catch (err) {
                      res.statusCode = 500;
                      res.end(JSON.stringify({ success: false, error: 'JSON parse error' }));
                    } finally {
                      await client.close();
                    }
                  });
                  return;
                }
                
                if (req.url === '/api/get-orders' && req.method === 'GET') {
                  const orders = await db.collection("orders").find({}).sort({ _id: -1 }).toArray();
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(orders));
                  await client.close();
                  return;
                }

                if (req.url === '/api/update-order-status' && req.method === 'POST') {
                  let body = '';
                  req.on('data', chunk => { body += chunk; });
                  req.on('end', async () => {
                    try {
                      const { orderId, status } = JSON.parse(body);
                      const result = await db.collection("orders").updateOne(
                        { id: orderId },
                        { $set: { status } }
                      );
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: true, updatedCount: result.modifiedCount }));
                    } catch (err: any) {
                      res.statusCode = 500;
                      res.end(JSON.stringify({ success: false, error: err.message }));
                    } finally {
                      await client.close();
                    }
                  });
                  return;
                }

                if (req.url === '/api/get-products' && req.method === 'GET') {
                  try {
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
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(productsList));
                  } catch (err: any) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ success: false, error: err.message }));
                  } finally {
                    await client.close();
                  }
                  return;
                }

                if (req.url === '/api/create-product' && req.method === 'POST') {
                  let body = '';
                  req.on('data', chunk => { body += chunk; });
                  req.on('end', async () => {
                    try {
                      const product = JSON.parse(body);
                      const result = await db.collection("products").insertOne(product);
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: true, insertedId: result.insertedId }));
                    } catch (err: any) {
                      res.statusCode = 500;
                      res.end(JSON.stringify({ success: false, error: err.message }));
                    } finally {
                      await client.close();
                    }
                  });
                  return;
                }

                if (req.url === '/api/update-product' && req.method === 'POST') {
                  let body = '';
                  req.on('data', chunk => { body += chunk; });
                  req.on('end', async () => {
                    try {
                      const product = JSON.parse(body);
                      const { id, ...updateFields } = product;
                      const result = await db.collection("products").updateOne(
                        { id: id },
                        { $set: updateFields }
                      );
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: true, updatedCount: result.modifiedCount }));
                    } catch (err: any) {
                      res.statusCode = 500;
                      res.end(JSON.stringify({ success: false, error: err.message }));
                    } finally {
                      await client.close();
                    }
                  });
                  return;
                }

                if (req.url === '/api/delete-product' && req.method === 'POST') {
                  let body = '';
                  req.on('data', chunk => { body += chunk; });
                  req.on('end', async () => {
                    try {
                      const { productId } = JSON.parse(body);
                      const result = await db.collection("products").deleteOne({ id: productId });
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: true, deletedCount: result.deletedCount }));
                    } catch (err: any) {
                      res.statusCode = 500;
                      res.end(JSON.stringify({ success: false, error: err.message }));
                    } finally {
                      await client.close();
                    }
                  });
                  return;
                }

                if (req.url === '/api/get-customers' && req.method === 'GET') {
                  try {
                    const customers = await db.collection("customers").find({}).toArray();
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(customers));
                  } catch (err: any) {
                    res.statusCode = 500;
                    res.end(JSON.stringify({ success: false, error: err.message }));
                  } finally {
                    await client.close();
                  }
                  return;
                }

                if (req.url === '/api/create-customer' && req.method === 'POST') {
                  let body = '';
                  req.on('data', chunk => { body += chunk; });
                  req.on('end', async () => {
                    try {
                      const customer = JSON.parse(body);
                      const result = await db.collection("customers").insertOne(customer);
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: true, insertedId: result.insertedId }));
                    } catch (err: any) {
                      res.statusCode = 500;
                      res.end(JSON.stringify({ success: false, error: err.message }));
                    } finally {
                      await client.close();
                    }
                  });
                  return;
                }
                
                if (req.url === '/api/create-checkout-session' && req.method === 'POST') {
                  let body = '';
                  req.on('data', chunk => { body += chunk; });
                  req.on('end', async () => {
                    try {
                      const { items } = JSON.parse(body);
                      const Stripe = (await import('stripe')).default;
                      // Use environment variable or fallback to a dummy key to prevent crashes
                      const stripe = new Stripe(env.STRIPE_SECRET_KEY || 'sk_test_51O1dummy', {
                        apiVersion: '2025-02-24.acacia' as any,
                      });

                      const lineItems = items.map((item: any) => {
                        // Stripe requires valid, public HTTP(S) URLs. Localhost or relative paths will fail.
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

                      const protocol = req.headers.host?.includes('localhost') ? 'http' : 'https';
                      const origin = `${protocol}://${req.headers.host}`;

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

                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ url: session.url }));
                    } catch (err: any) {
                      res.statusCode = 500;
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: false, error: err.message }));
                    } finally {
                      await client.close();
                    }
                  });
                  return;
                }

                if (req.url === '/api/admin/login' && req.method === 'POST') {
                  let body = '';
                  req.on('data', chunk => { body += chunk; });
                  req.on('end', async () => {
                    try {
                      const { username, password } = JSON.parse(body);
                      
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
                          // Backward-compatible plain text check: auto-upgrade to secure hash
                          isValid = true;
                          await db.collection("admin_user").updateOne(
                            { _id: user._id },
                            { $set: { password: hashedInput } }
                          );
                        }

                        if (isValid) {
                          res.setHeader('Content-Type', 'application/json');
                          res.end(JSON.stringify({ success: true, token: 'tsr_admin_session_token' }));
                        } else {
                          res.statusCode = 401;
                          res.setHeader('Content-Type', 'application/json');
                          res.end(JSON.stringify({ success: false, error: 'Invalid username or password' }));
                        }
                      } else {
                        res.statusCode = 401;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ success: false, error: 'Invalid username or password' }));
                      }
                    } catch (err: any) {
                      res.statusCode = 500;
                      res.end(JSON.stringify({ success: false, error: err.message }));
                    } finally {
                      await client.close();
                    }
                  });
                  return;
                }

                if (req.url === '/api/admin/change-password' && req.method === 'POST') {
                  let body = '';
                  req.on('data', chunk => { body += chunk; });
                  req.on('end', async () => {
                    try {
                       const { currentPassword, newPassword } = JSON.parse(body);
                       const user = await db.collection("admin_user").findOne({ username: 'tsr_admin' });
                       
                       const hashedDefault = hashPassword('tsr123456');
                       const finalUser = user || { password: hashedDefault };

                       const hashedCurrentInput = hashPassword(currentPassword);
                       let isValid = false;

                       if (finalUser.password === hashedCurrentInput) {
                         isValid = true;
                       } else if (finalUser.password === currentPassword) {
                         // Plain-text validation fallback for backward-compatibility
                         isValid = true;
                       }

                       if (isValid) {
                         const hashedNew = hashPassword(newPassword);
                         const result = await db.collection("admin_user").updateOne(
                           { username: 'tsr_admin' },
                           { $set: { password: hashedNew } },
                           { upsert: true }
                         );
                         res.setHeader('Content-Type', 'application/json');
                         res.end(JSON.stringify({ success: true, modifiedCount: result.modifiedCount }));
                       } else {
                         res.statusCode = 400;
                         res.setHeader('Content-Type', 'application/json');
                         res.end(JSON.stringify({ success: false, error: 'Incorrect current password' }));
                       }
                    } catch (err: any) {
                      res.statusCode = 500;
                      res.end(JSON.stringify({ success: false, error: err.message }));
                    } finally {
                      await client.close();
                    }
                  });
                  return;
                }

                if (req.url === '/api/send-contact-message' && req.method === 'POST') {
                  let body = '';
                  req.on('data', chunk => { body += chunk; });
                  req.on('end', async () => {
                    try {
                      const contactData = JSON.parse(body);
                      
                      const result = await db.collection("contact_messages").insertOne({
                        ...contactData,
                        createdAt: new Date().toISOString()
                      });

                      try {
                        const { sendContactFormEmail } = await import('./api/utils/email');
                        await sendContactFormEmail(contactData, env);
                      } catch (emailError) {
                        console.error('[Email Notification Error] Failed to forward contact message:', emailError);
                      }

                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: true, insertedId: result.insertedId }));
                    } catch (err: any) {
                      res.statusCode = 500;
                      res.end(JSON.stringify({ success: false, error: err.message }));
                    } finally {
                      await client.close();
                    }
                  });
                  return;
                }
              } catch (e: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: e.message }));
                await client.close();
                return;
              }
            }
            next();
          });
        }
      }
    ],
  };
});
