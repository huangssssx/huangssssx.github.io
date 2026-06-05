import { useState, useEffect, type FormEvent } from 'react';
import { fetchItems, createItem, updateItem, deleteItem } from '../services/items';
import { useToast } from '../components/Toast';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import type { Item, ItemFormData } from '../types';

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [form, setForm] = useState<ItemFormData>({ title: '', description: '', status: 'active' });
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);
  const { toast } = useToast();

  const loadItems = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchItems({ page, search: search || undefined, status: statusFilter || undefined });
      setItems(res.items);
      setPagination({ page: res.pagination.page, pages: res.pagination.pages, total: res.pagination.total });
    } catch {
      toast('Failed to load items', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, [statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => loadItems(1), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openCreate = () => {
    setEditingItem(null);
    setForm({ title: '', description: '', status: 'active' });
    setModalOpen(true);
  };

  const openEdit = (item: Item) => {
    setEditingItem(item);
    setForm({ title: item.title, description: item.description, status: item.status });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setFormLoading(true);
    try {
      if (editingItem) {
        await updateItem(editingItem._id, form);
        toast('Item updated');
      } else {
        await createItem(form);
        toast('Item created');
      }
      setModalOpen(false);
      loadItems(pagination.page);
    } catch {
      toast('Operation failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteItem(deleteTarget._id);
      toast('Item deleted');
      setDeleteTarget(null);
      loadItems(pagination.page);
    } catch {
      toast('Delete failed', 'error');
    }
  };

  const inputCls = 'w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all';

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Items</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your items</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-400 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          + New Item
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search items..."
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
          <option value="active" className="bg-gray-900">Active</option>
          <option value="draft" className="bg-gray-900">Draft</option>
          <option value="archived" className="bg-gray-900">Archived</option>
        </select>
      </div>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden">
        <DataTable items={items} loading={loading} onEdit={openEdit} onDelete={setDeleteTarget} />

        {pagination.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
            <span className="text-xs text-slate-500 font-mono">
              {pagination.total} total
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() => loadItems(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-xs border border-white/[0.08] rounded-lg text-slate-400 disabled:opacity-30 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Prev
              </button>
              <span className="px-3 py-1.5 text-xs text-slate-500 font-mono">
                {pagination.page} / {pagination.pages}
              </span>
              <button
                onClick={() => loadItems(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1.5 text-xs border border-white/[0.08] rounded-lg text-slate-400 disabled:opacity-30 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingItem ? 'Edit Item' : 'New Item'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ItemFormData['status'] })}
              className={`${inputCls} cursor-pointer`}
            >
              <option value="active" className="bg-gray-900">Active</option>
              <option value="draft" className="bg-gray-900">Draft</option>
              <option value="archived" className="bg-gray-900">Archived</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="flex-1 px-4 py-2.5 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer disabled:cursor-not-allowed"
            >
              {formLoading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Item">
        <p className="text-sm text-slate-400 mb-5">
          Are you sure you want to delete <span className="text-white font-medium">{deleteTarget?.title}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setDeleteTarget(null)}
            className="flex-1 px-4 py-2.5 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500 transition-all cursor-pointer"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
