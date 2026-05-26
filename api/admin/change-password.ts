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
    const { currentPassword, newPassword } = req.body;
    
    const user = await db.collection("admin_user").findOne({ username: 'tsr_admin' });
    
    // Seed default configuration if somehow missing
    const finalUser = user || { password: 'tsr123456' };

    if (finalUser.password === currentPassword) {
      const result = await db.collection("admin_user").updateOne(
        { username: 'tsr_admin' },
        { $set: { password: newPassword } },
        { upsert: true }
      );
      res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
    } else {
      res.status(400).json({ success: false, error: 'Incorrect current password' });
    }
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  } finally {
    await client.close();
  }
}
