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
    const { username, password } = req.body;
    
    let user = await db.collection("admin_user").findOne({ username });
    if (!user) {
      const count = await db.collection("admin_user").countDocuments();
      if (count === 0 && username === 'tsr_admin') {
        // Seed default credentials
        await db.collection("admin_user").insertOne({
          username: 'tsr_admin',
          password: 'tsr123456'
        });
        user = { username: 'tsr_admin', password: 'tsr123456' } as any;
      }
    }

    if (user && user.password === password) {
      res.status(200).json({ success: true, token: 'tsr_admin_session_token' });
    } else {
      res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  } finally {
    await client.close();
  }
}
