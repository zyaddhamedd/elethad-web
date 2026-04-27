"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const projects = [
  {
    title: "مجمع سكني - القاهرة الجديدة",
    description: "تركيب وصيانة نظام متكامل لمضخات المياه وفلاتر مركزية لأكثر من 50 وحدة سكنية.",
    image: "/assets/hero.webp"
  },
  {
    title: "مصنع أغذية - مدينة العبور",
    description: "تصميم وتنفيذ محطة معالجة مياه للاستخدام الصناعي بمعايير جودة فائقة.",
    image: "/assets/hero2.webp"
  },
  {
    title: "برج إداري - العاصمة الإدارية",
    description: "تزويد البرج بمضخات ذكية توفر في استهلاك الطاقة بنسبة 30%.",
    image: "/assets/hero3.webp"
  }
];

const ProjectsGrid = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-navy mb-4">مشاريع نفخر بها</h2>
          <p className="text-gray-500">قصص نجاح تجسد التزامنا بالتميز والكفاءة</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-white shadow-lg"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h3 className="text-xl font-bold mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {project.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
