import { connectToDatabase } from '../../_utils/mongodb';
import crypto from 'crypto';

function hashPassword(password: string): string {
  const salt = 'tsr_secret_salt_2026';
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    const { currentPassword, newPassword } = req.body;
    
    const user = await db.collection("admin_user").findOne({ username: 'tsr_admin' });
    
    // Seed default configuration if somehow missing
    const hashedDefault = hashPassword('tsr123456');
    const finalUser = user || { password: hashedDefault };

    const hashedCurrentInput = hashPassword(currentPassword);
    let isValid = false;

    if (finalUser.password === hashedCurrentInput) {
      isValid = true;
    } else if (finalUser.password === currentPassword) {
      // Plain-text fallback validation for backward-compatibility
      isValid = true;
    }

    if (isValid) {
      const hashedNew = hashPassword(newPassword);
      const result = await db.collection("admin_user").updateOne(
        { username: 'tsr_admin' },
        { $set: { password: hashedNew } },
        { upsert: true }
      );
      res.status(200).json({ success: true, modifiedCount: result.modifiedCount });
    } else {
      res.status(400).json({ success: false, error: 'Incorrect current password' });
    }
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}
