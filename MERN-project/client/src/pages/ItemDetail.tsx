import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchItem, deleteItem } from '../services/items';
import { useToast } from '../components/Toast';
import type { Item } from '../types';

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400 shadow-emerald-400/50' },
  draft: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400 shadow-amber-400/50' },
  archived: { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
};

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const res = await fetchItem(id);
        setItem(res.item);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Item not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure?')) return;
    try {
      await deleteItem(id);
      toast('Item deleted');
      navigate('/items');
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

  if (error || !item) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <p className="text-slate-500">{error || 'Item not found'}</p>
        <Link to="/items" className="text-indigo-400 hover:text-indigo-300 text-sm mt-3 inline-block transition-colors">Back to items</Link>
      </div>
    );
  }

  const sc = statusConfig[item.status] || statusConfig.active;

  return (
    <div className="animate-fade-in">
      <Link to="/items" className="text-sm text-slate-500 hover:text-slate-300 mb-6 inline-flex items-center gap-1 transition-colors">
        &larr; Back to items
      </Link>

      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 mt-4">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">{item.title}</h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text} mt-3`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} shadow-sm`} />
              {item.status}
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              to="/items"
              className="px-3 py-1.5 border border-white/[0.08] rounded-lg text-xs text-slate-400 hover:bg-white/[0.04] hover:text-white transition-all"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 bg-red-600/80 text-white rounded-lg text-xs hover:bg-red-500 transition-all cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>

        {item.description && (
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">{item.description}</p>
        )}

        <div className="grid grid-cols-2 gap-5 text-sm border-t border-white/[0.06] pt-5">
          <div>
            <span className="text-slate-500 text-xs font-medium">Created</span>
            <p className="text-slate-300 font-mono text-xs mt-1">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-slate-500 text-xs font-medium">Last Updated</span>
            <p className="text-slate-300 font-mono text-xs mt-1">{new Date(item.updatedAt).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-slate-500 text-xs font-medium">ID</span>
            <p className="text-slate-500 font-mono text-[11px] mt-1 truncate">{item._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
