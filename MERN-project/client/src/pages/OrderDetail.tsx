import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchOrder, updateOrderStatus, cancelOrder } from '../services/orders';
import { useToast } from '../components/Toast';
import type { Order } from '../types';

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400 shadow-amber-400/50' },
  processing: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400 shadow-blue-400/50' },
  shipped: { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400 shadow-purple-400/50' },
  delivered: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400 shadow-emerald-400/50' },
  cancelled: { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400 shadow-red-400/50' },
};

const paymentConfig: Record<string, { bg: string; text: string }> = {
  unpaid: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  paid: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  refunded: { bg: 'bg-red-500/10', text: 'text-red-400' },
};

const nextStatusMap: Record<string, string> = {
  pending: 'processing',
  processing: 'shipped',
  shipped: 'delivered',
};

const statusLabels: Record<string, string> = {
  pending: 'Mark Processing',
  processing: 'Mark Shipped',
  shipped: 'Mark Delivered',
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadOrder = async () => {
    if (!id) return;
    try {
      const res = await fetchOrder(id);
      setOrder(res.order);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Order not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrder(); }, [id]);

  const handleStatusUpdate = async (status: string) => {
    if (!id) return;
    setUpdating(true);
    try {
      const res = await updateOrderStatus(id, { status });
      setOrder(res.order);
      toast(`Order ${status}`);
    } catch {
      toast('Update failed', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = async () => {
    if (!id || !confirm('Are you sure you want to cancel this order?')) return;
    try {
      await cancelOrder(id);
      toast('Order cancelled');
      navigate('/orders');
    } catch {
      toast('Cancel failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <p className="text-slate-500">{error || 'Order not found'}</p>
        <Link to="/orders" className="text-indigo-400 hover:text-indigo-300 text-sm mt-3 inline-block transition-colors">Back to orders</Link>
      </div>
    );
  }

  const sc = statusConfig[order.status] || statusConfig.pending;
  const pc = paymentConfig[order.paymentStatus] || paymentConfig.unpaid;

  return (
    <div className="animate-fade-in">
      <Link to="/orders" className="text-sm text-slate-500 hover:text-slate-300 mb-6 inline-flex items-center gap-1 transition-colors">
        &larr; Back to orders
      </Link>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 mt-4">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight font-mono">{order.orderNumber}</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} shadow-sm`} />
                {order.status}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pc.bg} ${pc.text}`}>
                {order.paymentStatus}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {nextStatusMap[order.status] && (
              <button
                onClick={() => handleStatusUpdate(nextStatusMap[order.status])}
                disabled={updating}
                className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer disabled:cursor-not-allowed"
              >
                {updating ? 'Updating...' : statusLabels[order.status]}
              </button>
            )}
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 bg-red-600/80 text-white rounded-lg text-xs hover:bg-red-500 transition-all cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-2.5 px-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Item</th>
                <th className="text-center py-2.5 px-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Qty</th>
                <th className="text-right py-2.5 px-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Price</th>
                <th className="text-right py-2.5 px-3 font-medium text-slate-500 text-xs uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="py-2.5 px-3 text-slate-200">{item.name}</td>
                  <td className="py-2.5 px-3 text-center text-slate-400 font-mono text-xs">{item.quantity}</td>
                  <td className="py-2.5 px-3 text-right text-slate-400 font-mono text-xs">${item.price.toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-right text-slate-200 font-mono text-xs">${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} className="py-2.5 px-3 text-right text-slate-400 font-medium text-xs">Total</td>
                <td className="py-2.5 px-3 text-right text-white font-mono font-bold">${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Customer Info</h3>
            <div className="space-y-2">
              <div>
                <span className="text-xs text-slate-500">Name</span>
                <p className="text-sm text-slate-200">{order.customerInfo.name}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Email</span>
                <p className="text-sm text-slate-200">{order.customerInfo.email}</p>
              </div>
              {order.customerInfo.phone && (
                <div>
                  <span className="text-xs text-slate-500">Phone</span>
                  <p className="text-sm text-slate-200">{order.customerInfo.phone}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Shipping Address</h3>
            <div className="space-y-2">
              {order.shippingAddress.street && (
                <div>
                  <span className="text-xs text-slate-500">Street</span>
                  <p className="text-sm text-slate-200">{order.shippingAddress.street}</p>
                </div>
              )}
              <div>
                <span className="text-xs text-slate-500">City / State</span>
                <p className="text-sm text-slate-200">{order.shippingAddress.city}{order.shippingAddress.state ? `, ${order.shippingAddress.state}` : ''}</p>
              </div>
              {(order.shippingAddress.zipCode || order.shippingAddress.country) && (
                <div>
                  <span className="text-xs text-slate-500">Zip / Country</span>
                  <p className="text-sm text-slate-200">{order.shippingAddress.zipCode}{order.shippingAddress.country ? ` — ${order.shippingAddress.country}` : ''}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-5 grid grid-cols-2 gap-5 text-sm">
          <div>
            <span className="text-slate-500 text-xs font-medium">Created</span>
            <p className="text-slate-300 font-mono text-xs mt-1">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-slate-500 text-xs font-medium">Last Updated</span>
            <p className="text-slate-300 font-mono text-xs mt-1">{new Date(order.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
