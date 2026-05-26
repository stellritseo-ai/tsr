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
    const { username, password } = req.body;
    
    let user = await db.collection("admin_user").findOne({ username });
    if (!user) {
      const count = await db.collection("admin_user").countDocuments();
      if (count === 0 && username === 'tsr_admin') {
        const hashedPassword = hashPassword('tsr123456');
        // Seed default credentials as a secure hash
        await db.collection("admin_user").insertOne({
          username: 'tsr_admin',
          password: hashedPassword
        });
        user = { username: 'tsr_admin', password: hashedPassword } as any;
      }
    }

    if (user) {
      const hashedInput = hashPassword(password);
      let isValid = false;

      if (user.password === hashedInput) {
        isValid = true;
      } else if (user.password === password) {
        // Backward-compatible plain text check: auto-upgrade to secure hash
        isValid = true;
        await db.collection("admin_user").updateOne(
          { _id: user._id },
          { $set: { password: hashedInput } }
        );
        console.log(`[TSR Admin] Automatically upgraded plain-text credentials for ${username} to secure hash.`);
      }

      if (isValid) {
        res.status(200).json({ success: true, token: 'tsr_admin_session_token' });
      } else {
        res.status(401).json({ success: false, error: 'Invalid username or password' });
      }
    } else {
      res.status(401).json({ success: false, error: 'Invalid username or password' });
    }
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
}
