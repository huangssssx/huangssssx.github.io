import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders, createOrder, cancelOrder } from '../services/orders';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import type { Order, OrderFormData } from '../types';

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

const emptyForm: OrderFormData = {
  customerInfo: { name: '', email: '', phone: '' },
  items: [{ name: '', quantity: 1, price: 0 }],
  shippingAddress: { street: '', city: '', state: '', zipCode: '', country: '' },
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<OrderFormData>(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const { toast } = useToast();

  const loadOrders = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchOrders({ page, search: search || undefined, status: statusFilter || undefined });
      setOrders(res.orders);
      setPagination({ page: res.pagination.page, pages: res.pagination.pages, total: res.pagination.total });
    } catch {
      toast('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => loadOrders(1), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openCreate = () => {
    setForm(emptyForm);
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.customerInfo.name.trim() || !form.customerInfo.email.trim()) return;
    if (form.items.some((item) => !item.name.trim())) return;
    setFormLoading(true);
    try {
      await createOrder(form);
      toast('Order created');
      setModalOpen(false);
      loadOrders(pagination.page);
    } catch {
      toast('Operation failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!deleteTarget) return;
    try {
      await cancelOrder(deleteTarget._id);
      toast('Order cancelled');
      setDeleteTarget(null);
      loadOrders(pagination.page);
    } catch {
      toast('Cancel failed', 'error');
    }
  };

  const addItem = () => {
    setForm({ ...form, items: [...form.items, { name: '', quantity: 1, price: 0 }] });
  };

  const removeItem = (index: number) => {
    if (form.items.length <= 1) return;
    setForm({ ...form, items: form.items.filter((_, i) => i !== index) });
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const items = form.items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    setForm({ ...form, items });
  };

  const inputCls = 'w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all';

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Orders</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your orders</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-400 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          + New Order
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputCls} pl-10`}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all cursor-pointer"
        >
          <option value="" className="bg-gray-900">All Status</option>
          <option value="pending" className="bg-gray-900">Pending</option>
          <option value="processing" className="bg-gray-900">Processing</option>
          <option value="shipped" className="bg-gray-900">Shipped</option>
          <option value="delivered" className="bg-gray-900">Delivered</option>
          <option value="cancelled" className="bg-gray-900">Cancelled</option>
        </select>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider">Order#</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Payment</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const sc = statusConfig[order.status] || statusConfig.pending;
                  const pc = paymentConfig[order.paymentStatus] || paymentConfig.unpaid;
                  return (
                    <tr key={order._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-150">
                      <td className="py-3 px-4">
                        <Link to={`/orders/${order._id}`} className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors font-mono text-xs">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-200 text-xs">{order.customerInfo.name}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{order.customerInfo.email}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-xs">${order.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} shadow-sm`} />
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${pc.bg} ${pc.text}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-xs hidden md:table-cell">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => setDeleteTarget(order)} className="text-slate-500 hover:text-red-400 text-xs font-medium transition-colors cursor-pointer">
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
            <span className="text-xs text-slate-500 font-mono">{pagination.total} total</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => loadOrders(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-xs border border-white/[0.08] rounded-lg text-slate-400 disabled:opacity-30 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed"
              >Prev</button>
              <span className="px-3 py-1.5 text-xs text-slate-500 font-mono">{pagination.page} / {pagination.pages}</span>
              <button
                onClick={() => loadOrders(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1.5 text-xs border border-white/[0.08] rounded-lg text-slate-400 disabled:opacity-30 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed"
              >Next</button>
            </div>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Order">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Customer Name *</label>
            <input
              type="text"
              value={form.customerInfo.name}
              onChange={(e) => setForm({ ...form, customerInfo: { ...form.customerInfo, name: e.target.value } })}
              required
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Email *</label>
              <input
                type="email"
                value={form.customerInfo.email}
                onChange={(e) => setForm({ ...form, customerInfo: { ...form.customerInfo, email: e.target.value } })}
                required
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Phone</label>
              <input
                type="text"
                value={form.customerInfo.phone}
                onChange={(e) => setForm({ ...form, customerInfo: { ...form.customerInfo, phone: e.target.value } })}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-medium text-slate-400">Items *</label>
              <button type="button" onClick={addItem} className="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">+ Add Item</button>
            </div>
            <div className="space-y-2">
              {form.items.map((item, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Name"
                    value={item.name}
                    onChange={(e) => updateItem(i, 'name', e.target.value)}
                    required
                    className={`${inputCls} flex-1`}
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(i, 'quantity', parseInt(e.target.value) || 1)}
                    required
                    className={`${inputCls} w-20`}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => updateItem(i, 'price', parseFloat(e.target.value) || 0)}
                    required
                    className={`${inputCls} w-24`}
                  />
                  {form.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)} className="text-slate-500 hover:text-red-400 text-xs cursor-pointer">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Shipping Address</label>
            <input
              type="text"
              placeholder="Street"
              value={form.shippingAddress.street}
              onChange={(e) => setForm({ ...form, shippingAddress: { ...form.shippingAddress, street: e.target.value } })}
              className={`${inputCls} mb-2`}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="City"
                value={form.shippingAddress.city}
                onChange={(e) => setForm({ ...form, shippingAddress: { ...form.shippingAddress, city: e.target.value } })}
                className={inputCls}
              />
              <input
                type="text"
                placeholder="State"
                value={form.shippingAddress.state}
                onChange={(e) => setForm({ ...form, shippingAddress: { ...form.shippingAddress, state: e.target.value } })}
                className={inputCls}
              />
              <input
                type="text"
                placeholder="Zip Code"
                value={form.shippingAddress.zipCode}
                onChange={(e) => setForm({ ...form, shippingAddress: { ...form.shippingAddress, zipCode: e.target.value } })}
                className={inputCls}
              />
              <input
                type="text"
                placeholder="Country"
                value={form.shippingAddress.country}
                onChange={(e) => setForm({ ...form, shippingAddress: { ...form.shippingAddress, country: e.target.value } })}
                className={inputCls}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer">Cancel</button>
            <button type="submit" disabled={formLoading} className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer disabled:cursor-not-allowed">
              {formLoading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Cancel Order">
        <p className="text-sm text-slate-400 mb-5">
          Are you sure you want to cancel order <span className="text-white font-medium">{deleteTarget?.orderNumber}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer">Cancel</button>
          <button onClick={handleCancel} className="flex-1 bg-red-600/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500 transition-all cursor-pointer">Cancel Order</button>
        </div>
      </Modal>
    </div>
  );
}
