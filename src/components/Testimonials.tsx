"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "أحمد حسن",
    role: "مدير منشأة",
    content: "سلسلة مواتير ProFlow X غيّرت تماماً ضغط المياه في المبنى الخاص بنا. تشغيل صامت وكفاءة مذهلة. تستحق كل قرش.",
    rating: 5,
  },
  {
    id: 2,
    name: "سارة محمود",
    role: "صاحبة منزل",
    content: "قمنا بتركيب نظام الـ RO ذو السبع مراحل الشهر الماضي. الفرق في جودة المياه لا يوصف. فريق التركيب كان في قمة الاحترافية.",
    rating: 5,
  },
  {
    id: 3,
    name: "محمد السيد",
    role: "مهندس زراعي",
    content: "للأعمال الشاقة، مواتير الاتحاد الصناعية لا يعلى عليها. شغلناها بشكل مستمر لمدة ٦ أشهر دون أي عطل أو مشكلة.",
    rating: 4,
  },
  {
    id: 4,
    name: "ليلى إبراهيم",
    role: "مطورة عقارية",
    content: "التعامل مع الاتحاد كان تجربة ممتازة. الالتزام بالمواعيد والجودة الفائقة للمنتجات جعلنا نعتمد عليهم في جميع مشاريعنا.",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#f8fafc] relative overflow-hidden" dir="rtl">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc0MDAlJyBoZWlnaHQ9JzQwMCUnPgo8ZmlsdGVyIGlkPSdub2lzZSc+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuOScgbnVtT2N0YXZlcz0nMycgc3RpdGNoVGlsZXM9J3N0aXRjaCcvPjwvZmlsdGVyPgo8cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjbm9pc2UpJy8+Cjwvc3ZnPg==')]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-xs md:text-sm font-bold text-primary tracking-widest uppercase mb-2">ثقة تتوارثها الأجيال</h2>
          <h3 className="text-2xl md:text-4xl font-black text-navy leading-tight">
            ماذا يقول عملاؤنا
          </h3>
          <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mt-4 rounded-full" />
        </div>

        {/* Grid - 2 columns on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8 max-w-[1400px] mx-auto">
          {testimonials.map((test, index) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="h-full bg-[linear-gradient(145deg,#ffffff,#f0f4f8)] p-4 md:p-8 rounded-2xl md:rounded-3xl border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.8)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-400 flex flex-col justify-between hover:-translate-y-1">
                
                <div className="relative mb-6">
                  <Quote className="absolute -top-2 -right-2 text-blue-500/10 transform scale-x-[-1]" size={40} />
                  
                  <div className="flex gap-0.5 mb-4 relative z-10">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={12} 
                        className={i < test.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-200"} 
                      />
                    ))}
                  </div>
                  
                  <p className="text-navy/80 text-[11px] sm:text-xs md:text-base leading-relaxed font-medium mb-6 relative z-10 italic">
                    "{test.content}"
                  </p>
                </div>
                
                <div className="flex items-center gap-2 md:gap-4 border-t border-slate-100 pt-4 mt-auto">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-black text-white text-[10px] md:text-lg shadow-md">
                    {test.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-navy text-[10px] md:text-sm">{test.name}</h5>
                    <p className="text-[9px] md:text-xs text-slate-500 font-medium">{test.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
