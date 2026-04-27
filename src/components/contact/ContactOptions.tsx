"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Phone, Send } from "lucide-react";
import Link from "next/link";

const options = [
  {
    title: "واتساب",
    desc: "أسرع وسيلة للتواصل مع فريق المبيعات والدعم الفني.",
    icon: <MessageCircle className="w-10 h-10 text-green-500" />,
    cta: "تحدث معنا الآن",
    href: "https://wa.me/yournumber",
    color: "hover:border-green-400"
  },
  {
    title: "اتصال مباشر",
    desc: "تحدث مع أحد خبرائنا فوراً للحصول على استشارة سريعة.",
    icon: <Phone className="w-10 h-10 text-blue-500" />,
    cta: "اتصل بنا",
    href: "tel:+123456789",
    color: "hover:border-blue-400"
  },
  {
    title: "إرسال رسالة",
    desc: "راسلنا عبر البريد الإلكتروني وسنقوم بالرد خلال 24 ساعة.",
    icon: <Send className="w-10 h-10 text-purple-500" />,
    cta: "أرسل إيميل",
    href: "mailto:info@example.com",
    color: "hover:border-purple-400"
  }
];

const ContactOptions = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`p-8 rounded-3xl bg-slate-50 border border-slate-100 transition-all duration-300 shadow-sm hover:shadow-xl ${option.color} group`}
            >
              <div className="mb-6 p-4 bg-white rounded-2xl w-fit shadow-sm group-hover:shadow-md transition-shadow">
                {option.icon}
              </div>
              <h3 className="text-2xl font-bold text-navy mb-4">{option.title}</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {option.desc}
              </p>
              <Link href={option.href} target={option.href.startsWith("http") ? "_blank" : undefined}>
                <button className="w-full py-4 bg-white border border-slate-200 text-navy font-bold rounded-xl hover:bg-navy hover:text-white transition-all">
                  {option.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactOptions;
