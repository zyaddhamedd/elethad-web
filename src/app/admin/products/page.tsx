"use client";

import { useEffect, useMemo, useState } from "react";
import { Image as ImageIcon, Plus, RefreshCw, Search, Trash2, Upload } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminCard";
import { AdminButton } from "@/components/admin/AdminButton";
import { AdminTable } from "@/components/admin/AdminTable";
import { AdminModal } from "@/components/admin/AdminModal";
import {
  Category,
  Product,
  ProductPayload,
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  updateProduct,
  uploadProductImage as uploadAdminProductImage,
} from "@/lib/admin-api";
import { getOptimizedCloudinaryUrl } from "@/lib/utils";

function createEmptyForm(categorySlug = "") {
  return {
    name: "",
    slug: "",
    category: categorySlug,
    price: "",
    rating: "0",
    reviews: "0",
    imageUrl: "",
    images: [] as string[],
    description: "",
  };
}

type ProductFormState = ReturnType<typeof createEmptyForm>;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductFormState>(createEmptyForm());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([fetchProducts(), fetchCategories()]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);

      setForm((current) => {
        if (current.category) {
          return current;
        }

        return createEmptyForm(fetchedCategories[0]?.slug || "");
      });
    } catch (error) {
      console.error("Failed to load products admin data:", error);
      setErrorMessage("تعذر تحميل المنتجات من الخادم.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categoryLabelBySlug = useMemo(() => {
    return categories.reduce<Record<string, string>>((accumulator, category) => {
      accumulator[category.slug] = category.name;
      return accumulator;
    }, {});
  }, [categories]);

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const categoryLabel = categoryLabelBySlug[product.category] || product.category;
      return [product.name, product.slug, product.category, categoryLabel].some((value) =>
        value.toLowerCase().includes(query)
      );
    });
  }, [categoryLabelBySlug, products, searchQuery]);

  const resetForm = (categorySlug = categories[0]?.slug || "") => {
    setForm(createEmptyForm(categorySlug));
    setEditingProduct(null);
    setErrorMessage(null);
  };

  const openCreateModal = () => {
    resetForm(categories[0]?.slug || "");
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug,
      category: product.category,
      price: String(product.price),
      rating: String(product.rating ?? 0),
      reviews: String(product.reviews ?? 0),
      imageUrl: product.image || product.image_url || "",
      images: product.images || (product.image || product.image_url ? [product.image || product.image_url || ""] : []),
      description: product.description || "",
    });
    setIsModalOpen(true);
    setErrorMessage(null);
  };

  const handleUploadImage = async (file: File) => {
    setStatusMessage("جاري رفع الصورة...");
    try {
      const uploaded = await uploadAdminProductImage(file);
      setForm((current) => ({
        ...current,
        imageUrl: current.imageUrl || uploaded.imageUrl,
        images: Array.from(new Set([...(current.images || []), uploaded.imageUrl])),
      }));
      setStatusMessage("تم رفع الصورة بنجاح.");
    } catch (error) {
      console.error("Image upload failed:", error);
      setStatusMessage(null);
      setErrorMessage("فشل رفع الصورة.");
    }
  };

  const handleUploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    for (const file of Array.from(files)) {
      // Upload sequentially so we can surface progress/errors per file.
      await handleUploadImage(file);
    }
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const payload: ProductPayload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        category: form.category.trim(),
        price: Number(form.price) || 0,
        imageUrl: form.imageUrl.trim() || undefined,
        description: form.description.trim() || undefined,
        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,
        tags: [],
        features: [],
        specs: [],
        images: (form.images.length > 0 ? form.images : form.imageUrl.trim() ? [form.imageUrl.trim()] : []).filter(Boolean),
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        setStatusMessage("تم تحديث المنتج بنجاح.");
      } else {
        await createProduct(payload);
        setStatusMessage("تم إنشاء المنتج بنجاح.");
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setForm(createEmptyForm(categories[0]?.slug || ""));
      await loadData();
    } catch (error) {
      console.error("Failed to save product:", error);
      setErrorMessage(error instanceof Error ? error.message : "تعذر حفظ المنتج.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(`هل تريد حذف المنتج "${product.name}"؟`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(product.id);
      setStatusMessage("تم حذف المنتج بنجاح.");
      await loadData();
    } catch (error) {
      console.error("Failed to delete product:", error);
      setErrorMessage("تعذر حذف المنتج.");
    }
  };

  return (
    <AdminShell title="المنتجات" subtitle="إدارة المنتجات، الصور، والأسعار من الأدمين مباشرة.">
      <div className="space-y-6">
        <AdminCard>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">قائمة المنتجات</h2>
              <p className="mt-1 text-sm text-slate-400">البيانات هنا مرتبطة بالـ backend مباشرة ومفيهاش placeholders.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="ابحث عن منتج..."
                  className="h-11 w-64 rounded-2xl border border-white/10 bg-white/5 px-10 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-blue-500/50"
                />
              </div>
              <AdminButton variant="ghost" icon={<RefreshCw size={16} />} onClick={loadData}>
                تحديث
              </AdminButton>
              <AdminButton variant="primary" icon={<Plus size={16} />} onClick={openCreateModal}>
                إضافة منتج
              </AdminButton>
            </div>
          </div>

          {(statusMessage || errorMessage) && (
            <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${errorMessage ? "border-rose-500/20 bg-rose-500/10 text-rose-200" : "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"}`}>
              {errorMessage || statusMessage}
            </div>
          )}

          <div className="mt-6">
            {isLoading ? (
              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 px-6 py-10 text-center text-slate-400">
                جاري تحميل المنتجات...
              </div>
            ) : (
              <AdminTable
                columns={[
                  { label: "الاسم" },
                  { label: "التصنيف" },
                  { label: "السعر" },
                  { label: "التقييم" },
                  { label: "الإجراءات", align: "center" },
                ]}
                rows={filteredProducts.map((product) => ({
                  id: product.id,
                  cells: [
                    <div key="name" className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                        {product.image ? (
                          <img src={getOptimizedCloudinaryUrl(product.image, 200, "products") || product.image} alt={product.name} className="h-full w-full object-contain p-1" />
                        ) : (
                          <ImageIcon size={18} className="text-slate-500" />
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-white">{product.name}</div>
                        <div className="text-xs text-slate-400">{product.slug}</div>
                      </div>
                    </div>,
                    categoryLabelBySlug[product.category] || product.category,
                    `${Number(product.price).toLocaleString("ar-EG")} ج.م`,
                    `${product.rating ?? 0} / 5`,
                    <div key="actions" className="flex items-center justify-center gap-2">
                      <AdminButton variant="secondary" className="px-3 py-2 text-xs" onClick={() => openEditModal(product)}>
                        تعديل
                      </AdminButton>
                      <AdminButton variant="danger" className="px-3 py-2 text-xs" onClick={() => handleDelete(product)} icon={<Trash2 size={14} />}>
                        حذف
                      </AdminButton>
                    </div>,
                  ],
                }))}
                className="mt-4"
              />
            )}
          </div>
        </AdminCard>
      </div>

      <AdminModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
          setErrorMessage(null);
        }}
        title={editingProduct ? "تعديل منتج" : "إضافة منتج"}
        description="املأ بيانات المنتج ثم احفظها لتظهر مباشرة على الموقع."
      >
        <div className="space-y-4">
          {errorMessage ? (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {errorMessage}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-bold text-slate-200">
              <span>الاسم</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500/50"
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-200">
              <span>Slug</span>
              <input
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500/50"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-bold text-slate-200">
              <span>التصنيف</span>
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500/50"
              >
                <option value="" className="bg-slate-950">اختر تصنيف</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug} className="bg-slate-950">
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-200">
              <span>السعر</span>
              <input
                type="number"
                min="0"
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500/50"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-bold text-slate-200">
              <span>التقييم</span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={form.rating}
                onChange={(event) => setForm((current) => ({ ...current, rating: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500/50"
              />
            </label>
            <label className="space-y-2 text-sm font-bold text-slate-200">
              <span>عدد التقييمات</span>
              <input
                type="number"
                min="0"
                value={form.reviews}
                onChange={(event) => setForm((current) => ({ ...current, reviews: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500/50"
              />
            </label>
          </div>

          <label className="space-y-2 text-sm font-bold text-slate-200">
            <span>الصورة</span>
            <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-slate-300">{form.imageUrl || "لم يتم رفع صورة بعد"}</div>
                  <div className="mt-1 text-xs text-slate-500">سيتم حفظ الصورة داخل `public/uploads/products`.</div>
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500">
                  <Upload size={15} />
                  رفع صور
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (event) => {
                      const input = event.currentTarget;
                      const files = input.files;
                      await handleUploadImages(files);
                      if (input) input.value = "";
                    }}
                  />
                </label>
              </div>
              {form.imageUrl ? (
                <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/30 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5">
                      <img src={getOptimizedCloudinaryUrl(form.imageUrl, 200, "products") || form.imageUrl} alt="preview" className="h-full w-full object-contain p-1" />
                    </div>
                    <div className="text-xs text-slate-400">تم ربط الصورة الأساسية بالمنتج، وستظهر في الموقع فور الحفظ.</div>
                  </div>
                  {form.images.length > 1 ? (
                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                      {form.images.map((image) => (
                        <button
                          type="button"
                          key={image}
                          onClick={() => setForm((current) => ({ ...current, imageUrl: image }))}
                          className={`overflow-hidden rounded-xl border transition ${image === form.imageUrl ? "border-blue-500 bg-blue-500/10" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                        >
                          <img src={getOptimizedCloudinaryUrl(image, 200, "products") || image} alt="gallery" className="h-16 w-full object-contain p-1 bg-white/5" />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {form.images.length > 0 ? (
                <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-400">
                  {form.images.map((image, index) => (
                    <span key={image} className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      صورة {index + 1}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </label>

          <label className="space-y-2 text-sm font-bold text-slate-200">
            <span>الوصف</span>
            <textarea
              rows={4}
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-blue-500/50"
            />
          </label>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <AdminButton
              type="button"
              variant="ghost"
              onClick={() => {
                setIsModalOpen(false);
                setEditingProduct(null);
              }}
            >
              إلغاء
            </AdminButton>
            <AdminButton type="button" variant="primary" onClick={handleSubmit} disabled={isSaving}>
              {isSaving ? "جاري الحفظ..." : editingProduct ? "تحديث" : "إضافة"}
            </AdminButton>
          </div>
        </div>
      </AdminModal>
    </AdminShell>
  );
}