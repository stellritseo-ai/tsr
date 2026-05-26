import { connectToDatabase } from '../_utils/mongodb';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const customers = await db.collection("customers").find({}).toArray();
    res.status(200).json(customers);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}
