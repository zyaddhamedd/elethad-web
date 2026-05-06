"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { MessageCircle, FileText } from "lucide-react";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

const FinalCTA = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Infinite glowing orbs animation
    gsap.to(".glow-orb-1", {
      scale: 1.2,
      opacity: 0.5,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".glow-orb-2", {
      scale: 1.3,
      opacity: 0.4,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2
    });

    // Energetic pop entrance for content
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      }
    });

    tl.fromTo(".cta-content > *", 
      { y: 80, scale: 0.8, opacity: 0 },
      {
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "elastic.out(1, 0.5)"
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-navy z-0" />
      
      {/* Animated Glows */}
      <div 
        className="glow-orb-1 absolute -top-24 -right-24 w-96 h-96 bg-blue-400 rounded-full blur-[120px] z-10 opacity-30"
      />
      <div 
        className="glow-orb-2 absolute -bottom-24 -left-24 w-96 h-96 bg-blue-300 rounded-full blur-[120px] z-10 opacity-20"
      />

      <div className="container mx-auto px-6 relative z-20">
        <div className="cta-content max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
            جاهز تبدأ؟ <br className="md:hidden" /> 
            خلينا نجهزلك الحل المثالي
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto font-light">
            سواء كنت تبحث عن نظام منزلي أو حلول للمشاريع الكبرى، فريقنا جاهز لتقديم الدعم والمشورة الفنية اللازمة.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/contact" className="block">
              <button className="w-full px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 hover:bg-blue-50 transition-all duration-300 hover:scale-105 active:scale-95">
                <FileText className="w-6 h-6" />
                اطلب عرض سعر
              </button>
            </Link>
            
            <Link href="https://wa.me/yournumber" className="block" target="_blank">
              <button className="w-full px-10 py-5 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-xl flex items-center justify-center gap-3 shadow-xl shadow-green-900/20 transition-all duration-300 hover:scale-105 active:scale-95">
                <MessageCircle className="w-6 h-6" />
                تواصل واتساب
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
