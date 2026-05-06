"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ShieldCheck, Zap, HeartHandshake, Award } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "جودة مضمونة",
    text: "نلتزم بأعلى المعايير العالمية في جميع منتجاتنا وخدماتنا.",
    icon: ShieldCheck,
  },
  {
    title: "سرعة تنفيذ",
    text: "نقدر وقت عملائنا ونلتزم بالجداول الزمنية المحددة بدقة.",
    icon: Zap,
  },
  {
    title: "دعم مستمر",
    text: "علاقتنا تبدأ بعد البيع بتقديم أفضل خدمات الدعم والمتابعة.",
    icon: HeartHandshake,
  },
  {
    title: "خبرة عملية",
    text: "فريقنا يمتلك سنوات من الخبرة في أصعب المشاريع الهندسية.",
    icon: Award,
  },
];

const WhyChooseUs = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Parallax background blurs
    gsap.to(".bg-shape-1", {
      y: 100,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

    gsap.to(".bg-shape-2", {
      y: -100,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      }
    });

    // Crazy elastic bounce for the cards
    gsap.fromTo(".feature-card", 
      { y: 150, scale: 0.5, opacity: 0 },
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 1.5,
        stagger: 0.15,
        ease: "elastic.out(1, 0.5)",
      }
    );

    // Animate icons inside cards
    gsap.fromTo(".feature-icon", 
      { rotate: -180, scale: 0 },
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        rotate: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "back.out(2)",
        delay: 0.2
      }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-20 bg-slate-900 text-white overflow-hidden relative">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[120px] -z-10 bg-shape-1" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-blue-400/5 blur-[100px] -z-10 bg-shape-2" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="feature-card flex flex-col items-center group"
              >
                <div className="feature-icon mb-6 p-5 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all duration-500">
                  <Icon className="w-10 h-10 transition-colors duration-500 group-hover:text-white text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {feature.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
