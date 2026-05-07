"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
// Use the public folder path for hero video to avoid importing binary as a module
import { useEffect, useState, useRef } from "react";

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  // ── Shared animation config (disabled when reduced motion is preferred) ──
  const bgBlobTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 25, repeat: Infinity, ease: "linear" as const };

  const bgBlobTransition2 = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 30, repeat: Infinity, ease: "linear" as const };

  // Typing effect lines (RTL Arabic) — requested sentences
  const lines = [
    "قوة تدفق لا تتوقف",
    "حلول مياه موثوقة",
    "أداء يعتمد عليه",
    "اختار الجودة الصح",
  ];

  const [displayText, setDisplayText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  // refs to avoid stale closures inside timeouts
  const lineIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const deletingRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const typingSpeed = 80; // ms per character (typing: medium)
    const deletingSpeed = 40; // ms per character (deleting: faster)
    const pauseAfterTyped = 2500; // ms pause after full sentence

    const tick = () => {
      const line = lines[lineIndexRef.current];

      if (!deletingRef.current) {
        // type next char
        if (charIndexRef.current < line.length) {
          charIndexRef.current += 1;
          setDisplayText(line.slice(0, charIndexRef.current));
          timeoutRef.current = window.setTimeout(tick, typingSpeed);
        } else {
          // finished typing — pause then start deleting
          timeoutRef.current = window.setTimeout(() => {
            deletingRef.current = true;
            timeoutRef.current = window.setTimeout(tick, deletingSpeed);
          }, pauseAfterTyped);
        }
      } else {
        // deleting
        if (charIndexRef.current > 0) {
          charIndexRef.current -= 1;
          setDisplayText(line.slice(0, charIndexRef.current));
          timeoutRef.current = window.setTimeout(tick, deletingSpeed);
        } else {
          // move to next line
          deletingRef.current = false;
          lineIndexRef.current = (lineIndexRef.current + 1) % lines.length;
          timeoutRef.current = window.setTimeout(tick, typingSpeed);
        }
      }
    };

    // start
    timeoutRef.current = window.setTimeout(tick, typingSpeed);

    // cursor blink
    const cursorInterval = window.setInterval(() => setCursorVisible((v) => !v), 500);

    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      window.clearInterval(cursorInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      {/* Full-bleed video layer (covers entire hero) with subtle blur */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }} aria-hidden="true">
        <video
          src="/assets/hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          style={{ filter: "blur(1.5px)", transform: "scale(1.02)", willChange: "filter, transform" }}
        />
      </div>
      {/* Very subtle dark dim overlay on video only (keeps text sharp above) */}
      <div
        className="absolute inset-0 pointer-events-none z-[6]"
        aria-hidden="true"
        style={{ background: "rgba(0,0,0,0.35)" }}
      />

      {/* Main container */}
      <div className="container mx-auto px-6 relative z-10 w-full h-full max-w-[1400px] flex flex-col-reverse md:block justify-center pt-10 md:pt-0 pb-10 md:pb-0">

        {/* 2. Text Layer (z-20) */}
        <div className="relative md:absolute md:top-1/2 md:-translate-y-1/2 md:right-4 lg:right-8 w-full md:w-[60%] z-20 flex flex-col items-center text-center md:items-start md:text-right gap-4 lg:gap-5 pointer-events-auto">
          <div className="relative w-full">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative z-20 px-4 py-6 md:py-8 lg:px-8 lg:py-10"
              >
                <h1 dir="rtl" className="text-[10vw] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] xl:text-[7.5rem] font-black leading-[0.9] tracking-tight relative whitespace-normal text-white text-right">
                  <span className="inline-block max-w-full break-words">{displayText}</span>
                  <span aria-hidden style={{ opacity: cursorVisible ? 1 : 0 }} className="inline-block text-white">|</span>
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="relative z-20 max-w-[90%] lg:max-w-[550px] px-4 pb-6 lg:pb-8"
              >
                <p className="text-base sm:text-lg lg:text-xl text-white/90 leading-relaxed font-semibold mb-6 lg:mb-8">
                  مواتير وفلاتر مياه بتكنولوجيا ألمانية متطورة. أداء استثنائي صامت يوفر لك تدفقاً مثالياً وعمراً أطول.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 w-full">
                  <Link href="/products" className="w-[85%] sm:w-auto group px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white rounded-2xl font-black text-base md:text-lg shadow-[0_15px_30px_-10px_rgba(37,99,235,0.6)] hover:shadow-[0_20px_40px_-5px_rgba(37,99,235,0.8)] hover:bg-blue-700 transition-all flex items-center justify-center gap-3 hover:-translate-y-1">
                    تسوق الآن
                    <ArrowLeft size={18} className="group-hover:-translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            </div>
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

            {/* Decorative motor area (video now full-bleed behind page) */}
            <div className="relative w-full h-full scale-[1.02] lg:scale-[1.05] origin-center z-10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
