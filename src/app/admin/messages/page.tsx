"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  Trash2,
  CheckCheck,
  Clock,
  MessageSquare,
  Phone,
  MapPin,
  Wrench,
  Mail,
  Eye,
  X,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminModal } from "@/components/admin/AdminModal";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Message {
  id: number;
  name: string;
  phone: string;
  province?: string;
  service?: string;
  message?: string;
  status: "new" | "read" | "replied";
  created_at: string;
}

// ─────────────────────────────────────────────
// Status badge
// ─────────────────────────────────────────────
const STATUS_LABELS: Record<Message["status"], string> = {
  new: "جديد",
  read: "تمت القراءة",
  replied: "تم الرد",
};

const STATUS_CLASSES: Record<Message["status"], string> = {
  new: "bg-blue-500/15 text-blue-300 border-blue-500/20",
  read: "bg-amber-500/15 text-amber-300 border-amber-500/20",
  replied: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
};

function StatusBadge({ status }: { status: Message["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${STATUS_CLASSES[status]}`}
    >
      {status === "new" && <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />}
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const loadMessages = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/messages", { cache: "no-store" });
      if (!res.ok) throw new Error(`فشل التحميل (${res.status})`);
      const data = await res.json();
      const list: Message[] = Array.isArray(data) ? data : data.messages || [];
      setMessages(list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "تعذر تحميل الرسائل.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const updateStatus = async (id: number, status: Message["status"]) => {
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status } : m))
      );
      if (selectedMessage?.id === id) {
        setSelectedMessage((prev) => prev ? { ...prev, status } : prev);
      }
      setStatusMessage("تم تحديث الحالة بنجاح.");
    } catch {
      setErrorMessage("تعذر تحديث الحالة.");
    }
  };

  const deleteMessage = async (id: number) => {
    if (!window.confirm("هل تريد حذف هذه الرسالة نهائياً؟")) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
      setStatusMessage("تم حذف الرسالة بنجاح.");
    } catch {
      setErrorMessage("تعذر حذف الرسالة.");
    }
  };

  const handleOpenMessage = (msg: Message) => {
    setSelectedMessage(msg);
    // mark as read automatically if still new
    if (msg.status === "new") {
      updateStatus(msg.id, "read");
    }
  };

  const newCount = messages.filter((m) => m.status === "new").length;

  const formatDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat("ar-EG", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  return (
    <AdminShell title="الرسائل" subtitle="رسائل العملاء والمهتمين في مكان واحد بطريقة واضحة ومرتبة.">
      <div className="space-y-6">
        <AdminCard>
          {/* ── Header ── */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">
                صندوق الرسائل
                {newCount > 0 && (
                  <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-black text-white">
                    {newCount}
                  </span>
                )}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                الرسائل الواردة من صفحة تواصل معنا مباشرةً.
              </p>
            </div>

            <AdminButton
              variant="ghost"
              icon={<RefreshCw size={16} />}
              onClick={loadMessages}
            >
              تحديث
            </AdminButton>
          </div>

          {/* ── Feedback banner ── */}
          {(statusMessage || errorMessage) && (
            <div
              className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${
                errorMessage
                  ? "border-rose-500/20 bg-rose-500/10 text-rose-200"
                  : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {errorMessage || statusMessage}
            </div>
          )}

          {/* ── Body ── */}
          <div className="mt-6">
            {isLoading ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-400">
                جاري تحميل الرسائل...
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-16 text-center">
                <MessageSquare size={40} className="text-slate-600" />
                <p className="text-slate-400 font-bold">لا توجد رسائل بعد</p>
                <p className="text-slate-500 text-sm">
                  ستظهر هنا الرسائل التي يرسلها العملاء من صفحة تواصل معنا.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`group relative flex items-start justify-between gap-4 rounded-2xl border p-4 transition-all duration-200 ${
                      msg.status === "new"
                        ? "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10"
                        : "border-white/10 bg-white/5 hover:bg-white/8"
                    }`}
                  >
                    {/* New indicator */}
                    {msg.status === "new" && (
                      <span className="absolute right-4 top-4 h-2 w-2 animate-pulse rounded-full bg-blue-400" />
                    )}

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="font-black text-white">{msg.name}</span>
                        <StatusBadge status={msg.status} />
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock size={11} />
                          {formatDate(msg.created_at)}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Phone size={11} />
                          <span dir="ltr">{msg.phone}</span>
                        </span>
                        {msg.province && (
                          <span className="flex items-center gap-1.5">
                            <MapPin size={11} />
                            {msg.province}
                          </span>
                        )}
                        {msg.service && (
                          <span className="flex items-center gap-1.5">
                            <Wrench size={11} />
                            {msg.service}
                          </span>
                        )}
                      </div>

                      {msg.message && (
                        <p className="mt-2 line-clamp-1 text-sm text-slate-400">
                          {msg.message}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      <AdminButton
                        variant="secondary"
                        className="px-3 py-2 text-xs"
                        icon={<Eye size={13} />}
                        onClick={() => handleOpenMessage(msg)}
                      >
                        عرض
                      </AdminButton>

                      {msg.status !== "replied" && (
                        <AdminButton
                          variant="ghost"
                          className="px-3 py-2 text-xs text-emerald-400 hover:text-emerald-300"
                          icon={<CheckCheck size={13} />}
                          onClick={() => updateStatus(msg.id, "replied")}
                        >
                          تم الرد
                        </AdminButton>
                      )}

                      <AdminButton
                        variant="danger"
                        className="px-3 py-2 text-xs"
                        icon={<Trash2 size={13} />}
                        onClick={() => deleteMessage(msg.id)}
                      >
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

      {/* ── Message Detail Modal ── */}
      {selectedMessage && (
        <AdminModal
          open={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          title="تفاصيل الرسالة"
          description={`من: ${selectedMessage.name} · ${formatDate(selectedMessage.created_at)}`}
        >
          <div className="space-y-5">
            {/* Status row */}
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={selectedMessage.status} />
              <div className="flex gap-2">
                {selectedMessage.status !== "read" && (
                  <button
                    onClick={() => updateStatus(selectedMessage.id, "read")}
                    className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/20 transition"
                  >
                    تمت القراءة
                  </button>
                )}
                {selectedMessage.status !== "replied" && (
                  <button
                    onClick={() => updateStatus(selectedMessage.id, "replied")}
                    className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
                  >
                    تم الرد
                  </button>
                )}
              </div>
            </div>

            {/* Info grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoRow icon={<Mail size={14} />} label="الاسم" value={selectedMessage.name} />
              <InfoRow icon={<Phone size={14} />} label="الهاتف" value={selectedMessage.phone} dir="ltr" />
              {selectedMessage.province && (
                <InfoRow icon={<MapPin size={14} />} label="المحافظة" value={selectedMessage.province} />
              )}
              {selectedMessage.service && (
                <InfoRow icon={<Wrench size={14} />} label="الخدمة المطلوبة" value={selectedMessage.service} />
              )}
            </div>

            {/* Message body */}
            {selectedMessage.message && (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="mb-2 text-xs font-bold text-slate-400">نص الرسالة</p>
                <p className="whitespace-pre-wrap text-sm text-slate-200 leading-relaxed">
                  {selectedMessage.message}
                </p>
              </div>
            )}

            {/* Quick actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <a
                href={`tel:${selectedMessage.phone}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition"
              >
                <Phone size={15} />
                اتصال الآن
              </a>

              <AdminButton
                variant="danger"
                icon={<Trash2 size={14} />}
                onClick={() => deleteMessage(selectedMessage.id)}
              >
                حذف الرسالة
              </AdminButton>
            </div>
          </div>
        </AdminModal>
      )}
    </AdminShell>
  );
}

// ─────────────────────────────────────────────
// Helper: single info row inside the modal
// ─────────────────────────────────────────────
function InfoRow({
  icon,
  label,
  value,
  dir,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  dir?: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
      <p className="mb-1 flex items-center gap-1.5 text-xs font-bold text-slate-400">
        {icon}
        {label}
      </p>
      <p className="text-sm font-bold text-white" dir={dir}>
        {value}
      </p>
    </div>
  );
}