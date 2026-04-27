"use client";

import React from "react";
import { motion } from "framer-motion";

const ContactMap = () => {
  return (
    <section className="w-full h-[450px] bg-slate-200 relative overflow-hidden">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110502.60389650059!2d31.188423276537756!3d30.0594838101452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296efaaadba!2sCairo%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1714234567890!5m2!1sen!2seg" 
        width="100%" 
        height="100%" 
        style={{ border: 0, filter: "grayscale(1) contrast(1.2) opacity(0.8)" }} 
        allowFullScreen 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        className="grayscale hover:grayscale-0 transition-all duration-700"
      ></iframe>
      
      {/* Overlay for premium look */}
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-slate-50 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
    </section>
  );
};

export default ContactMap;
