import type { Request, Response } from 'express';
import dbConnect from '../_lib/db.js';
import Order from '../_lib/models/Order.js';
import { requireAuth } from '../_lib/auth.js';

export default async function handler(req: Request, res: Response) {
  try {
    const payload = requireAuth(req);
    await dbConnect();

    const { id } = req.params;

    if (req.method === 'GET') {
      const order = await Order.findOne({ _id: id, owner: payload.userId });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.status(200).json({ order });
    }

    if (req.method === 'PUT') {
      const { status, paymentStatus } = req.body;

      const order = await Order.findOne({ _id: id, owner: payload.userId });
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      if (status !== undefined && ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
        order.status = status;
      }
      if (paymentStatus !== undefined && ['unpaid', 'paid', 'refunded'].includes(paymentStatus)) {
        order.paymentStatus = paymentStatus;
      }

      await order.save();
      return res.status(200).json({ order });
    }

    if (req.method === 'DELETE') {
      const order = await Order.findOneAndUpdate(
        { _id: id, owner: payload.userId },
        { status: 'cancelled' },
        { new: true }
      );
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      return res.status(200).json({ message: 'Order cancelled' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    if (err.message === 'No token provided') {
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.status(500).json({ error: err.message || 'Server error' });
  }
}
