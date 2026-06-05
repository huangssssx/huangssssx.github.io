import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gray-900 border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/40 w-full max-w-md mx-4 p-6 z-50 animate-fade-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-lg leading-none transition-colors cursor-pointer">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}
