"use client";

import React, { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Reduced particle count for performance (6 → 4)
const PARTICLE_COUNT = 4;

const ServicesHero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative w-full h-[90vh] overflow-hidden flex items-center">
      {/* Background Video / Image */}
      <div className="absolute inset-0 z-0">
        {/* Desktop: lazy-loaded background video with poster for instant display */}
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/assets/hero.webp"
          className="hidden md:block w-full h-full object-cover"
        >
          <source src="/assets/%D8%AE%D8%AF%D9%85%D8%A7%D8%AA.mp4" type="video/mp4" />
        </video>

        {/* Mobile: static image instead of video for performance */}
        <div className="md:hidden absolute inset-0">
          <Image
            src="/assets/hero.webp"
            alt="خدمات الاتحاد"
            fill
            className="object-cover"
            priority
            quality={80}
            sizes="100vw"
          />
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50 z-10" />
        <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay z-10" />
      </div>

      {/* Floating Particles — CSS-only, reduced count, disabled when prefers-reduced-motion */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 z-20 pointer-events-none" aria-hidden="true">
          {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-blue-400/30 rounded-full blur-xl"
              style={{
                left: `${(i / PARTICLE_COUNT) * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: ["-10%", "110%"],
                opacity: [0, 0.5, 0],
              }}
              transition={{
                duration: 12 + i * 4,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto px-6 relative z-30 text-right">
        <div className="max-w-3xl mr-auto lg:mr-0">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.1] tracking-tight">
              حلول متكاملة <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-cyan-300 drop-shadow-2xl">
                لأنظمة المياه
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-200 mb-12 leading-relaxed font-medium max-w-xl opacity-90">
              من التوريد والتركيب إلى الصيانة والدعم الكامل. نضمن لك أعلى معايير الجودة والكفاءة في كل قطرة.
            </p>

            <div className="flex flex-col sm:flex-row-reverse gap-5 justify-start items-center sm:items-start">
              <Link href="/contact" className="w-full sm:w-auto">
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, boxShadow: "0 0 30px rgba(37, 99, 235, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3"
                >
                  اطلب استشارة
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
              </Link>

              <Link href="/products" className="w-full sm:w-auto">
                <motion.button
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-10 py-5 bg-white/5 backdrop-blur-md text-white border-2 border-white/20 rounded-2xl font-bold text-xl transition-all flex items-center justify-center gap-3 hover:border-white/40"
                >
                  تصفح المنتجات
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
