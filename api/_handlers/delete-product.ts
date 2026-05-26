import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await client.connect();
    const db = client.db("tsr-commerce");
    const { productId } = req.body;
    
    const result = await db.collection("products").deleteOne({ id: productId });

    res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  } finally {
    await client.close();
  }
}
