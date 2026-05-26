import { connectToDatabase } from '../_utils/mongodb';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const { productId } = req.body;
    
    const result = await db.collection("products").deleteOne({ id: productId });

    res.status(200).json({ success: true, deletedCount: result.deletedCount });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}
