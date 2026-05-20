import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  
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
