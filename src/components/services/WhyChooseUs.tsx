"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, HeartHandshake, Award } from "lucide-react";

const features = [
  {
    title: "جودة مضمونة",
    text: "نلتزم بأعلى المعايير العالمية في جميع منتجاتنا وخدماتنا.",
    icon: <ShieldCheck className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "سرعة تنفيذ",
    text: "نقدر وقت عملائنا ونلتزم بالجداول الزمنية المحددة بدقة.",
    icon: <Zap className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "دعم مستمر",
    text: "علاقتنا تبدأ بعد البيع بتقديم أفضل خدمات الدعم والمتابعة.",
    icon: <HeartHandshake className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "خبرة عملية",
    text: "فريقنا يمتلك سنوات من الخبرة في أصعب المشاريع الهندسية.",
    icon: <Award className="w-10 h-10 text-blue-600" />,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-400/5 blur-[100px] -z-10" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center group"
            >
              <div className="mb-6 p-5 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-500">
                <div className="group-hover:text-white transition-colors duration-500">
                  {React.cloneElement(feature.icon as React.ReactElement, { 
                    className: "w-10 h-10 transition-colors duration-500 group-hover:text-white" 
                  })}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
