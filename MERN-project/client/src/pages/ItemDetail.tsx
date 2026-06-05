import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchItem, deleteItem } from '../services/items';
import { useToast } from '../components/Toast';
import type { Item } from '../types';

const statusColors: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  draft: 'bg-yellow-100 text-yellow-700',
  archived: 'bg-gray-100 text-gray-600',
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
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{error || 'Item not found'}</p>
        <Link to="/items" className="text-blue-600 hover:underline text-sm mt-2 inline-block">Back to items</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/items" className="text-sm text-gray-500 hover:text-gray-700 mb-4 inline-flex items-center gap-1">
        &larr; Back to items
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mt-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
              {item.status}
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              to="/items"
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        {item.description && (
          <p className="text-gray-600 text-sm mb-6">{item.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 text-sm border-t border-gray-200 pt-4">
          <div>
            <span className="text-gray-500">Created</span>
            <p className="font-medium text-gray-900">{new Date(item.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-500">Last Updated</span>
            <p className="font-medium text-gray-900">{new Date(item.updatedAt).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-500">ID</span>
            <p className="font-mono text-xs text-gray-600">{item._id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
