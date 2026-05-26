import { connectToDatabase } from '../_utils/mongodb';
import { sendOrderEmail, sendCustomerConfirmationEmail } from '../_utils/email';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const order = req.body;
    
    const result = await db.collection("orders").insertOne(order);

    // Send merchant notification email
    try {
      await sendOrderEmail(order);
    } catch (emailError) {
      console.error('[Email Notification Error] Failed to send merchant notification:', emailError);
    }

    // Send customer order confirmation email
    try {
      await sendCustomerConfirmationEmail(order);
    } catch (emailError) {
      console.error('[Email Notification Error] Failed to send customer confirmation:', emailError);
    }

    res.status(200).json({ success: true, orderId: result.insertedId });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}
