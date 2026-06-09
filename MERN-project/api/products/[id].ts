import type { Request, Response } from 'express';
import dbConnect from '../_lib/db.js';
import Product from '../_lib/models/Product.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    const payload = requireAuth(req);
    await dbConnect();

    const { id } = req.params;

    if (req.method === 'GET') {
      const product = await Product.findOne({ _id: id, owner: payload.userId });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json({ product });
    }

    if (req.method === 'PUT') {
      const { name, description, price, category, stock, images, status } = req.body;

      const product = await Product.findOne({ _id: id, owner: payload.userId });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      if (name !== undefined) product.name = name.trim();
      if (description !== undefined) product.description = description;
      if (price !== undefined && price >= 0) product.price = price;
      if (category !== undefined) product.category = category;
      if (stock !== undefined && stock >= 0) product.stock = stock;
      if (images !== undefined) product.images = images;
      if (status !== undefined && ['active', 'draft', 'archived'].includes(status)) {
        product.status = status;
      }

      await product.save();
      return res.status(200).json({ product });
    }

    if (req.method === 'DELETE') {
      const product = await Product.findOneAndDelete({ _id: id, owner: payload.userId });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      return res.status(200).json({ message: 'Product deleted' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    if (err.message === 'No token provided') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
