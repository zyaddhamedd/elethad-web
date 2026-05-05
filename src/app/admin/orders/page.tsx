"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  Trash2,
  Eye,
  Phone,
  MapPin,
  Package,
  Clock,
  Banknote,
  Smartphone,
  ShoppingBag,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminModal } from "@/components/admin/AdminModal";
import { getOptimizedCloudinaryUrl } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────
interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  governorate: string;
  payment_method: "cash" | "instapay";
  payment_screenshot_url: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: string;
  notes: string | null;
  created_at: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const ORDER_STATUSES: { value: string; label: string; color: string }[] = [
  { value: "pending",    label: "معلق",         color: "bg-amber-500/15 text-amber-300 border-amber-500/20" },
  { value: "confirmed",  label: "مؤكد",         color: "bg-blue-500/15 text-blue-300 border-blue-500/20" },
  { value: "processing", label: "قيد التجهيز",  color: "bg-purple-500/15 text-purple-300 border-purple-500/20" },
  { value: "shipped",    label: "تم الشحن",     color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/20" },
  { value: "delivered",  label: "تم التسليم",   color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" },
  { value: "cancelled",  label: "ملغي",         color: "bg-rose-500/15 text-rose-300 border-rose-500/20" },
];

function getStatusMeta(status: string) {
  return ORDER_STATUSES.find((s) => s.value === status) ?? { label: status, color: "bg-slate-500/15 text-slate-300 border-slate-500/20" };
}

function StatusBadge({ status }: { status: string }) {
  const meta = getStatusMeta(status);
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${meta.color}`}>
      {meta.label}
    </span>
  );
}

function PaymentBadge({ method }: { method: "cash" | "instapay" }) {
  return method === "instapay" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
      <Smartphone size={11} /> InstaPay
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-300">
      <Banknote size={11} /> كاش
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<"all" | "cash" | "instapay">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [screenshotOpen, setScreenshotOpen] = useState(false);

  const loadOrders = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const qs = filter !== "all" ? `?payment_method=${filter}` : "";
      const res = await fetch(`/api/admin/orders${qs}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`فشل التحميل (${res.status})`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "تعذر تحميل الطلبات.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadOrders(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
      if (selectedOrder?.id === id) setSelectedOrder((prev) => prev ? { ...prev, status } : prev);
      setStatusMessage("تم تحديث حالة الطلب.");
    } catch {
      setErrorMessage("تعذر تحديث الحالة.");
    }
  };

  const deleteOrder = async (id: number) => {
    if (!window.confirm("هل تريد حذف هذا الطلب نهائياً؟")) return;
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.filter((o) => o.id !== id));
      if (selectedOrder?.id === id) setSelectedOrder(null);
      setStatusMessage("تم حذف الطلب.");
    } catch {
      setErrorMessage("تعذر حذف الطلب.");
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
    } catch { return iso; }
  };

  const screenshotUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//")) return url;
    if (url.startsWith("/api/")) return url;
    const filename = url.split("/").pop();
    return `/api/uploads/orders/${filename}`;
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <AdminShell title="الطلبات" subtitle="متابعة الطلبات، تعديل الحالة، وإدارة دورة البيع بسهولة.">
      <div className="space-y-6">
        <AdminCard>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">
                قائمة الطلبات
                {pendingCount > 0 && (
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-black text-white">
                    {pendingCount}
                  </span>
                )}
              </h2>
              <p className="mt-1 text-sm text-slate-400">جميع الطلبات الواردة من الموقع مباشرةً.</p>
            </div>
            <AdminButton variant="ghost" icon={<RefreshCw size={16} />} onClick={loadOrders}>
              تحديث
            </AdminButton>
          </div>

          {/* Filter tabs */}
          <div className="mt-5 flex gap-2 flex-wrap">
            {(["all", "cash", "instapay"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex items-center gap-1.5 rounded-2xl border px-4 py-2 text-xs font-bold transition-all ${
                  filter === tab
                    ? "border-blue-500/30 bg-blue-500/15 text-blue-300"
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {tab === "all" && <Package size={13} />}
                {tab === "cash" && <Banknote size={13} />}
                {tab === "instapay" && <Smartphone size={13} />}
                {tab === "all" ? "الكل" : tab === "cash" ? "كاش" : "InstaPay"}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {(statusMessage || errorMessage) && (
            <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${errorMessage ? "border-rose-500/20 bg-rose-500/10 text-rose-200" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"}`}>
              {errorMessage || statusMessage}
            </div>
          )}

          {/* List */}
          <div className="mt-6">
            {isLoading ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-400">
                جاري تحميل الطلبات...
              </div>
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-16 text-center">
                <ShoppingBag size={40} className="text-slate-600" />
                <p className="text-slate-400 font-bold">لا توجد طلبات بعد</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className={`relative flex flex-wrap items-start justify-between gap-4 rounded-2xl border p-4 transition-all ${
                      order.status === "pending"
                        ? "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/8"
                    }`}
                  >
                    {/* Left info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="font-black text-white">#{String(order.id).padStart(4, "0")}</span>
                        <span className="font-bold text-slate-300">— {order.customer_name}</span>
                        <PaymentBadge method={order.payment_method} />
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5"><Phone size={11} /><span dir="ltr">{order.phone}</span></span>
                        <span className="flex items-center gap-1.5"><MapPin size={11} />{order.governorate}</span>
                        <span className="flex items-center gap-1.5"><Clock size={11} />{formatDate(order.created_at)}</span>
                        <span className="font-black text-white">{order.total.toLocaleString("ar-EG")} ج.م</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      <AdminButton variant="secondary" className="px-3 py-2 text-xs" icon={<Eye size={13} />} onClick={() => setSelectedOrder(order)}>
                        عرض
                      </AdminButton>
                      <AdminButton variant="danger" className="px-3 py-2 text-xs" icon={<Trash2 size={13} />} onClick={() => deleteOrder(order.id)}>
                        حذف
                      </AdminButton>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </AdminCard>
      </div>

      {/* ── Order Detail Modal ── */}
      {selectedOrder && (
        <AdminModal
          open={!!selectedOrder}
          onClose={() => { setSelectedOrder(null); setScreenshotOpen(false); }}
          title={`طلب #${String(selectedOrder.id).padStart(4, "0")}`}
          description={`${selectedOrder.customer_name} · ${formatDate(selectedOrder.created_at)}`}
        >
          <div className="space-y-5">
            {/* Status + Payment row */}
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={selectedOrder.status} />
              <PaymentBadge method={selectedOrder.payment_method} />
            </div>

            {/* Change status */}
            <div>
              <p className="mb-2 text-xs font-bold text-slate-400">تغيير الحالة:</p>
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s.value}
                    disabled={selectedOrder.status === s.value}
                    onClick={() => updateStatus(selectedOrder.id, s.value)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition ${
                      selectedOrder.status === s.value
                        ? `${s.color} opacity-60 cursor-default`
                        : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Customer info */}
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow label="الاسم" value={selectedOrder.customer_name} />
              <InfoRow label="الهاتف" value={selectedOrder.phone} dir="ltr" />
              <InfoRow label="المحافظة" value={selectedOrder.governorate} />
              <InfoRow label="العنوان" value={selectedOrder.address} />
            </div>

            {/* Order items */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="mb-3 text-xs font-bold text-slate-400">المنتجات ({selectedOrder.items.length})</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-3 py-2">
                    <span className="text-sm font-bold text-white line-clamp-1 flex-1">{item.name}</span>
                    <span className="text-xs text-slate-400 shrink-0">× {item.quantity}</span>
                    <span className="text-sm font-black text-blue-400 shrink-0">{(item.price * item.quantity).toLocaleString("ar-EG")} ج.م</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex justify-between border-t border-white/10 pt-3 text-sm font-black text-white">
                <span>الإجمالي</span>
                <span>{selectedOrder.total.toLocaleString("ar-EG")} ج.م</span>
              </div>
            </div>

            {/* InstaPay screenshot */}
            {selectedOrder.payment_method === "instapay" && (
              <div className="rounded-2xl border border-purple-500/20 bg-purple-500/10 p-4">
                <p className="mb-3 text-xs font-bold text-purple-300 flex items-center gap-2">
                  <Smartphone size={13} /> إيصال التحويل عبر InstaPay
                </p>
                {selectedOrder.payment_screenshot_url ? (
                  <>
                    <div
                      className="relative cursor-zoom-in rounded-xl overflow-hidden border border-purple-500/20 bg-black/20"
                      onClick={() => setScreenshotOpen(true)}
                    >
                      <Image
                        src={getOptimizedCloudinaryUrl(screenshotUrl(selectedOrder.payment_screenshot_url), 600, "orders")}
                        alt="إيصال InstaPay"
                        width={600}
                        height={400}
                        className="w-full max-h-60 object-contain"
                        unoptimized
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition">
                        <span className="opacity-0 hover:opacity-100 text-white text-xs font-black bg-black/60 px-3 py-1.5 rounded-lg">عرض كامل</span>
                      </div>
                    </div>
                    <p className="mt-2 text-[10px] text-purple-400 font-bold">اضغط على الصورة لعرضها بالحجم الكامل</p>
                  </>
                ) : (
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
                    <ImageIcon size={14} /> لم يتم رفع صورة الإيصال
                  </div>
                )}
              </div>
            )}

            {/* Delete */}
            <div className="flex justify-end border-t border-white/10 pt-4">
              <AdminButton variant="danger" icon={<Trash2 size={14} />} onClick={() => deleteOrder(selectedOrder.id)}>
                حذف الطلب
              </AdminButton>
            </div>
          </div>
        </AdminModal>
      )}

      {/* ── Full-screen screenshot lightbox ── */}
      {screenshotOpen && selectedOrder?.payment_screenshot_url && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setScreenshotOpen(false)}
        >
          <Image
            src={getOptimizedCloudinaryUrl(screenshotUrl(selectedOrder.payment_screenshot_url), 1600, "orders")}
            alt="إيصال InstaPay"
            width={1200}
            height={900}
            className="max-h-[90vh] max-w-full object-contain rounded-2xl"
            unoptimized
            onClick={(e) => e.stopPropagation()}
          />
          <button onClick={() => setScreenshotOpen(false)} className="absolute top-4 left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white font-black text-lg transition">
            ✕
          </button>
        </div>
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