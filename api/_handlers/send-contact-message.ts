import { MongoClient } from 'mongodb';
import { sendContactFormEmail } from '../_utils/email';

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await client.connect();
    const db = client.db("tsr-commerce");
    const contactData = req.body;
    
    // Save message to database
    const result = await db.collection("contact_messages").insertOne({
      ...contactData,
      createdAt: new Date().toISOString()
    });

    // Send email alert to store merchant
    try {
      await sendContactFormEmail(contactData);
    } catch (emailError) {
      console.error('[Email Notification Error] Failed to forward contact message:', emailError);
    }

    res.status(200).json({ success: true, insertedId: result.insertedId });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  } finally {
    await client.close();
  }
}
