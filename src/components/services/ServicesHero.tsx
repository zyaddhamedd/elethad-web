"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const PARTICLE_COUNT = 8; // Increased particles since GSAP handles it well

const ServicesHero = () => {
  const containerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    // Parallax background
    gsap.to(".hero-bg", {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    // Particle animations
    gsap.utils.toArray(".particle").forEach((particle: any, i) => {
      // Vertical movement
      gsap.fromTo(particle, 
        { y: "-10vh" },
        {
          y: "120vh",
          duration: "random(10, 20)",
          repeat: -1,
          ease: "none",
          delay: "random(0, 5)",
        }
      );
      
      // Opacity fading
      gsap.fromTo(particle,
        { opacity: 0 },
        {
          opacity: 0.8,
          duration: "random(3, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: "random(0, 5)",
        }
      );
      
      // Horizontal swaying
      gsap.to(particle, {
        x: "random(-50, 50)",
        duration: "random(3, 6)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    // Text reveal staggered animation
    const tl = gsap.timeline();
    tl.from(".hero-content > *", {
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.2)",
      delay: 0.2,
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-[90vh] overflow-hidden flex items-center">
      {/* Background Video / Image */}
      <div className="absolute inset-0 z-0 hero-bg scale-110 -top-[10%]">
        {/* Desktop: lazy-loaded background video */}
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

        {/* Mobile: static image */}
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
        <div className="absolute inset-0 bg-blue-900/30 mix-blend-overlay z-10" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-20 pointer-events-none" aria-hidden="true">
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <div
            key={i}
            className="particle absolute w-3 h-3 bg-blue-400/40 rounded-full blur-xl"
            style={{
              left: `${(i / PARTICLE_COUNT) * 100 + 5}%`,
              top: `-10%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 relative z-30 text-right">
        <div className="max-w-3xl mr-auto lg:mr-0 hero-content">
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
              <button className="w-full px-10 py-5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl font-black text-xl transition-all duration-300 shadow-xl shadow-blue-900/20 hover:shadow-blue-600/40 hover:-translate-y-1 flex items-center justify-center gap-3">
                اطلب استشارة
                <ChevronLeft className="w-6 h-6" />
              </button>
            </Link>

            <Link href="/products" className="w-full sm:w-auto">
              <button className="w-full px-10 py-5 bg-white/5 backdrop-blur-md text-white border-2 border-white/20 active:scale-95 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center justify-center gap-3 hover:border-white/50 hover:bg-white/10 hover:-translate-y-1">
                تصفح المنتجات
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesHero;
