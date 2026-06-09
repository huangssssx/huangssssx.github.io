import { useState, useEffect, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/products';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import FileUpload from '../components/FileUpload';
import type { Product, ProductFormData } from '../types';

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400 shadow-emerald-400/50' },
  draft: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400 shadow-amber-400/50' },
  archived: { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
};

const emptyForm: ProductFormData = {
  name: '', description: '', price: 0, category: 'uncategorized',
  stock: 0, images: [], status: 'active',
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const { toast } = useToast();

  const loadProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetchProducts({
        page,
        search: search || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
      });
      setProducts(res.products);
      setPagination({ page: res.pagination.page, pages: res.pagination.pages, total: res.pagination.total });
    } catch {
      toast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, [categoryFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => loadProducts(1), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      name: p.name, description: p.description, price: p.price,
      category: p.category, stock: p.stock, images: p.images, status: p.status,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setFormLoading(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, form);
        toast('Product updated');
      } else {
        await createProduct(form);
        toast('Product created');
      }
      setModalOpen(false);
      loadProducts(pagination.page);
    } catch {
      toast('Operation failed', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProduct(deleteTarget._id);
      toast('Product deleted');
      setDeleteTarget(null);
      loadProducts(pagination.page);
    } catch {
      toast('Delete failed', 'error');
    }
  };

  const inputCls = 'w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all';

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Products</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your product catalog</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-400 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-indigo-500/20 cursor-pointer"
        >
          + New Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`${inputCls} pl-10`}
          />
        </div>
        <input
          type="text"
          placeholder="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={`${inputCls} w-36`}
        />
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
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-slate-500 text-sm">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider">Price</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider hidden sm:table-cell">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const sc = statusConfig[p.status] || statusConfig.active;
                  return (
                    <tr key={p._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-150">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {p.images[0] ? (
                            <img src={p.images[0]} alt="" className="w-9 h-9 rounded-lg object-cover border border-white/10" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <Link to={`/products/${p._id}`} className="font-medium text-slate-200 hover:text-white transition-colors">{p.name}</Link>
                            {p.description && (
                              <div className="text-slate-500 text-xs mt-0.5 truncate max-w-xs">{p.description}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-400 text-xs hidden md:table-cell">{p.category}</td>
                      <td className="py-3 px-4 text-slate-300 font-mono text-xs">${p.price.toFixed(2)}</td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <span className={`text-xs font-mono ${p.stock <= 5 ? 'text-red-400' : 'text-slate-400'}`}>{p.stock}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} shadow-sm`} />
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => openEdit(p)} className="text-slate-400 hover:text-white text-xs font-medium mr-3 transition-colors cursor-pointer">Edit</button>
                        <button onClick={() => setDeleteTarget(p)} className="text-slate-500 hover:text-red-400 text-xs font-medium transition-colors cursor-pointer">Delete</button>
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
                onClick={() => loadProducts(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1.5 text-xs border border-white/[0.08] rounded-lg text-slate-400 disabled:opacity-30 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed"
              >Prev</button>
              <span className="px-3 py-1.5 text-xs text-slate-500 font-mono">{pagination.page} / {pagination.pages}</span>
              <button
                onClick={() => loadProducts(pagination.page + 1)}
                disabled={pagination.page >= pagination.pages}
                className="px-3 py-1.5 text-xs border border-white/[0.08] rounded-lg text-slate-400 disabled:opacity-30 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer disabled:cursor-not-allowed"
              >Next</button>
            </div>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingProduct ? 'Edit Product' : 'New Product'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={`${inputCls} resize-none`} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Price *</label>
              <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} required className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ProductFormData['status'] })} className={`${inputCls} cursor-pointer`}>
                <option value="active" className="bg-gray-900">Active</option>
                <option value="draft" className="bg-gray-900">Draft</option>
                <option value="archived" className="bg-gray-900">Archived</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Images</label>
            <FileUpload images={form.images} onChange={(images) => setForm({ ...form, images })} />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2.5 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer">Cancel</button>
            <button type="submit" disabled={formLoading} className="flex-1 bg-gradient-to-r from-indigo-500 to-violet-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:from-indigo-400 hover:to-violet-500 disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer disabled:cursor-not-allowed">
              {formLoading ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Product">
        <p className="text-sm text-slate-400 mb-5">
          Are you sure you want to delete <span className="text-white font-medium">{deleteTarget?.name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-2.5 border border-white/[0.08] rounded-xl text-sm font-medium text-slate-400 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer">Cancel</button>
          <button onClick={handleDelete} className="flex-1 bg-red-600/90 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-red-500 transition-all cursor-pointer">Delete</button>
        </div>
      </Modal>
    </div>
  );
}
