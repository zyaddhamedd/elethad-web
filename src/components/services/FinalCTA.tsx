"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, FileText } from "lucide-react";
import Link from "next/link";

const FinalCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-navy z-0" />
      
      {/* Animated Glows */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-[120px] z-10"
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2] 
        }}
        transition={{ duration: 15, repeat: Infinity, delay: 2 }}
        className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-300 rounded-full blur-[120px] z-10"
      />

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold mb-8 leading-tight"
          >
            جاهز تبدأ؟ <br className="md:hidden" /> 
            خلينا نجهزلك الحل المثالي
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-light"
          >
            سواء كنت تبحث عن نظام منزلي أو حلول للمشاريع الكبرى، فريقنا جاهز لتقديم الدعم والمشورة الفنية اللازمة.
          </motion.p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 hover:bg-blue-50 transition-colors"
              >
                <FileText className="w-6 h-6" />
                اطلب عرض سعر
              </motion.button>
            </Link>
            
            <Link href="https://wa.me/yournumber" className="block" target="_blank">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-10 py-5 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
                تواصل واتساب
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
