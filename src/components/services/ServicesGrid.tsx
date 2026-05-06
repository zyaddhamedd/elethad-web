"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { 
  Package, 
  Settings, 
  Clock, 
  Ruler, 
  Layers, 
  Headphones 
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "توريد المعدات",
    description: "نوفر مجموعة واسعة من أجود أنواع المضخات والفلاتر وقطع الغيار الأصلية من كبرى الشركات العالمية، مع تقديم ضمانات حقيقية وشهادات جودة معتمدة تضمن استدامة استثماراتكم وكفاءة التشغيل الطويلة.",
    icon: <Package className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "تركيب وتشغيل",
    description: "نعتمد على فريق هندسي وفني متخصص ومدرب على أحدث التكنولوجيا لتركيب الأنظمة المعقدة وضمان تشغيلها بأعلى كفاءة ممكنة، مع الالتزام الصارم بكافة معايير السلامة المهنية والمواصفات القياسية العالمية.",
    icon: <Settings className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "صيانة دورية",
    description: "نقدم برامج صيانة وقائية متطورة وخطط صيانة علاجية سريعة لضمان استمرارية العمل دون انقطاع، مما يساهم في تقليل التكاليف التشغيلية وإطالة العمر الافتراضي للمعدات والحفاظ على كفاءة استهلاك الطاقة.",
    icon: <Clock className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "استشارات هندسية",
    description: "نقدم دراسات جدوى فنية واقتصادية متكاملة، واستشارات احترافية لتصميم وتطوير حلول المياه الذكية التي تتناسب مع طبيعة كل مشروع، سواء كان سكنياً أو تجارياً أو صناعياً، لضمان الحصول على أفضل النتائج بأقل تكلفة.",
    icon: <Ruler className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "حلول مخصصة",
    description: "نمتلك القدرة على ابتكار وتصميم حلول تقنية وفنية مخصصة بالكامل لمواجهة التحديات الفريدة والمعقدة في مجالات معالجة وتحلية وتوزيع المياه، مع التركيز على الابتكار والاستدامة وتوفير الموارد المتاحة.",
    icon: <Layers className="w-8 h-8 text-blue-500" />,
  },
  {
    title: "دعم فني",
    description: "نوفر فريق دعم فني متخصص متاح على مدار الساعة (24/7) للرد على كافة استفساراتكم وحل المشكلات التقنية بشكل فوري وعاجل، لضمان راحة بال عملائنا واستقرار أنظمتهم المائية في جميع الأوقات.",
    icon: <Headphones className="w-8 h-8 text-blue-500" />,
  },
];

const ServicesGrid = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
      }
    });

    tl.fromTo(".section-header > *", 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
      }
    );

    tl.fromTo(".service-card", 
      { y: 100, opacity: 0, rotationX: 45 },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.5)",
        transformOrigin: "bottom center"
      }, 
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-white relative perspective-[1000px]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 section-header">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-4">
            خدماتنا الشاملة
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            نحن نغطي كافة احتياجاتك في مجال أنظمة المياه، من الفكرة وحتى التشغيل والدعم المستمر.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group p-8 rounded-2xl bg-slate-50 border border-slate-100 transition-all duration-500 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-3 relative overflow-hidden flex flex-col h-full transform-gpu"
            >
              {/* Glow background effect */}
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-100/50 rounded-full blur-3xl group-hover:bg-blue-400/30 transition-colors duration-500 group-hover:scale-150" />
              
              <div className="mb-6 inline-flex p-4 bg-white rounded-xl box-glow-hover transition-all duration-500 w-fit group-hover:-translate-y-2 group-hover:shadow-blue-200">
                {service.icon}
              </div>
              
              <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-blue-600 transition-colors duration-300">
                {service.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
