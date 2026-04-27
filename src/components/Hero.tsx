"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import motorImg from "../../assets/hero.webp";
import filterImg from "../../assets/hero2.webp";
import systemImg from "../../assets/hero3.webp";
import { useState, useEffect, useCallback } from "react";

const images = [motorImg, filterImg, systemImg];

// Duration between auto-slides (ms)
const SLIDE_INTERVAL = 5000;

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // Auto-advance carousel
  const advance = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  }, []);

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(advance, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isHovered, advance]);

  // ── Shared animation config (disabled when reduced motion is preferred) ──
  const bgBlobTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 25, repeat: Infinity, ease: "linear" as const };

  const bgBlobTransition2 = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 30, repeat: Infinity, ease: "linear" as const };

  return (
    <section
      className="relative w-full h-[100vh] max-h-[1080px] flex items-center justify-center overflow-hidden bg-[#f8fafc] pt-16 lg:pt-20"
      dir="rtl"
    >
      {/* 1. Background Layer (z-0) — GPU-composited blobs */}
      <div
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9]" />

        {/* Blob 1 — only animate on desktop */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1, 1.1, 1],
                  rotate: [0, 90, 180, 270, 360],
                  borderRadius: [
                    "40% 60% 70% 30%",
                    "30% 70% 50% 50%",
                    "50% 50% 40% 60%",
                    "40% 60% 70% 30%",
                  ],
                }
          }
          transition={bgBlobTransition}
          className="absolute top-[5%] right-[10%] w-[60vw] h-[60vw] max-w-[900px] max-h-[900px] bg-gradient-to-tr from-cyan-300/15 via-blue-400/10 to-transparent blur-[80px] md:blur-[120px] opacity-80"
          style={{ willChange: shouldReduceMotion ? "auto" : "transform" }}
        />

        {/* Blob 2 */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1.1, 1, 1.1],
                  rotate: [360, 180, 0],
                  borderRadius: [
                    "50% 50% 40% 60%",
                    "40% 60% 70% 30%",
                    "30% 70% 50% 50%",
                    "50% 50% 40% 60%",
                  ],
                }
          }
          transition={bgBlobTransition2}
          className="absolute bottom-[-10%] left-[5%] w-[55vw] h-[55vw] max-w-[800px] max-h-[800px] bg-gradient-to-bl from-blue-500/15 via-cyan-400/10 to-transparent blur-[80px] md:blur-[140px] opacity-70"
          style={{ willChange: shouldReduceMotion ? "auto" : "transform" }}
        />
      </div>

      {/* Main container */}
      <div className="container mx-auto px-6 relative z-10 w-full h-full max-w-[1400px] flex flex-col-reverse md:block justify-center pt-10 md:pt-0 pb-10 md:pb-0">

        {/* 2. Text Layer (z-20) */}
        <div className="relative md:absolute md:top-1/2 md:-translate-y-1/2 md:right-4 lg:right-8 w-full md:w-[60%] z-20 flex flex-col items-center text-center md:items-start md:text-right gap-4 lg:gap-5 pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-[10vw] sm:text-[4.5rem] md:text-[6.5rem] lg:text-[7.5rem] xl:text-[8.5rem] font-black leading-[0.85] tracking-tight relative whitespace-nowrap">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-slate-950 to-slate-700 drop-shadow-xl">
                قوة جبارة،
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-800 via-blue-600 to-cyan-400 relative inline-block pb-3 lg:pb-6 z-10 drop-shadow-2xl">
                تدفق لا يتوقف.
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="relative z-30 max-w-[90%] lg:max-w-[550px]"
          >
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed font-semibold mb-6 lg:mb-8">
              مواتير وفلاتر مياه بتكنولوجيا ألمانية متطورة. أداء استثنائي صامت يوفر لك تدفقاً مثالياً وعمراً أطول.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 w-full">
              <button className="w-[85%] sm:w-auto group px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white rounded-2xl font-black text-base md:text-lg shadow-[0_15px_30px_-10px_rgba(37,99,235,0.6)] hover:shadow-[0_20px_40px_-5px_rgba(37,99,235,0.8)] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 hover:-translate-y-1">
                تسوق الآن
                <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
              </button>
              <button className="w-[85%] sm:w-auto px-6 py-3 md:px-8 md:py-4 bg-white/80 backdrop-blur-md text-slate-800 rounded-2xl font-bold text-base md:text-lg border-2 border-slate-200/50 hover:border-blue-400 hover:bg-white transition-all shadow-sm hover:shadow-lg hover:-translate-y-1">
                اكتشف المنتجات
              </button>
            </div>
          </motion.div>
        </div>

        {/* 3. Motor Image Layer (z-10) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, x: -40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="relative md:absolute md:top-1/2 md:-translate-y-1/2 left-0 lg:left-[5%] xl:left-[10%] w-full md:w-[50%] h-[45vh] sm:h-[50vh] md:h-[70%] z-10 pointer-events-none flex items-center justify-center mb-6 md:mb-0"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="relative w-full h-full max-w-[700px] lg:max-w-[900px] flex items-center justify-center">
            {/* Glow rings */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-500/30 rounded-full blur-[60px] md:blur-[90px] z-0"
              aria-hidden="true"
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] bg-cyan-200/40 rounded-full blur-[50px] md:blur-[70px] z-0"
              aria-hidden="true"
            />

            {/* Image Carousel */}
            <div
              className="relative w-full h-full scale-[1.2] lg:scale-[1.3] xl:scale-[1.4] origin-center z-10"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[currentImageIndex]}
                    alt="معدات مياه عالية الكفاءة"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.25)]"
                    priority={currentImageIndex === 0}
                    quality={85}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
