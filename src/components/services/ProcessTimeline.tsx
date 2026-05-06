"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    title: "تواصل معنا",
    desc: "أخبرنا باحتياجك أو مشكلتك وسيقوم فريقنا بالرد عليك فوراً."
  },
  {
    number: "02",
    title: "تحليل احتياجك",
    desc: "نقوم بزيارة ميدانية ودراسة فنية لتحديد الحل الأمثل والأنسب."
  },
  {
    number: "03",
    title: "اختيار الحل",
    desc: "نقدم لك عرضاً فنياً ومالياً مفصلاً يضمن الكفاءة واقتصادية التكلفة."
  },
  {
    number: "04",
    title: "التنفيذ",
    desc: "يبدأ فريقنا الهندسي بتركيب الأنظمة وفق أعلى معايير الجودة."
  },
  {
    number: "05",
    title: "المتابعة",
    desc: "نستمر في متابعة الأداء وتقديم الصيانة لضمان عمل النظام بكفاءة."
  }
];

const ProcessTimeline = () => {
  const containerRef = useRef<HTMLElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Desktop: Horizontal Scroll Pin
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const container = containerRef.current;
      const scrollWrapper = scrollWrapperRef.current;
      
      if (!container || !scrollWrapper) return;

      // Calculate how far to translate (RTL means translating positive X to move elements from left to right into view)
      // Actually in RTL flex, scrolling right means moving children left.
      // Easiest is just to translate the wrapper by its scrollWidth minus clientWidth
      const xOffset = scrollWrapper.scrollWidth - scrollWrapper.clientWidth + 100; // adding padding

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1.5, // smoother scrub
          start: "center center",
          end: `+=${xOffset * 4}`, // Increased from xOffset * 2 to xOffset * 4 to make the scroll much slower
        }
      });

      // Move the wrapper horizontally
      tl.to(scrollWrapper, {
        x: xOffset,
        ease: "none",
      });

      // Draw the connecting line as we scroll
      tl.fromTo(lineRef.current, 
        { width: "0%" }, 
        { width: "100%", ease: "none" }, 
        0 // start at the same time as the wrapper moves
      );

      // Pop the step circles as the line reaches them
      gsap.utils.toArray(".step-circle").forEach((circle: any, i) => {
        tl.fromTo(circle, 
          { scale: 0, rotation: -180, opacity: 0 },
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 0.5
          }, 
          (i / steps.length) // sequence evenly across the timeline duration (normalized 0-1)
        );
      });
      
      gsap.utils.toArray(".step-content").forEach((content: any, i) => {
        tl.fromTo(content, 
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            ease: "back.out(1.5)",
            duration: 0.5
          }, 
          (i / steps.length) + 0.1
        );
      });
    });

    // Mobile: Vertical Entrance
    mm.add("(max-width: 1023px)", () => {
      gsap.utils.toArray(".mobile-step").forEach((step: any, i) => {
        gsap.fromTo(step, 
          { x: 50, opacity: 0 }, // RTL slide in from right
          {
            scrollTrigger: {
              trigger: step,
              start: "top 80%",
            },
            x: 0, 
            opacity: 1,
            duration: 0.8,
            ease: "back.out(1.2)"
          }
        );
      });
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-4">كيف نعمل؟</h2>
          <p className="text-gray-500">خطوات مدروسة تضمن لك الحصول على أفضل النتائج</p>
        </div>

        {/* Desktop Timeline - Horizontal Scroll */}
        <div className="hidden lg:block relative overflow-visible h-80">
          <div className="absolute top-1/4 left-0 w-full h-1 bg-slate-100 z-0 rounded-full" />
          <div ref={lineRef} className="absolute top-1/4 right-0 w-full h-1 bg-blue-600 z-10 rounded-full origin-right" />
          
          <div ref={scrollWrapperRef} className="flex gap-16 relative z-20 w-max px-[10vw]">
            {steps.map((step, index) => (
              <div
                key={index}
                className="text-center group w-64 flex-shrink-0"
              >
                <div className="relative mb-8 inline-block">
                  <div className="step-circle w-20 h-20 bg-white border-4 border-blue-100 rounded-full flex items-center justify-center text-blue-600 font-black text-2xl group-hover:border-blue-500 transition-colors duration-300 shadow-xl shadow-blue-900/10 relative z-20">
                    {step.number}
                  </div>
                  {/* Outer pulse ring */}
                  <div className="absolute inset-0 border-2 border-blue-400 rounded-full opacity-0 group-hover:animate-ping z-10" />
                </div>
                <div className="step-content">
                  <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed px-2 text-lg">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-12 relative">
          <div className="absolute top-0 right-8 w-0.5 h-full bg-slate-100 z-0" />
          
          {steps.map((step, index) => (
            <div
              key={index}
              className="mobile-step relative flex items-start gap-6 pr-4"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold z-10 mt-1 shadow-lg shadow-blue-600/30">
                {step.number}
              </div>
              <div>
                <h3 className="text-xl font-bold text-navy mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessTimeline;
