import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchItems } from '../services/items';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, active: 0, draft: 0, archived: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchItems({ limit: 1 });
        const total = res.pagination.total;
        const [activeRes, draftRes, archivedRes] = await Promise.all([
          fetchItems({ status: 'active', limit: 1 }),
          fetchItems({ status: 'draft', limit: 1 }),
          fetchItems({ status: 'archived', limit: 1 }),
        ]);
        setStats({
          total,
          active: activeRes.pagination.total,
          draft: draftRes.pagination.total,
          archived: archivedRes.pagination.total,
        });
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load stats');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const cards = [
    { label: 'Total Items', value: stats.total, color: 'bg-blue-500', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
    { label: 'Active', value: stats.active, color: 'bg-emerald-500', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Draft', value: stats.draft, color: 'bg-yellow-500', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' },
    { label: 'Archived', value: stats.archived, color: 'bg-gray-500', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg">{error}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/items"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all items &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${card.color} rounded-lg flex items-center justify-center`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={card.icon} />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Welcome to your Admin Dashboard</h2>
        <p className="text-gray-500 text-sm">
          This is a MERN stack demo showcasing authentication and full CRUD operations.
          Navigate to <Link to="/items" className="text-blue-600 hover:underline">Items</Link> to manage your data.
        </p>
      </div>
    </div>
  );
}
