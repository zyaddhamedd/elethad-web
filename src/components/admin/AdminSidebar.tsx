"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, Layers3, ShoppingBag, MessageSquare, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "الرئيسية", icon: LayoutDashboard },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/categories", label: "الأقسام", icon: Layers3 },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingBag },
  { href: "/admin/messages", label: "الرسائل", icon: MessageSquare },
];

export function AdminSidebar({ isOpen = true, setIsOpen }: { isOpen?: boolean; setIsOpen?: (val: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && setIsOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex h-full flex-col border-l border-white/10 bg-[#0a1020]/95 backdrop-blur-xl transition-all duration-300 lg:static",
          isOpen 
            ? "w-[280px] translate-x-0 lg:w-[300px]" 
            : "w-[280px] translate-x-full lg:w-0 lg:translate-x-0 lg:opacity-0 lg:overflow-hidden lg:border-none"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-5 lg:p-6">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-2xl shadow-[0_18px_35px_rgba(37,99,235,0.35)]">
              <Image src="/os.jpg" alt="شعار الاتحاد" fill className="object-cover" sizes="48px" />
            </div>
            <div>
              <p className="text-lg font-black text-white">الاتحاد</p>
              <p className="text-sm text-slate-400">لوحة الإدارة</p>
            </div>
          </div>
          {setIsOpen && (
            <button 
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 lg:px-4">
          <div className="space-y-2">
            {items.map((item) => {
              const active = item.href === "/admin" ? pathname === "/admin" : pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen?.(false)}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 hover:-translate-x-1 hover:bg-white/8",
                    active
                      ? "bg-blue-600/15 text-white ring-1 ring-blue-500/40 shadow-[0_16px_35px_rgba(37,99,235,0.18)]"
                      : "text-slate-300 hover:text-white"
                  )}
                >
                  <span className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-all duration-200",
                    active ? "border-blue-400/30 bg-blue-500/15 text-blue-300" : "border-white/10 bg-white/5 text-slate-300 group-hover:border-white/20 group-hover:bg-white/10"
                  )}>
                    <Icon size={18} />
                  </span>
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
        
        <div className="border-t border-white/10 p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-rose-300 transition-all duration-200 hover:bg-rose-500/10 hover:text-rose-200"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-300">
              <LogOut size={18} />
            </span>
            <span className="whitespace-nowrap">تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}