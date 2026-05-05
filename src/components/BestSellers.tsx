"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { fetchStorefrontProducts, StorefrontProduct } from "@/lib/storefront-api";
import { getOptimizedCloudinaryUrl } from "@/lib/utils";

export default function BestSellers() {
  const { addToCart } = useCart();
  const router = useRouter();
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStorefrontProducts()
      .then((data) => {
        // Show up to 4 products, sorted by rating descending
        const sorted = [...data].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        setProducts(sorted.slice(0, 4));
      })
      .catch((err) => console.error("BestSellers fetch error:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleProductClick = (slug: string) => {
    router.push(`/product/${slug}`);
  };

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-16 gap-4 md:gap-6 border-b border-slate-100 pb-4 md:pb-8">
          <div>
            <h2 className="text-xs md:text-sm font-bold text-primary tracking-wider uppercase mb-1 md:mb-3">الأعلى تقييماً</h2>
            <h3 className="text-2xl md:text-4xl font-black text-navy">
              المنتجات الأكثر مبيعاً
            </h3>
          </div>
          <Link href="/products">
            <button className="px-4 py-2 text-sm md:text-base md:px-6 md:py-3 bg-slate-50 text-navy rounded-full font-bold border border-slate-200 hover:border-primary/50 hover:bg-white hover:shadow-sm transition-all flex items-center gap-2">
              عرض كل المنتجات <ArrowLeft size={16} className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </Link>
        </div>

        {/* Loading skeleton */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[300px] md:h-[440px] rounded-2xl md:rounded-[2rem] bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-bold">
            لا توجد منتجات متاحة حالياً
          </div>
        ) : (
          /* Mobile: 2-Column Grid, Desktop: 4-Column Grid */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.24) }}
                className="group w-full"
              >
                <div
                  onClick={() => handleProductClick(product.slug)}
                  className="group/card relative h-[300px] md:h-[440px] rounded-2xl md:rounded-[2rem] bg-gradient-to-b from-white to-[#f4f7fb] border border-white shadow-[0_10px_30px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.15),inset_0_1px_0_rgba(255,255,255,1)] transition-all duration-500 flex flex-col hover:-translate-y-1 md:hover:-translate-y-2 cursor-pointer pointer-events-auto"
                >
                  {/* Badges */}
                  <div className="absolute top-2 right-2 md:top-5 md:right-5 z-20 flex flex-col md:flex-row gap-1 md:gap-2">
                    {product.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 md:px-3 md:py-1.5 bg-white/70 backdrop-blur-md rounded-full text-[9px] md:text-xs font-bold text-slate-700 shadow-sm border border-white/50">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => { e.stopPropagation(); }}
                    className="absolute top-2 left-2 md:top-5 md:left-5 z-20 w-7 h-7 md:w-9 md:h-9 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-white transition-all shadow-sm border border-white/50 hover:scale-110"
                    aria-label="إضافة للمفضلة"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                  </button>

                  {/* Product Image Section */}
                  <div className="flex-grow flex items-center justify-center relative px-2 pt-8 pb-2 md:px-6 md:pt-12 md:pb-4">
                    {/* Blue glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-40 md:h-40 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.2)_0%,transparent_70%)] rounded-full transition-all duration-500 group-hover/card:scale-125 group-hover/card:opacity-100 opacity-60 pointer-events-none" />

                    <div className="relative w-full h-full flex items-center justify-center transition-transform duration-700 group-hover/card:scale-[1.08] group-hover/card:-translate-y-1 md:group-hover/card:-translate-y-2">
                      {/* Shadow */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[75%] h-2 md:h-3 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.12)_0%,transparent_70%)] rounded-[100%] transition-all duration-500 group-hover/card:opacity-50 pointer-events-none" />

                      <Image
                        src={getOptimizedCloudinaryUrl(product.image || product.image_url, 600, "products") || "/products/smart_pump.png"}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 45vw, (max-width: 1024px) 22vw, 22vw"
                        className="object-contain p-2 mix-blend-multiply contrast-[1.08] drop-shadow-[0_15px_15px_rgba(0,0,0,0.08)] pointer-events-none"
                        loading={index < 2 ? "eager" : "lazy"}
                        quality={80}
                      />
                    </div>
                  </div>

                  {/* Info Panel */}
                  <div className="relative z-10 bg-slate-50/90 backdrop-blur-md mx-1.5 mb-1.5 p-3 md:mx-2 md:mb-2 md:p-5 rounded-xl md:rounded-[1.5rem] border border-slate-200/60 shadow-[inset_0_1px_0_rgba(255,255,255,1)] transition-transform duration-500 group-hover/card:-translate-y-1 flex flex-col justify-between">
                    <div className="mb-2 md:mb-4">
                      <p className="text-[9px] md:text-xs font-bold text-slate-400 mb-0.5 md:mb-1.5">{product.category}</p>
                      <h4 className="text-[11px] sm:text-xs md:text-lg font-extrabold text-slate-800 leading-tight mb-1 md:mb-2 line-clamp-1">{product.name}</h4>
                      <p className="text-[13px] sm:text-sm md:text-xl font-black text-blue-600 tracking-tight">{product.price.toLocaleString("ar-EG")} ج.م</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 md:pt-3 border-t border-slate-200/80">
                      <div className="flex items-center gap-0.5 md:gap-1.5">
                        <Star className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] md:text-sm font-bold text-slate-700">{product.rating}</span>
                        <span className="text-[9px] md:text-xs font-bold text-slate-400 hidden sm:inline-block">({product.reviews})</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="relative z-20 w-6 h-6 md:w-auto md:h-auto md:px-4 md:py-2 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center justify-center hover:bg-blue-600 hover:shadow-[0_8px_20px_-6px_rgba(37,99,235,0.6)] hover:scale-105 transition-all duration-300"
                      >
                        <span className="hidden md:inline">أضف للسلة</span>
                        <span className="md:hidden text-[16px] leading-none mb-0.5">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
