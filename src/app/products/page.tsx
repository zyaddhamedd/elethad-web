"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useCart } from "@/context/CartContext";
import { CATEGORY_MAP } from "@/lib/products";
import { ProductGridSkeleton } from "@/components/Skeletons";
import { fetchStorefrontCategories, fetchStorefrontProducts, StorefrontCategory, StorefrontProduct } from "@/lib/storefront-api";
import { getOptimizedCloudinaryUrl } from "@/lib/utils";

// Lazy-load heavy footer (below fold)
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: true });

function ProductsContent() {
  const { addToCart } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get("category") || "all";

  const [categories, setCategories] = useState<StorefrontCategory[]>([]);
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [activeCategorySlug, setActiveCategorySlug] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("موصى به");
  const [isLoading, setIsLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isProductsLoading, setIsProductsLoading] = useState(true);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchStorefrontCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchStorefrontProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setIsProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categoryLabelBySlug = useMemo(() => {
    return categories.reduce<Record<string, string>>((accumulator, category) => {
      accumulator[category.slug] = category.name;
      return accumulator;
    }, {});
  }, [categories]);

  const handleCategoryChange = (slug: string) => {
    setIsLoading(true);
    setActiveCategorySlug(slug);
    if (slug === "all") {
      router.push("/products", { scroll: false });
    } else {
      router.push(`/products?category=${slug}`, { scroll: false });
    }
    // Brief loading state for UX feedback
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleProductClick = (slug: string) => {
    router.push(`/product/${slug}`);
  };

  // Filtering & sorting
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const normalizedProductCat = product.category.toLowerCase().trim();
      const normalizedSelectedCat = activeCategorySlug.toLowerCase().trim();
      const matchesCategory = normalizedSelectedCat === "all" || normalizedProductCat === normalizedSelectedCat;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (categoryLabelBySlug[normalizedProductCat] || CATEGORY_MAP[normalizedProductCat] || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sort
    if (sortBy === "السعر: الأقل") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "السعر: الأعلى") result = [...result].sort((a, b) => b.price - a.price);

    return result;
  }, [activeCategorySlug, searchQuery, sortBy, products, categoryLabelBySlug]);

  const isGridLoading = isLoading || isCategoriesLoading || isProductsLoading;

  return (
    <main className="min-h-screen bg-white selection:bg-blue-100 selection:text-navy pt-20" dir="rtl">
      <Navbar />

      {/* ══ Premium Filter Bar ══ */}
      <section className="sticky top-[64px] z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3">

          {/* Search — desktop */}
          <div className="relative group flex-shrink-0 md:w-56">
            <button className="md:hidden w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500" aria-label="بحث">
              <Search size={14} />
            </button>
            <div className="hidden md:block relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={13} />
              <input
                type="text"
                placeholder="ابحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-9 pl-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-slate-200 flex-shrink-0" />

          {/* Pills */}
          <div
            className="flex-1 overflow-x-auto no-scrollbar"
          >
            <div className="flex items-center gap-1.5 w-max">
              {/* "All" button */}
              <button
                onClick={() => handleCategoryChange("all")}
                className={`
                  flex-shrink-0 px-3 py-1 rounded-full
                  text-[10px] md:text-[11px] font-black whitespace-nowrap
                  transition-all duration-200 active:scale-95
                  ${activeCategorySlug === "all"
                    ? "bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  }
                `}
              >
                الكل
              </button>

              {/* Fetched categories */}
              {isCategoriesLoading ? (
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 h-8 w-24 bg-slate-200 rounded-full animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                categories.map(category => {
                  const isActive = activeCategorySlug === category.slug;
                  return (
                    <button
                      key={category.slug}
                      onClick={() => handleCategoryChange(category.slug)}
                      className={`
                        flex-shrink-0 px-3 py-1 rounded-full
                        text-[10px] md:text-[11px] font-black whitespace-nowrap
                        transition-all duration-200 active:scale-95
                        ${isActive
                          ? "bg-blue-600 text-white shadow-[0_2px_8px_rgba(37,99,235,0.3)]"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }
                      `}
                    >
                      {category.name}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Mobile search bar */}
        {searchQuery.length > 0 && (
          <div className="md:hidden px-3 pb-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={12} />
              <input
                type="text"
                placeholder="ابحث عن مضخة أو غاطس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-8 pl-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-400 transition-all"
              />
            </div>
          </div>
        )}
      </section>

      {/* Product Grid */}
      <section className="py-20 bg-slate-50/50 min-h-[600px]">
        <div className="container mx-auto px-6">

          <div className="flex justify-between items-center mb-10">
            <h2 className="text-slate-900 font-black text-xl">النتائج ({filteredProducts.length})</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">ترتيب حسب:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-blue-600 font-black text-sm outline-none cursor-pointer focus:ring-0"
              >
                <option>موصى به</option>
                <option>السعر: الأقل</option>
                <option>السعر: الأعلى</option>
              </select>
            </div>
          </div>

          {/* Show skeleton while loading category change */}
          {isGridLoading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product, index) => (
                  <div key={product.id}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.16) }}
                      onClick={() => handleProductClick(product.slug)}
                      className="group/card relative h-[320px] md:h-[440px] rounded-2xl md:rounded-[2rem] bg-gradient-to-b from-white to-[#f4f7fb] border border-white shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col hover:-translate-y-2 cursor-pointer"
                    >
                      <div className="absolute top-2 right-2 md:top-5 md:right-5 z-20 flex flex-col md:flex-row gap-1 md:gap-2">
                        {product.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 md:px-3 md:py-1.5 bg-white/70 backdrop-blur-md rounded-full text-[9px] md:text-xs font-black text-slate-700 shadow-sm border border-white/50">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex-grow flex items-center justify-center relative p-4">
                        <div className="relative w-full h-full">
                          <Image
                            src={getOptimizedCloudinaryUrl(product.image || product.image_url, 600, "products") || "/products/smart_pump.png"}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 45vw, (max-width: 1024px) 30vw, 22vw"
                            className="object-contain p-2 mix-blend-multiply contrast-[1.08] pointer-events-none group-hover/card:scale-110 transition-transform duration-700"
                            loading={index < 4 ? "eager" : "lazy"}
                            quality={80}
                          />
                        </div>
                      </div>

                      <div className="p-4 md:p-6 bg-white/60 backdrop-blur-sm rounded-b-2xl md:rounded-b-[2rem] border-t border-slate-100">
                        <p className="text-[10px] md:text-xs font-black text-slate-400 mb-1">
                          {categoryLabelBySlug[product.category] || CATEGORY_MAP[product.category] || product.category}
                        </p>
                        <h4 className="text-xs md:text-lg font-black text-slate-800 leading-tight mb-2 line-clamp-1">{product.name}</h4>
                        <div className="flex items-center justify-between">
                          <p className="text-sm md:text-xl font-black text-blue-600">{product.price.toLocaleString("ar-EG")} ج.م</p>
                          <button
                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                            className="p-2 md:px-4 md:py-2 bg-slate-900 text-white rounded-full text-[10px] md:text-xs font-black hover:bg-blue-600 transition-colors"
                          >
                            <span className="hidden md:inline">أضف للسلة</span>
                            <span className="md:hidden">+</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {!isGridLoading && filteredProducts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-40 text-center">
              <h3 className="text-3xl font-black text-slate-900 mb-4">لا توجد نتائج</h3>
              <button onClick={() => handleCategoryChange("all")} className="px-8 py-3 bg-blue-600 text-white rounded-full font-black">إعادة ضبط الفلاتر</button>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white pt-24 px-6" dir="rtl">
        <div className="container mx-auto">
          <ProductGridSkeleton count={8} />
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
