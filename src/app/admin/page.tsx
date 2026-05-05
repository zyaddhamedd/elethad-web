"use client";

import { useEffect, useState } from "react";
import {
  Package,
  Layers3,
  ShoppingBag,
  MessageSquare,
  ArrowUpRight,
  RefreshCw,
  Clock,
  Banknote,
  Smartphone,
  Phone,
  MapPin,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminModal } from "@/components/admin/AdminModal";

// ─── Types ────────────────────────────────────────────────────────────────────
interface DashboardStats {
  products: number;
  categories: number;
  orders: number;
  messages: number;
  pendingOrders: number;
  newMessages: number;
}

interface RecentOrder {
  id: number;
  customer_name: string;
  phone: string;
  governorate: string;
  payment_method: "cash" | "instapay";
  total: number;
  status: string;
  created_at: string;
  items: { name: string; price: number; quantity: number }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ORDER_STATUS_META: Record<string, { label: string; color: string }> = {
  pending:    { label: "معلق",        color: "bg-amber-500/15 text-amber-300 border-amber-500/20" },
  confirmed:  { label: "مؤكد",        color: "bg-blue-500/15 text-blue-300 border-blue-500/20" },
  processing: { label: "قيد التجهيز", color: "bg-purple-500/15 text-purple-300 border-purple-500/20" },
  shipped:    { label: "تم الشحن",    color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20" },
  delivered:  { label: "تم التسليم",  color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" },
  cancelled:  { label: "ملغي",        color: "bg-rose-500/15 text-rose-300 border-rose-500/20" },
};

function StatusBadge({ status }: { status: string }) {
  const meta = ORDER_STATUS_META[status] ?? { label: status, color: "bg-slate-500/15 text-slate-300 border-slate-500/20" };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${meta.color}`}>
      {meta.label}
    </span>
  );
}

function PaymentBadge({ method }: { method: "cash" | "instapay" }) {
  return method === "instapay" ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-2 py-0.5 text-[10px] font-bold text-purple-300">
      <Smartphone size={9} /> InstaPay
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
      <Banknote size={9} /> كاش
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0, categories: 0, orders: 0, messages: 0,
    pendingOrders: 0, newMessages: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat("ar-EG", {
        day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
      }).format(new Date(iso));
    } catch { return iso; }
  };

  const loadDashboard = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes, ordersRes, messagesRes] = await Promise.allSettled([
        fetch("/api/admin/products",   { cache: "no-store" }),
        fetch("/api/admin/categories", { cache: "no-store" }),
        fetch("/api/admin/orders",     { cache: "no-store" }),
        fetch("/api/admin/messages",   { cache: "no-store" }),
      ]);

      const products   = productsRes.status   === "fulfilled" && productsRes.value.ok   ? await productsRes.value.json()   : [];
      const categories = categoriesRes.status === "fulfilled" && categoriesRes.value.ok ? await categoriesRes.value.json() : [];
      const orders     = ordersRes.status     === "fulfilled" && ordersRes.value.ok     ? await ordersRes.value.json()     : [];
      const messages   = messagesRes.status   === "fulfilled" && messagesRes.value.ok   ? await messagesRes.value.json()   : [];

      const ordersArr:   RecentOrder[] = Array.isArray(orders)   ? orders   : [];
      const messagesArr: { status: string }[] = Array.isArray(messages) ? messages : [];

      setStats({
        products:     Array.isArray(products)   ? products.length   : 0,
        categories:   Array.isArray(categories) ? categories.length : 0,
        orders:       ordersArr.length,
        messages:     messagesArr.length,
        pendingOrders: ordersArr.filter((o) => o.status === "pending").length,
        newMessages:   messagesArr.filter((m) => m.status === "new").length,
      });

      // Show only the 5 most recent orders
      setRecentOrders(ordersArr.slice(0, 5));
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  const statCards = [
    {
      label: "إجمالي المنتجات",
      value: stats.products,
      icon: Package,
      alert: null,
    },
    {
      label: "الأقسام",
      value: stats.categories,
      icon: Layers3,
      alert: null,
    },
    {
      label: "الطلبات",
      value: stats.orders,
      icon: ShoppingBag,
      alert: stats.pendingOrders > 0 ? `${stats.pendingOrders} معلق` : null,
      alertColor: "text-amber-300 bg-amber-500/10 border-amber-500/20",
      href: "/admin/orders",
    },
    {
      label: "الرسائل",
      value: stats.messages,
      icon: MessageSquare,
      alert: stats.newMessages > 0 ? `${stats.newMessages} جديد` : null,
      alertColor: "text-blue-300 bg-blue-500/10 border-blue-500/20",
      href: "/admin/messages",
    },
  ];

  return (
    <AdminShell title="الرئيسية" subtitle="نظرة عامة سريعة على حالة المتجر والطلبات والرسائل.">
      <div className="space-y-6">

        {/* ── Stat cards ── */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            const card = (
              <AdminCard key={stat.label} className="relative overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.16),_transparent_55%)]" />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                    <div className="mt-3 text-3xl font-black text-white">
                      {isLoading ? <span className="text-slate-600 text-2xl">—</span> : stat.value}
                    </div>
                    {stat.alert ? (
                      <p className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-bold ${stat.alertColor}`}>
                        <ArrowUpRight size={12} />
                        {stat.alert}
                      </p>
                    ) : (
                      <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-300">
                        <ArrowUpRight size={12} />
                        محدّث الآن
                      </p>
                    )}
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/20">
                    <Icon size={20} />
                  </div>
                </div>
              </AdminCard>
            );

            return stat.href ? (
              <Link href={stat.href} key={stat.label} className="block hover:opacity-90 transition">
                {card}
              </Link>
            ) : (
              <div key={stat.label}>{card}</div>
            );
          })}
        </div>

        {/* ── Recent orders ── */}
        <AdminCard>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">
                الطلبات الأخيرة
                {stats.pendingOrders > 0 && (
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-white">
                    {stats.pendingOrders}
                  </span>
                )}
              </h2>
              <p className="mt-1 text-sm text-slate-400">آخر 5 طلبات واردة من الموقع.</p>
            </div>
            <div className="flex items-center gap-2">
              <AdminButton variant="ghost" icon={<RefreshCw size={15} />} onClick={loadDashboard}>
                تحديث
              </AdminButton>
              <Link href="/admin/orders">
                <AdminButton variant="secondary">عرض الكل</AdminButton>
              </Link>
            </div>
          </div>

          <div className="mt-6">
            {isLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-400">
                جاري التحميل...
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
                <ShoppingBag size={36} className="text-slate-600" />
                <p className="text-slate-400 font-bold">لا توجد طلبات بعد</p>
                <p className="text-slate-500 text-sm">ستظهر هنا الطلبات الجديدة فور وصولها.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                      order.status === "pending"
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-white/10 bg-white/5"
                    }`}
                  >
                    {/* Order info */}
                    <div className="flex flex-wrap items-center gap-3 min-w-0">
                      <span className="font-black text-white text-sm">
                        #{String(order.id).padStart(4, "0")}
                      </span>
                      <span className="text-slate-300 font-bold text-sm truncate max-w-[140px]">
                        {order.customer_name}
                      </span>
                      <PaymentBadge method={order.payment_method} />
                      <StatusBadge status={order.status} />
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="font-black text-white text-sm">{order.total.toLocaleString("ar-EG")} ج.م</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 justify-end">
                          <Clock size={9} />{formatDate(order.created_at)}
                        </p>
                      </div>
                      <AdminButton
                        variant="secondary"
                        className="px-3 py-2 text-xs shrink-0"
                        icon={<Eye size={13} />}
                        onClick={() => setSelectedOrder(order)}
                      >
                        عرض
                      </AdminButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AdminCard>

      </div>

      {/* ── Quick-view order modal ── */}
      {selectedOrder && (
        <AdminModal
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          title={`طلب #${String(selectedOrder.id).padStart(4, "0")}`}
          description={`${selectedOrder.customer_name} · ${formatDate(selectedOrder.created_at)}`}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={selectedOrder.status} />
              <PaymentBadge method={selectedOrder.payment_method} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="العميل"    value={selectedOrder.customer_name} />
              <InfoRow label="الهاتف"    value={selectedOrder.phone} dir="ltr" />
              <InfoRow label="المحافظة" value={selectedOrder.governorate} />
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-xs font-bold text-slate-400">المنتجات</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 rounded-xl bg-white/5 px-3 py-2">
                    <span className="text-sm font-bold text-white line-clamp-1 flex-1">{item.name}</span>
                    <span className="text-xs text-slate-400 shrink-0">× {item.quantity}</span>
                    <span className="text-sm font-black text-blue-400 shrink-0">
                      {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-sm font-black text-white">
                <span>الإجمالي</span>
                <span>{selectedOrder.total.toLocaleString("ar-EG")} ج.م</span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-white/10">
              <Link href="/admin/orders">
                <AdminButton variant="primary">الذهاب لصفحة الطلبات</AdminButton>
              </Link>
            </div>
          </div>
        </AdminModal>
      )}
    </AdminShell>
  );
}

function InfoRow({ label, value, dir }: { label: string; value: string; dir?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="mb-1 text-xs font-bold text-slate-400">{label}</p>
      <p className="text-sm font-bold text-white" dir={dir}>{value}</p>
    </div>
  );
}