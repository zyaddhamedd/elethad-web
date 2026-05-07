"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, RefreshCw } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminModal } from "@/components/admin/AdminModal";
import {
  Category,
  createCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
  uploadCategoryImage,
} from "@/lib/admin-api";

type CategoryFormState = {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
};

const emptyForm: CategoryFormState = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "فشل في تحميل الأقسام");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    void (async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCategories();
        if (isActive) {
          setCategories(data);
        }
      } catch (fetchError) {
        if (isActive) {
          setError(fetchError instanceof Error ? fetchError.message : "فشل في تحميل الأقسام");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError(null);
    setFormOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setForm({ 
      name: category.name, 
      slug: category.slug,
      description: category.description || "",
      imageUrl: category.image_url || "",
    });
    setFormError(null);
    setFormOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setFormOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const name = form.name.trim();
    const slug = form.slug.trim();

    if (!name || !slug) {
      setFormError("الاسم والـ slug مطلوبان");
      return;
    }

    setSubmitting(true);

    try {
      const payload = { 
        name, 
        slug,
        description: form.description?.trim() || undefined,
        imageUrl: form.imageUrl || undefined,
      };

      if (editingCategory) {
        const updated = await updateCategory(editingCategory.id, payload);
        setCategories((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await createCategory(payload);
        setCategories((current) => [created, ...current]);
      }

      closeModal();
    } catch (submitError) {
      setFormError(submitError instanceof Error ? submitError.message : "تعذر حفظ القسم");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const confirmed = window.confirm(`هل تريد حذف القسم «${category.name}»؟`);
    if (!confirmed) return;

    try {
      await deleteCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "تعذر حذف القسم");
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError(null);

    try {
      const result = await uploadCategoryImage(file);
      setForm((current) => ({ ...current, imageUrl: result.imageUrl }));
    } catch (uploadError) {
      setFormError(uploadError instanceof Error ? uploadError.message : "تعذر رفع الصورة");
    } finally {
      setUploadingImage(false);
    }
  };

  const rows = categories.map((category) => ({
    id: category.id,
    cells: [
      <div key="name" className="space-y-1">
        <p className="font-black text-white">{category.name}</p>
        <p className="text-xs text-slate-500">#{category.id}</p>
      </div>,
      <span key="slug" className="font-mono text-sm text-slate-300">{category.slug}</span>,
      <span key="created" className="text-slate-300">
        {category.created_at ? new Date(category.created_at).toLocaleDateString("ar-EG") : "—"}
      </span>,
      <div key="actions" className="flex items-center justify-center gap-2">
        <AdminButton
          variant="secondary"
          className="px-3 py-2 text-xs"
          icon={<Pencil size={14} />}
          onClick={() => openEditModal(category)}
        >
          تعديل
        </AdminButton>
        <AdminButton
          variant="danger"
          className="px-3 py-2 text-xs"
          icon={<Trash2 size={14} />}
          onClick={() => void handleDelete(category)}
        >
          حذف
        </AdminButton>
      </div>,
    ],
  }));

  return (
    <AdminShell title="الأقسام" subtitle="تنظيم الأقسام يساعد على عرض المحتوى بشكل أوضح للمستخدمين.">
      <div className="space-y-4 sm:space-y-6">
        <AdminCard>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-black text-white">إدارة الأقسام</h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-400">اتصال مباشر بالخادم مع إضافة وتعديل وحذف فوري.</p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <AdminButton
                variant="secondary"
                size="sm"
                icon={<RefreshCw size={14} />}
                onClick={() => void loadCategories()}
                disabled={loading}
                className="flex-shrink-0"
              >
                تحديث
              </AdminButton>
              <AdminButton variant="primary" size="sm" icon={<Plus size={14} />} onClick={openCreateModal} className="flex-shrink-0">
                إضافة
              </AdminButton>
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            {loading ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-4 sm:px-6 py-8 sm:py-14 text-center text-slate-400">
                جاري تحميل الأقسام...
              </div>
            ) : error ? (
              <div className="rounded-[1.75rem] border border-rose-500/20 bg-rose-500/10 px-4 sm:px-6 py-8 sm:py-14 text-center text-rose-200">
                <p className="font-bold text-sm sm:text-base">{error}</p>
                <button
                  type="button"
                  onClick={() => void loadCategories()}
                  className="mt-3 sm:mt-4 inline-flex items-center rounded-2xl bg-rose-500/15 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-rose-100 transition-colors hover:bg-rose-500/25"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : (
              <AdminTable
                columns={[
                  { label: "الاسم" },
                  { label: "Slug" },
                  { label: "تاريخ الإنشاء" },
                  { label: "الإجراءات", align: "center" },
                ]}
                rows={rows}
              />
            )}
          </div>
        </AdminCard>
      </div>

      <AdminModal
        open={formOpen}
        onClose={closeModal}
        title={editingCategory ? "تعديل قسم" : "إضافة قسم جديد"}
        description="املأ الاسم والـ slug ثم احفظ للتحديث الفوري داخل الجدول."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-200">الاسم</label>
            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder="مثال: مضخات رفع مياه"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-200">Slug</label>
            <input
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
              placeholder="مثال: boost-pumps"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-200">الوصف</label>
            <input
              value={form.description || ""}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="وصف موجز للقسم"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-blue-500/50 focus:bg-white/10"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-200">صورة القسم</label>
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white file:mr-4 file:rounded-full file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-blue-700 disabled:opacity-50"
                />
              </div>
              {uploadingImage && (
                <span className="text-sm text-slate-400">جاري الرفع...</span>
              )}
            </div>
            {form.imageUrl && (
              <p className="text-xs text-green-400">✓ تم رفع الصورة بنجاح</p>
            )}
          </div>

          {formError ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-200">
              {formError}
            </div>
          ) : null}

          <div className="flex items-center justify-end gap-3 pt-2">
            <AdminButton type="button" variant="ghost" onClick={closeModal} disabled={submitting}>
              إلغاء
            </AdminButton>
            <AdminButton type="submit" variant="primary" disabled={submitting}>
              {submitting ? "جاري الحفظ..." : editingCategory ? "حفظ التعديل" : "إضافة"}
            </AdminButton>
          </div>
        </form>
      </AdminModal>
    </AdminShell>
  );
}