"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft, Menu } from "lucide-react";
import { AdminButton } from "./AdminButton";

export function AdminHeader({
  title,
  subtitle,
  onToggleSidebar
}: {
  title: string;
  subtitle: string;
  onToggleSidebar?: () => void;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a1020]/85 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Menu size={20} />
            </button>
          )}
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-blue-400/80">الاتحاد</p>
            <h1 className="mt-1 text-2xl font-black text-white">{title}</h1>
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-slate-100 transition-all hover:bg-white/10">
            <ArrowLeft size={16} />
            الموقع
          </Link>
          <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-2.5 text-sm font-bold text-rose-200 transition-all hover:bg-rose-500/20">
            <LogOut size={16} />
            تسجيل خروج
          </button>
        </div>
      </div>
    </header>
  );
}