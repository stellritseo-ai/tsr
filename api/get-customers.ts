import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await client.connect();
    const db = client.db("tsr-commerce");
    const customers = await db.collection("customers").find({}).toArray();
    res.status(200).json(customers);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  } finally {
    await client.close();
  }
}
