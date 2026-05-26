import { MongoClient, Db } from 'mongodb';

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
