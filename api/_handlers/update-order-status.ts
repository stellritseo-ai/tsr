import { connectToDatabase } from '../_utils/mongodb';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const { orderId, status } = req.body;
    
    const result = await db.collection("orders").updateOne(
      { id: orderId },
      { $set: { status } }
    );

    res.status(200).json({ success: true, updatedCount: result.modifiedCount });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}
