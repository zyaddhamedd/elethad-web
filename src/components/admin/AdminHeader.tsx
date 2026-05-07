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
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a1020]/85 backdrop-blur-xl overflow-x-hidden">
      <div className="flex flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4 md:px-6 md:py-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0 sm:gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="flex-shrink-0 rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Menu size={18} />
            </button>
          )}
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.28em] text-blue-400/80 truncate">الاتحاد</p>
            <h1 className="mt-1 text-lg sm:text-xl lg:text-2xl font-black text-white truncate">{title}</h1>
            <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-400 truncate">{subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link href="/" className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-white/10 bg-white/5 px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-slate-100 transition-all hover:bg-white/10 flex-shrink-0">
            <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">الموقع</span>
            <span className="sm:hidden">موقع</span>
          </Link>
          <button onClick={handleLogout} className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-rose-200 transition-all hover:bg-rose-500/20 flex-shrink-0">
            <LogOut size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">تسجيل خروج</span>
            <span className="sm:hidden">خروج</span>
          </button>
        </div>
      </div>
    </header>
  );
}