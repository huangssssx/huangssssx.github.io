import type { Item } from '../types';

interface Props {
  items: Item[];
  loading: boolean;
  onEdit: (item: Item) => void;
  onDelete: (item: Item) => void;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  active: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400 shadow-emerald-400/50' },
  draft: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400 shadow-amber-400/50' },
  archived: { bg: 'bg-slate-500/10', text: 'text-slate-400', dot: 'bg-slate-400' },
};

export default function DataTable({ items, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-7 h-7 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-3">
          <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-slate-500 text-sm">No items found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06]">
            <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider">Title</th>
            <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider">Status</th>
            <th className="text-left py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider hidden md:table-cell">Created</th>
            <th className="text-right py-3 px-4 font-medium text-slate-500 text-xs uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const sc = statusConfig[item.status] || statusConfig.active;
            return (
              <tr key={item._id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors duration-150">
                <td className="py-3 px-4">
                  <div className="font-medium text-slate-200">{item.title}</div>
                  {item.description && (
                    <div className="text-slate-500 text-xs mt-0.5 truncate max-w-xs">{item.description}</div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sc.bg} ${sc.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} shadow-sm`} />
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-slate-500 font-mono text-xs hidden md:table-cell">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-slate-400 hover:text-white text-xs font-medium mr-3 transition-colors cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(item)}
                    className="text-slate-500 hover:text-red-400 text-xs font-medium transition-colors cursor-pointer"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
