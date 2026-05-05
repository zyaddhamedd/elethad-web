"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Headphones } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Reduced bubble count for performance
const BUBBLE_COUNT = 5;

const ContactHero = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[85vh] flex items-center pt-32 pb-20 overflow-hidden bg-slate-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/contact-hero.png"
          alt="تواصل مع الاتحاد لأنظمة المياه"
          fill
          className="object-cover opacity-60"
          priority
          quality={80}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/40 to-slate-950/90 z-10" />
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-multiply z-10" />
      </div>

      {/* Animated Glow — only on desktop/non-reduced-motion */}
      {!shouldReduceMotion && (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-20" aria-hidden="true">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[100px]"
          />
        </div>
      )}

      <div className="container mx-auto px-6 relative z-30">
        <div className="max-w-4xl mr-auto text-left">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight">
              تواصل معنا بسهولة… <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-cyan-300 drop-shadow-2xl">
                واحصل على الحل <br className="hidden md:block" /> المناسب فورًا
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 mb-12 leading-relaxed font-medium max-w-2xl mr-auto opacity-95">
              فريقنا جاهز يرد عليك خلال دقائق ويوجهك لأفضل اختيار حسب احتياجك الفعلي. نحن هنا لضمان حصولك على مياه نقية وحلول مستدامة.
            </p>

            <div className="flex flex-col md:flex-row gap-6 mt-10 items-end md:items-center justify-end">
              <Link href="#contact-form" className="w-full md:w-auto">
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-10 py-5 bg-white/5 backdrop-blur-md text-white border-2 border-white/20 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3 hover:border-white/40"
                >
                  <Headphones className="w-6 h-6" />
                  اطلب استشارة
                </motion.button>
              </Link>

              <Link href="https://wa.me/+201005708036" className="w-full md:w-auto" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, boxShadow: "0 0 30px rgba(34, 197, 94, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-10 py-5 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-green-900/20 flex items-center justify-center gap-3"
                >
                  <MessageCircle className="w-6 h-6" />
                  تواصل واتساب الآن
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Bubbles — disabled when reduced motion preferred */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
          {Array.from({ length: BUBBLE_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -200, -400],
                opacity: [0, 0.4, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 7 + i * 1.5,
                repeat: Infinity,
                delay: i * 2,
              }}
              className="absolute w-2 h-2 bg-white/20 rounded-full blur-sm"
              style={{
                bottom: "-10%",
                left: `${(i / BUBBLE_COUNT) * 90 + 5}%`,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ContactHero;
