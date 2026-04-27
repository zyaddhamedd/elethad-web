"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, FileText } from "lucide-react";
import Link from "next/link";

const ContactCTA = () => {
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

      <div className="container mx-auto px-6 relative z-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black mb-8 leading-tight"
          >
            ابدأ الآن واحصل على <br /> استشارة مجانية
          </motion.h2>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Link href="https://wa.me/yournumber" className="block" target="_blank">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-10 py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
                تواصل واتساب
              </motion.button>
            </Link>

            <Link href="/contact" className="block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 hover:bg-blue-50 transition-colors"
              >
                <FileText className="w-6 h-6" />
                اطلب عرض سعر
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
