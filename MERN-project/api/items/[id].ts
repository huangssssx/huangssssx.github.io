import type { Request, Response } from 'express';
import dbConnect from '../_lib/db.js';
import Item from '../_lib/models/Item.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    const payload = requireAuth(req);
    await dbConnect();

    const { id } = req.params;

    if (req.method === 'GET') {
      const item = await Item.findOne({ _id: id, owner: payload.userId });
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      return res.status(200).json({ item });
    }

    if (req.method === 'PUT') {
      const { title, description, status } = req.body;

      const item = await Item.findOne({ _id: id, owner: payload.userId });
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      if (title !== undefined) item.title = title.trim();
      if (description !== undefined) item.description = description;
      if (status !== undefined && ['active', 'archived', 'draft'].includes(status)) {
        item.status = status;
      }

      await item.save();
      return res.status(200).json({ item });
    }

    if (req.method === 'DELETE') {
      const item = await Item.findOneAndDelete({ _id: id, owner: payload.userId });
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
      return res.status(200).json({ message: 'Item deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    if (err.message === 'No token provided') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
