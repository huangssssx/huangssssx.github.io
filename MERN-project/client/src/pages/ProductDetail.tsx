import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchProduct, deleteProduct } from '../services/products';
import { useToast } from '../components/Toast';
import type { Product } from '../types';

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400 shadow-emerald-400/50' },
  draft: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400 shadow-amber-400/50' },
  archived: { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
};

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetchProduct(id);
        setProduct(res.product);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Product not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure?')) return;
    try {
      await deleteProduct(id);
      toast('Product deleted');
      navigate('/products');
    } catch {
      toast('Delete failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <p className="text-slate-500">{error || 'Product not found'}</p>
        <Link to="/products" className="text-indigo-400 hover:text-indigo-300 text-sm mt-3 inline-block transition-colors">Back to products</Link>
      </div>
    );
  }

  const sc = statusConfig[product.status] || statusConfig.active;

  return (
    <div className="animate-fade-in">
      <Link to="/products" className="text-sm text-slate-500 hover:text-slate-300 mb-6 inline-flex items-center gap-1 transition-colors">
        &larr; Back to products
      </Link>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            {product.images.length > 0 ? (
              <div>
                <img src={product.images[activeImage]} alt={product.name} className="w-full aspect-square object-cover rounded-xl border border-white/10" />
                {product.images.length > 1 && (
                  <div className="flex gap-2 mt-3">
                    {product.images.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          i === activeImage ? 'border-indigo-500' : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-square rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center">
                <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{product.name}</h1>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text} mt-3`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} shadow-sm`} />
                  {product.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate('/products')}
                  className="px-3 py-1.5 border border-white/[0.08] rounded-lg text-xs text-slate-400 hover:bg-white/[0.04] hover:text-white transition-all cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-red-600/80 text-white rounded-lg text-xs hover:bg-red-500 transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white font-mono">${product.price.toFixed(2)}</span>
                <span className="text-sm text-slate-500">per unit</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                  <p className="text-xs text-slate-500 font-medium">Category</p>
                  <p className="text-sm text-slate-200 mt-1">{product.category}</p>
                </div>
                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
                  <p className="text-xs text-slate-500 font-medium">Stock</p>
                  <p className={`text-sm font-mono mt-1 ${product.stock <= 5 ? 'text-red-400' : 'text-slate-200'}`}>{product.stock} units</p>
                </div>
              </div>

              {product.description && (
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-2">Description</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="border-t border-white/[0.06] pt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500 text-xs font-medium">Created</span>
                  <p className="text-slate-300 font-mono text-xs mt-1">{new Date(product.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-xs font-medium">Last Updated</span>
                  <p className="text-slate-300 font-mono text-xs mt-1">{new Date(product.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
