"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "تواصل معنا",
    desc: "أخبرنا باحتياجك أو مشكلتك وسيقوم فريقنا بالرد عليك فوراً."
  },
  {
    number: "02",
    title: "تحليل احتياجك",
    desc: "نقوم بزيارة ميدانية ودراسة فنية لتحديد الحل الأمثل والأنسب."
  },
  {
    number: "03",
    title: "اختيار الحل",
    desc: "نقدم لك عرضاً فنياً ومالياً مفصلاً يضمن الكفاءة واقتصادية التكلفة."
  },
  {
    number: "04",
    title: "التنفيذ",
    desc: "يبدأ فريقنا الهندسي بتركيب الأنظمة وفق أعلى معايير الجودة."
  },
  {
    number: "05",
    title: "المتابعة",
    desc: "نستمر في متابعة الأداء وتقديم الصيانة لضمان عمل النظام بكفاءة."
  }
];

const ProcessTimeline = () => {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-4">كيف نعمل؟</h2>
          <p className="text-gray-500">خطوات مدروسة تضمن لك الحصول على أفضل النتائج</p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-5 gap-4 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-8 inline-block">
                  <div className="w-16 h-16 bg-white border-4 border-slate-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl group-hover:border-blue-500 transition-all duration-300 shadow-sm group-hover:shadow-blue-200 group-hover:shadow-lg">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed px-4">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-12 relative">
          {/* Vertical line */}
          <div className="absolute top-0 right-8 w-0.5 h-full bg-slate-100 z-0" />
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative flex items-start gap-6 pr-4"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold z-10 mt-1">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
