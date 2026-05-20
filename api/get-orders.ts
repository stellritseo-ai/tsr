import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

export default async function handler(req: any, res: any) {
  try {
    await client.connect();
    const db = client.db("tsr-commerce");
    const orders = await db.collection("orders").find({}).sort({ _id: -1 }).toArray();
    res.status(200).json(orders);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}
