"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import motorImg from "../../assets/hero.webp";
import filterImg from "../../assets/hero2.webp";
import systemImg from "../../assets/hero3.webp";
import { fetchStorefrontCategories, StorefrontCategory } from "@/lib/storefront-api";
import { getOptimizedCloudinaryUrl } from "@/lib/utils";

const fallbackImages = [motorImg, filterImg, systemImg];

const categoryDescriptions: { [key: string]: string } = {
  "boost-pumps": "حلول مثالية لزيادة ضغط المياه في الأدوار العليا",
  "holmen-submersible": "مضخات غاطسة بتكنولوجيا هولمن المتطورة",
  "cast-iron-stainless-submersible": "مزيج القوة والمتانة لرفع المياه",
  "holmen-deep-well": "لسحب المياه من الآبار والأعماق الكبيرة",
  "full-cast-iron-submersible": "للتحمل الشاق في أصعب الظروف",
  "full-stainless-submersible": "مقاومة كاملة للصدأ وعمر افتراضي طويل",
};

export default function Categories() {
  const [categories, setCategories] = useState<StorefrontCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchStorefrontCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCategories();
  }, []);

  return (
    <section className="pt-8 pb-20 bg-[#f8fafc] relative overflow-hidden" dir="rtl">
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-[1200px]">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">تصنيفات المنتجات</h2>
          <p className="text-slate-500 font-medium">اكتشف مجموعتنا الواسعة من الحلول المتكاملة للمياه</p>
        </div>

        {/* Grid - 2 cols on mobile, 3 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {isLoading ? (
            // Loading skeleton
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="col-span-1 h-[220px] md:h-[300px] rounded-3xl bg-slate-200 animate-pulse"
              />
            ))
          ) : (
            categories.map((cat, index) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2), ease: "easeOut" }}
                className="col-span-1"
              >
                <Link href={`/products?category=${cat.slug}`}>
                  <div className="group relative h-[220px] md:h-[300px] rounded-3xl bg-[linear-gradient(145deg,#f1f5f9,#e6edf5)] border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.05),0_2px_6px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04),0_0_20px_rgba(37,99,235,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] hover:bg-[linear-gradient(145deg,#f4f7fb,#eef2f6)] transition-all duration-500 overflow-hidden cursor-pointer flex flex-col justify-end hover:-translate-y-1 hover:scale-[1.01]">
                    
                    {/* Subtle Noise Texture Overlay (CSS-only) */}
                    <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MDAlJyBoZWlnaHQ9JzQwMCUnPgo8ZmlsdGVyIGlkPSdub2lzZSc+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuOScgbnVtT2N0YXZlcz0nMycgc3RpdGNoVGlsZXM9J3N0aXRjaCcvPjwvZmlsdGVyPgo8cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbm9pc2UpJy8+Cjwvc3ZnPg==')]" />

                    {/* Product Image Layer */}
                    <div className="absolute top-4 md:top-6 left-1/2 -translate-x-1/2 h-[50%] md:h-[55%] w-[80%] md:w-[60%] flex items-center justify-center z-10 transition-transform duration-500 group-hover:scale-[1.03] before:absolute before:inset-[-20%] before:bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.15)_0%,transparent_70%)] before:-z-10">
                      
                      {/* Pure CSS faint reflection shadow under the product */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[60%] h-2 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.12)_0%,transparent_70%)] rounded-[100%] transition-opacity duration-500 group-hover:opacity-70" />
                      
                      <Image 
                        src={cat.image_url ? getOptimizedCloudinaryUrl(cat.image_url, 800, "categories") : fallbackImages[index % fallbackImages.length]} 
                        alt={cat.name} 
                        fill 
                        sizes="(max-width: 768px) 40vw, 25vw"
                        className="object-contain contrast-[1.05] drop-shadow-[0_15px_15px_rgba(0,0,0,0.1)]" 
                        loading={index < 2 ? "eager" : "lazy"}
                        quality={75}
                      />
                    </div>

                    {/* Content Area */}
                    <div className="relative z-30 p-5 md:p-6 w-full">
                      
                      {/* Divider Line */}
                      <div className="w-8 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full mb-3" />
                      
                      <h4 className="text-sm sm:text-base md:text-lg font-extrabold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors duration-300 leading-tight">{cat.name}</h4>
                      <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed mb-3">{cat.description || categoryDescriptions[cat.slug] || "تصنيف منتجات متميز"}</p>
                      
                      {/* CTA */}
                      <div className="hidden md:flex items-center gap-2 text-xs text-blue-600 font-bold opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 mt-1">
                        <span>تصفح التصنيف</span>
                        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
