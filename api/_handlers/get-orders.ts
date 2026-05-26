import { connectToDatabase } from '../_utils/mongodb';

export default async function handler(req: any, res: any) {
  try {
    const { db } = await connectToDatabase();
    const orders = await db.collection("orders").find({}).sort({ _id: -1 }).toArray();
    res.status(200).json(orders);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}
