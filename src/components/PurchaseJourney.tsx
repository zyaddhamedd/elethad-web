"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Search, SlidersHorizontal, CreditCard, Truck } from "lucide-react";
import { useRef } from "react";

const steps = [
  {
    id: 1,
    title: "اكتشف وقارن",
    description: "تصفح مجموعتنا المتميزة من المواتير والفلاتر. استخدم أداة المقارنة الذكية للعثور على ما تحتاجه بالضبط.",
    icon: Search,
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: 2,
    title: "تخصيص المواصفات",
    description: "قم بتخصيص الجهد الكهربائي ومعدل التدفق والملحقات الإضافية لتتناسب مع متطلباتك بشكل مثالي.",
    icon: SlidersHorizontal,
    color: "from-cyan-400 to-teal-400"
  },
  {
    id: 3,
    title: "دفع آمن",
    description: "أكمل عملية الشراء باستخدام نظام الدفع الآمن الخاص بنا. تتوفر خيارات دفع متعددة.",
    icon: CreditCard,
    color: "from-teal-400 to-emerald-400"
  },
  {
    id: 4,
    title: "توصيل سريع وتركيب",
    description: "احصل على طلبك بسرعة. يتوفر تركيب احترافي من قبل الفنيين المعتمدين لدينا في مناطق مختارة.",
    icon: Truck,
    color: "from-blue-600 to-indigo-500"
  },
];

export default function PurchaseJourney() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="py-24 md:py-32 bg-[#f8fafc] relative overflow-hidden" dir="rtl">
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} 
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[20%] right-[10%] w-[30rem] h-[30rem] bg-blue-400/5 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }} 
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[20%] left-[10%] w-[30rem] h-[30rem] bg-cyan-400/5 rounded-full blur-[100px]" 
        />
      </div>

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className="text-center mb-20 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200/50 shadow-sm text-blue-600 font-bold text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              عملية الشراء
            </div>
            
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.2] tracking-tight">
              من الاختيار إلى{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 to-cyan-500">الكمال.</span>
            </h3>
          </motion.div>
        </div>

        <div className="relative">
          {/* Static Background Line */}
          <div className="absolute right-[38px] md:right-1/2 top-0 bottom-0 w-1 bg-slate-200/50 rounded-full md:translate-x-1/2" />

          {/* Animated Scroll Line */}
          <motion.div 
            className="absolute right-[38px] md:right-1/2 top-0 w-1 bg-gradient-to-b from-blue-500 via-cyan-400 to-blue-600 rounded-full md:translate-x-1/2 origin-top shadow-[0_0_15px_rgba(37,99,235,0.5)] z-10"
            style={{ height: lineHeight }}
          />

          <div className="flex flex-col gap-16 md:gap-24 relative z-20">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className={`flex flex-col md:flex-row items-start md:items-center relative group ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                
                {/* Center Node / Icon */}
                <div className="absolute right-[15px] md:right-1/2 top-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-1/2 w-[50px] h-[50px] md:w-20 md:h-20 bg-white rounded-full border-4 border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex items-center justify-center z-30 transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-white relative overflow-hidden transition-colors duration-500">
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    <step.icon className="relative z-10 w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-1/2 pr-20 md:pr-0 ${
                  index % 2 === 0 ? "md:pl-16 md:text-right" : "md:pr-16 md:text-right"
                }`}>
                  <div className="bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 hover:shadow-[0_20px_40px_-10px_rgba(37,99,235,0.15)] hover:border-blue-200/60 transition-all duration-500 relative overflow-hidden hover:-translate-y-2">
                    
                    {/* Large Background Number */}
                    <span className="absolute -top-6 -left-4 text-[8rem] font-black text-slate-50 opacity-50 group-hover:text-blue-50/50 group-hover:-translate-y-4 transition-all duration-700 pointer-events-none select-none">
                      0{step.id}
                    </span>

                    <div className="relative z-10">
                      <h4 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{step.title}</h4>
                      <p className="text-slate-500 leading-relaxed font-medium text-sm md:text-base">{step.description}</p>
                    </div>

                    {/* Sweep Light Effect */}
                    <div className="absolute inset-0 -translate-x-[150%] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out z-20 pointer-events-none" />
                  </div>
                </div>

                {/* Number indicator (Desktop side floating) */}
                <div className={`hidden md:flex absolute top-1/2 -translate-y-1/2 w-1/2 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none ${
                  index % 2 === 0 ? "left-0 -translate-x-8 group-hover:translate-x-0" : "right-0 translate-x-8 group-hover:translate-x-0"
                }`}>
                  <span className="text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-200/40 to-transparent">
                    0{step.id}
                  </span>
                </div>

              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
