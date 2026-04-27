"use client";

import { motion } from "framer-motion";

const partners = [
  "AquaTech", "FlowPro", "HydroSystems", "PureWater", "EcoPumps", "LiquidDynamics", "AquaTech", "FlowPro", "HydroSystems", "PureWater"
];

export default function Partners() {
  return (
    <section className="py-12 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 mb-10 text-center relative z-10">
        <p className="text-[10px] md:text-xs font-black text-blue-500/60 uppercase tracking-[0.2em] mb-2">الشراكات الاستراتيجية</p>
        <h4 className="text-xl md:text-2xl font-black text-navy/20">رواد الصناعة حول العالم</h4>
      </div>
      
      <div className="relative flex overflow-x-hidden w-full before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-20 md:before:w-40 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-20 md:after:w-40 after:bg-gradient-to-l after:from-white after:to-transparent">
        <motion.div
          animate={{ x: ["0%", "50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
          className="flex whitespace-nowrap items-center min-w-max"
          dir="ltr"
        >
          {partners.concat(partners).map((partner, index) => (
            <div 
              key={index} 
              className="mx-8 md:mx-16 flex items-center justify-center opacity-20 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0 cursor-default group"
            >
              <span className="text-xl md:text-3xl font-black text-navy/40 group-hover:text-blue-600 transition-colors tracking-tighter">
                {partner.toUpperCase()}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
      
      {/* Decorative Line */}
      <div className="container mx-auto px-6 mt-12">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
      </div>
    </section>
  );
}
