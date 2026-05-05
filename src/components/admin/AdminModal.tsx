"use client";

import { X } from "lucide-react";

export function AdminModal({
  title,
  description,
  open,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-[1.75rem] border border-white/10 bg-[#0b1020] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.55)]">
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="إغلاق"
        >
          <X size={18} />
        </button>

        <div className="mb-6 pr-10">
          <h3 className="text-2xl font-black text-white">{title}</h3>
          {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
        </div>

        {children}
      </div>
    </div>
  );
}