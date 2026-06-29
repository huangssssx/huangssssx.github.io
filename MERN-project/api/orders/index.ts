import type { Request, Response } from 'express';
import dbConnect from '../_lib/db.js';
import Order from '../_lib/models/Order.js';
import { requireAuth } from '../_lib/auth.js';

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
        filter.$or = [
          { orderNumber: { $regex: search, $options: 'i' } },
          { 'customerInfo.name': { $regex: search, $options: 'i' } },
        ];
      }
      if (status && ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        filter.status = status;
      }

      const total = await Order.countDocuments(filter);
      const orders = await Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      return res.status(200).json({
        orders,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    }

    if (req.method === 'POST') {
      const { customerInfo, items, shippingAddress } = req.body;

      if (!customerInfo?.name?.trim()) {
        return res.status(400).json({ error: 'Customer name is required' });
      }
      if (!customerInfo?.email?.trim()) {
        return res.status(400).json({ error: 'Customer email is required' });
      }
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'At least one item is required' });
      }

      const totalAmount = items.reduce((sum: number, item: any) => sum + (item.quantity * item.price), 0);

      const order = await Order.create({
        orderNumber: `ORD-${Date.now()}`,
        customerInfo: {
          name: customerInfo.name.trim(),
          email: customerInfo.email.trim().toLowerCase(),
          phone: customerInfo.phone || '',
        },
        items,
        totalAmount,
        shippingAddress: shippingAddress || {},
        owner: payload.userId,
      });

      return res.status(201).json({ order });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    if (err.message === 'No token provided') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
