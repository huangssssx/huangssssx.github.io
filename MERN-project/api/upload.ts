import type { Request, Response } from 'express';
import { requireAuth } from './_lib/auth.js';
import { upload, uploadToCloudinary } from './_lib/middleware/upload.js';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    requireAuth(req);
    await new Promise<void>((resolve, reject) => {
      upload.single('file')(req, res, (err) => (err ? reject(err) : resolve()));
    });
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    const url = await uploadToCloudinary(req.file.buffer, 'products');
    return res.status(200).json({ url });
  } catch (err: any) {
    if (err.message === 'No token provided') return res.status(401).json({ error: 'Authentication required' });
    return res.status(500).json({ error: err.message || 'Upload failed' });
  }
}
