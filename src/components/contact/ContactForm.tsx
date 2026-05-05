"use client";

import React, { useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Phone, Mail, ChevronDown } from "lucide-react";

const provinces = [
  "القاهرة", "الجيزة", "الإسكندرية", "الدقهلية", "الشرقية", "المنوفية", "القليوبية", "البحيرة", "الغربية", "بور سعيد", "دمياط", "الإسماعيلية", "السويس", "كفر الشيخ", "الفيوم", "بني سويف", "المنيا", "أسيوط", "سوهاج", "قنا", "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد", "مطروح", "شمال سيناء", "جنوب سيناء"
];

const services = [
  "توريد مضخات", "تركيب فلاتر", "صيانة دورية", "استشارة هندسية", "أخرى"
];

const FloatingInput = ({ label, type = "text", required = false, onChange, placeholder = "", value }: any) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <div className="relative group w-full">
      <motion.label
        initial={false}
        animate={{
          y: isFocused || value ? -28 : 0,
          scale: isFocused || value ? 0.85 : 1,
          color: isFocused ? "#60a5fa" : "#94a3b8",
        }}
        className="absolute right-4 top-4 pointer-events-none origin-top-right transition-colors"
      >
        {label} {required && <span className="text-red-400">*</span>}
      </motion.label>
      <input
        type={type}
        required={required}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none transition-all focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 placeholder-transparent"
      />
    </div>
  );
};

const FloatingSelect = ({ label, options, required = false, onChange, value }: any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group w-full">
      <motion.label
        initial={false}
        animate={{
          y: isFocused || value ? -28 : 0,
          scale: isFocused || value ? 0.85 : 1,
          color: isFocused ? "#60a5fa" : "#94a3b8",
        }}
        className="absolute right-4 top-4 pointer-events-none origin-top-right transition-colors z-10"
      >
        {label} {required && <span className="text-red-400">*</span>}
      </motion.label>
      <div className="relative">
        <select
          required={required}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none transition-all focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer"
        >
          <option value="" className="bg-slate-900"></option>
          {options.map((opt: string) => (
            <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
          ))}
        </select>
        <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
      </div>
    </div>
  );
};

const ContactForm = () => {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    province: "",
    service: "",
    message: ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "حدث خطأ أثناء الإرسال");
      }

      setStatus("success");
      setFormState({ name: "", phone: "", province: "", service: "", message: "" });
    } catch (error) {
      setStatus("error");
      setErrorMsg(error instanceof Error ? error.message : "حدث خطأ غير متوقع");
    }
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-950 via-navy to-blue-950 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px] -z-0" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Quick Info (Upgraded to Dark Mode) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-4xl font-black text-white mb-10">معلومات التواصل</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">العنوان</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
مول علي الدين،مبني ب،ميدان ليله, قسم ثان 6 أكتوبر، محافظة الجيزة</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">أرقامنا</h4>
                  <p className="text-slate-400 text-sm font-mono" dir="ltr">+20 100 570 8036</p>
                  <p className="text-slate-400 text-sm font-mono" dir="ltr">+20 000000000000</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">ساعات العمل</h4>
                  <p className="text-slate-400 text-sm">يومياً من الساعة 9 صباحاً حتى 10 مساءً</p>
                  <p className="text-blue-400 font-bold text-xs mt-1">الجمعة عطلة رسمية</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">البريد الإلكتروني</h4>
                  <p className="text-slate-400 text-sm">info@el-ethad.com</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Upgraded Form (Dark Glassmorphism) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative order-1 lg:order-2"
          >
            {/* Subtle light effect behind form */}
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ duration: 8, repeat: Infinity }}
              className="absolute -inset-4 bg-blue-500 rounded-[3rem] blur-3xl -z-10"
            />
            
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl shadow-black/50">
              <h2 className="text-3xl font-black text-white mb-10 text-center lg:text-right">تواصل معنا الآن</h2>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FloatingInput 
                    label="الاسم بالكامل" 
                    required 
                    value={formState.name}
                    onChange={(val: string) => setFormState({...formState, name: val})}
                  />
                  <FloatingInput 
                    label="رقم الهاتف" 
                    type="tel" 
                    required 
                    value={formState.phone}
                    onChange={(val: string) => setFormState({...formState, phone: val})}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FloatingSelect 
                    label="المحافظة" 
                    options={provinces} 
                    required 
                    value={formState.province}
                    onChange={(val: string) => setFormState({...formState, province: val})}
                  />
                  <FloatingSelect 
                    label="نوع الخدمة" 
                    options={services} 
                    required 
                    value={formState.service}
                    onChange={(val: string) => setFormState({...formState, service: val})}
                  />
                </div>

                <div className="relative group w-full">
                  <motion.label
                    initial={false}
                    animate={{
                      y: formState.message ? -28 : 0,
                      scale: formState.message ? 0.85 : 1,
                      color: formState.message ? "#60a5fa" : "#94a3b8",
                    }}
                    className="absolute right-4 top-4 pointer-events-none origin-top-right transition-colors"
                  >
                    رسالتك (اختياري)
                  </motion.label>
                  <textarea
                    rows={4}
                    value={formState.message}
                    onChange={(e) => setFormState({...formState, message: e.target.value})}
                    className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none transition-all focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 resize-none"
                  ></textarea>
                </div>

                {/* Status feedback */}
                <AnimatePresence mode="wait">
                  {status === "success" && (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4 text-emerald-300"
                    >
                      <CheckCircle size={20} className="shrink-0" />
                      <p className="font-bold">تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.</p>
                    </motion.div>
                  )}
                  {status === "error" && (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 px-5 py-4 text-rose-300"
                    >
                      <AlertCircle size={20} className="shrink-0" />
                      <p className="font-bold">{errorMsg || "حدث خطأ. يرجى المحاولة مجدداً."}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: status === "loading" ? 1 : 1.02, y: status === "loading" ? 0 : -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <><Loader2 size={22} className="animate-spin" /> جاري الإرسال...</>
                  ) : (
                    "إرسال الطلب"
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
