import type { Request, Response } from 'express';
import dbConnect from '../_lib/db';
import Item from '../_lib/models/Item';
import { requireAuth } from '../_lib/auth';

export default async function handler(req: Request, res: Response) {
  try {
    const payload = requireAuth(req);
    await dbConnect();

    if (req.method === 'GET') {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const search = (req.query.search as string) || '';
      const status = req.query.status as string;

      const filter: any = { owner: payload.userId };
      if (search) {
        filter.title = { $regex: search, $options: 'i' };
      }
      if (status && ['active', 'archived', 'draft'].includes(status)) {
        filter.status = status;
      }

      const total = await Item.countDocuments(filter);
      const items = await Item.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.status(200).json({
        items,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    if (req.method === 'POST') {
      const { title, description, status } = req.body;

      if (!title || !title.trim()) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const item = await Item.create({
        title: title.trim(),
        description: description || '',
        status: status || 'active',
        owner: payload.userId,
      });

      return res.status(201).json({ item });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    if (err.message === 'No token provided') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
