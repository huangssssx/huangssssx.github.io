import type { Request, Response } from 'express';
import dbConnect from '../_lib/db.js';
import User from '../_lib/models/User.js';
import { signToken } from '../_lib/auth.js';

export default async function handler(req: Request, res: Response) {
  console.log('[login] handler called, method:', req.method);
  console.log('[login] MONGODB_URI:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 30) + '...' : 'UNDEFINED');
  console.log('[login] JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'UNDEFINED');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[login] calling dbConnect...');
    await dbConnect();
    console.log('[login] dbConnect done');

    const { email, password } = req.body;
    console.log('[login] email:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('[login] user found:', !!user);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    console.log('[login] password match:', isMatch);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken({ userId: user._id.toString(), email: user.email });

    console.log('[login] success');
    return res.status(200).json({
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err: any) {
    console.error('[login] error:', err.message);
    return res.status(500).json({ error: err.message || 'Login failed' });
  }
}
