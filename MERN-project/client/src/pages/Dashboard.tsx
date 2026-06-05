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
    { label: 'Total Items', value: stats.total, gradient: 'from-indigo-500/20 to-indigo-600/5', icon: 'from-indigo-500 to-violet-600', glow: 'shadow-indigo-500/20' },
    { label: 'Active', value: stats.active, gradient: 'from-emerald-500/20 to-emerald-600/5', icon: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/20' },
    { label: 'Draft', value: stats.draft, gradient: 'from-amber-500/20 to-amber-600/5', icon: 'from-amber-500 to-orange-600', glow: 'shadow-amber-500/20' },
    { label: 'Archived', value: stats.archived, gradient: 'from-slate-500/20 to-slate-600/5', icon: 'from-slate-400 to-slate-600', glow: '' },
  ];

  const icons = [
    'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
    'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  ];

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm">{error}</div>;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Overview of your items</p>
        </div>
        <Link
          to="/items"
          className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          View all items &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className={`relative overflow-hidden bg-white/[0.02] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200 cursor-default`}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${card.gradient} rounded-full blur-2xl -translate-y-8 translate-x-8`} />
            <div className="relative flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.icon} flex items-center justify-center shadow-lg ${card.glow}`}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icons[i]} />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-white font-mono">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-base font-semibold text-white mb-2">Welcome to your Admin Dashboard</h2>
        <p className="text-slate-500 text-sm leading-relaxed">
          This is a MERN stack demo showcasing authentication and full CRUD operations.
          Navigate to <Link to="/items" className="text-indigo-400 hover:text-indigo-300 transition-colors">Items</Link> to manage your data.
        </p>
      </div>
    </div>
  );
}
