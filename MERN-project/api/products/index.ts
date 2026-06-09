import type { Request, Response } from 'express';
import dbConnect from '../_lib/db.js';
import Product from '../_lib/models/Product.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    const payload = requireAuth(req);
    await dbConnect();

    if (req.method === 'GET') {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const search = (req.query.search as string) || '';
      const category = (req.query.category as string) || '';
      const status = req.query.status as string;

      const filter: any = { owner: payload.userId };
      if (search) {
        filter.name = { $regex: search, $options: 'i' };
      }
      if (category) {
        filter.category = { $regex: `^${category}$`, $options: 'i' };
      }
      if (status && ['active', 'draft', 'archived'].includes(status)) {
        filter.status = status;
      }

      const total = await Product.countDocuments(filter);
      const products = await Product.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.status(200).json({
        products,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    if (req.method === 'POST') {
      const { name, description, price, category, stock, images, status } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Product name is required' });
      }
      if (price === undefined || price < 0) {
        return res.status(400).json({ error: 'Valid price is required' });
      }

      const product = await Product.create({
        name: name.trim(),
        description: description || '',
        price,
        category: category || 'uncategorized',
        stock: stock || 0,
        images: images || [],
        status: status || 'active',
        owner: payload.userId,
      });

      return res.status(201).json({ product });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    if (err.message === 'No token provided') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
