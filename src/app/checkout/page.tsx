"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Wallet,
  CheckCircle2,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  Phone,
  MapPin,
  Copy,
  Check,
  Upload,
  ImageIcon,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

const GOVERNORATES = [
  "القاهرة","الجيزة","الإسكندرية","الدقهلية","الشرقية","المنوفية","القليوبية",
  "البحيرة","الغربية","بور سعيد","دمياط","الإسماعيلية","السويس","كفر الشيخ",
  "الفيوم","بني سويف","المنيا","أسيوط","سوهاج","قنا","الأقصر","أسوان",
  "البحر الأحمر","الوادي الجديد","مطروح","شمال سيناء","جنوب سيناء",
];

const INSTAPAY_NUMBER = "01005708036";

export default function CheckoutPage() {
  const { cartItems, buyNowItem, setBuyNowItem, updateQuantity, removeFromCart, clearCart } = useCart();

  const [formData, setFormData] = useState({ name: "", phone: "", address: "", governorate: "" });
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "instapay">("cash");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const cart = useMemo(() => {
    if (cartItems.length > 0) return cartItems;
    if (buyNowItem) return [buyNowItem];
    return [];
  }, [buyNowItem, cartItems]);

  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
  const shippingCost = cart.length > 0 ? 50 : 0;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshot(file);
    const reader = new FileReader();
    reader.onload = (ev) => setScreenshotPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCopyNumber = async () => {
    await navigator.clipboard.writeText(INSTAPAY_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (paymentMethod === "instapay" && !screenshot) {
      setErrorMsg("من فضلك أرفق صورة إيصال التحويل عبر InstaPay.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const fd = new FormData();
      fd.append("customer_name", formData.name);
      fd.append("phone", formData.phone);
      fd.append("address", formData.address);
      fd.append("governorate", formData.governorate);
      fd.append("payment_method", paymentMethod);
      fd.append("items", JSON.stringify(cart.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image }))));
      fd.append("subtotal", String(subtotal));
      fd.append("shipping", String(shippingCost));
      fd.append("total", String(total));
      if (screenshot) fd.append("payment_screenshot", screenshot);

      const res = await fetch("/api/orders", { method: "POST", body: fd });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "حدث خطأ أثناء تأكيد الطلب.");
      }

      // Success
      if (buyNowItem) setBuyNowItem(null);
      else clearCart();
      setIsSuccess(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "حدث خطأ غير متوقع.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 pt-32 text-center" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">تم تأكيد طلبك!</h1>
          <p className="text-slate-500 font-bold mb-8 text-sm">
            شكراً لتسوقك معنا. سيتواصل بك فريق المبيعات قريباً لتأكيد تفاصيل الشحن.
          </p>
          <Link href="/products" className="block w-full py-4 bg-[#1E5EFF] text-white rounded-xl font-black shadow-lg">
            العودة للمتجر
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Empty cart ───────────────────────────────────────────────────────────────
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 pt-32" dir="rtl">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShoppingBag className="w-8 h-8 text-slate-300" />
          </div>
          <h1 className="text-xl font-black text-slate-900 mb-4">سلة التسوق فارغة</h1>
          <Link href="/products" className="inline-block px-8 py-3.5 bg-[#1E5EFF] text-white rounded-xl font-black">
            ابدأ التسوق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-32 pt-32 md:pt-48 px-0" dir="rtl">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* ── Order Summary ── */}
          <div className="lg:col-span-5 order-1">
            <div className="bg-white rounded-3xl md:rounded-[2rem] p-5 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
              <h2 className="text-lg md:text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <ShoppingBag className="text-[#1E5EFF]" size={20} />
                ملخص الطلب
              </h2>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 p-2.5 bg-slate-50/50 rounded-2xl border border-slate-100">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-xl border border-slate-200/50 p-1.5 shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-contain" sizes="80px" loading="lazy" quality={70} />
                    </div>
                    <div className="flex-grow flex flex-col justify-center">
                      <h3 className="font-black text-slate-800 text-[11px] md:text-xs mb-1 line-clamp-1">{item.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2.5 bg-white px-2 py-1 rounded-lg border border-slate-200">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400"><Minus size={10} /></button>
                          <span className="font-black text-[10px] md:text-xs">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400"><Plus size={10} /></button>
                        </div>
                        <span className="font-black text-[#1E5EFF] text-xs md:text-sm">{(item.price * item.quantity).toLocaleString("ar-EG")} ج.م</span>
                      </div>
                    </div>
                    {!buyNowItem && (
                      <button onClick={() => removeFromCart(item.id)} className="p-1.5 text-slate-200 hover:text-red-500 self-start"><Trash2 size={14} /></button>
                    )}
                  </div>
                ))}
              </div>

              {!buyNowItem && (
                <Link href="/products" className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#1E5EFF]/30 rounded-xl text-[#1E5EFF] font-black text-[11px] md:text-xs hover:bg-[#1E5EFF] hover:text-white transition-all mb-6">
                  <Plus size={14} />إضافة المزيد للمنتجات
                </Link>
              )}

              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-slate-500 font-bold text-[10px] md:text-xs">
                  <span>إجمالي المنتجات</span>
                  <span>{subtotal.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <div className="flex justify-between text-slate-500 font-bold text-[10px] md:text-xs">
                  <span>تكلفة الشحن</span>
                  <span>{shippingCost.toLocaleString("ar-EG")} ج.م</span>
                </div>
                <div className="p-4 bg-[#1E5EFF]/5 rounded-2xl border border-[#1E5EFF]/10 mt-3 flex justify-between items-center">
                  <span className="font-black text-slate-900 text-xs md:text-sm">المجموع النهائي</span>
                  <span className="text-xl md:text-2xl font-black text-[#1E5EFF]">
                    {total.toLocaleString("ar-EG")} <small className="text-[10px] font-black">ج.م</small>
                  </span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[{ icon: Wallet, label: "دفع استلام" }, { icon: Truck, label: "شحن سريع" }, { icon: ShieldCheck, label: "ضمان جودة" }].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-2.5 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <b.icon className="text-[#1E5EFF]" size={16} />
                  <span className="text-[8px] font-black text-slate-500 text-center">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Customer Form ── */}
          <div className="lg:col-span-7 order-2 mb-8 md:mb-0">
            <div className="bg-white rounded-3xl md:rounded-[2rem] p-5 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
              <h2 className="text-lg md:text-2xl font-black text-slate-900 mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#1E5EFF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#1E5EFF]/20">
                  <MapPin size={18} />
                </div>
                بيانات التوصيل
              </h2>

              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Name + Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] md:text-xs font-black text-slate-500 uppercase">
                      <User size={12} className="text-[#1E5EFF]" />الاسم بالكامل
                    </label>
                    <input required name="name" type="text" placeholder="أدخل اسمك بالكامل" value={formData.name} onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1E5EFF]/10 focus:border-[#1E5EFF] focus:bg-white transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] md:text-xs font-black text-slate-500 uppercase">
                      <Phone size={12} className="text-[#1E5EFF]" />رقم الهاتف
                    </label>
                    <input required name="phone" type="tel" placeholder="01xxxxxxxxx" value={formData.phone} onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1E5EFF]/10 focus:border-[#1E5EFF] focus:bg-white transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300" />
                  </div>
                </div>

                {/* Governorate + Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] md:text-xs font-black text-slate-500 uppercase">المحافظة</label>
                    <select required name="governorate" value={formData.governorate} onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1E5EFF]/10 focus:border-[#1E5EFF] focus:bg-white transition-all font-bold text-slate-900 text-sm appearance-none cursor-pointer">
                      <option value="">اختر المحافظة</option>
                      {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] md:text-xs font-black text-slate-500 uppercase">العنوان بالتفصيل</label>
                    <input required name="address" type="text" placeholder="اسم الشارع، رقم المبنى..." value={formData.address} onChange={handleInputChange}
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#1E5EFF]/10 focus:border-[#1E5EFF] focus:bg-white transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300" />
                  </div>
                </div>

                {/* ── Payment Method ── */}
                <div className="pt-2 md:pt-4">
                  <h3 className="font-black text-slate-900 text-sm md:text-base mb-3 md:mb-4 flex items-center gap-2">
                    <Wallet size={16} className="text-[#1E5EFF]" />
                    طريقة الدفع
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Cash */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cash")}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-right ${
                        paymentMethod === "cash"
                          ? "border-[#1E5EFF] bg-[#1E5EFF]/5"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === "cash" ? "border-[#1E5EFF]" : "border-slate-300"}`}>
                        {paymentMethod === "cash" && <div className="w-2.5 h-2.5 bg-[#1E5EFF] rounded-full" />}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-xs md:text-sm">كاش عند الاستلام</p>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">ادفع لحظة التسليم</p>
                      </div>
                    </button>

                    {/* InstaPay */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("instapay")}
                      className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-right ${
                        paymentMethod === "instapay"
                          ? "border-purple-500 bg-purple-50"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${paymentMethod === "instapay" ? "border-purple-500" : "border-slate-300"}`}>
                        {paymentMethod === "instapay" && <div className="w-2.5 h-2.5 bg-purple-500 rounded-full" />}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-xs md:text-sm">InstaPay</p>
                        <p className="text-[9px] text-slate-400 font-bold mt-0.5">تحويل فوري</p>
                      </div>
                    </button>
                  </div>

                  {/* ── InstaPay panel ── */}
                  <AnimatePresence>
                    {paymentMethod === "instapay" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 rounded-2xl border border-purple-200 bg-purple-50 p-4 space-y-4">
                          {/* Transfer number */}
                          <div>
                            <p className="text-xs font-black text-purple-700 mb-2">رقم محفظة InstaPay للتحويل:</p>
                            <div className="flex items-center gap-3 bg-white rounded-xl border border-purple-200 px-4 py-3">
                              <span className="flex-1 font-black text-slate-900 text-lg tracking-widest" dir="ltr">{INSTAPAY_NUMBER}</span>
                              <button
                                type="button"
                                onClick={handleCopyNumber}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                                  copied ? "bg-emerald-100 text-emerald-600" : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                }`}
                              >
                                {copied ? <><Check size={13} />تم النسخ</> : <><Copy size={13} />نسخ</>}
                              </button>
                            </div>
                          </div>

                          {/* Screenshot upload */}
                          <div>
                            <p className="text-xs font-black text-purple-700 mb-2">
                              أرفق صورة إيصال التحويل <span className="text-red-500">*</span>
                            </p>
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleScreenshotChange}
                            />

                            {screenshotPreview ? (
                              <div className="relative rounded-xl overflow-hidden border border-purple-200">
                                <img src={screenshotPreview} alt="إيصال التحويل" className="w-full max-h-48 object-contain bg-white" />
                                <button
                                  type="button"
                                  onClick={() => { setScreenshot(null); setScreenshotPreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                                  className="absolute top-2 left-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-black hover:bg-red-600 transition"
                                >✕</button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed border-purple-300 rounded-xl bg-white hover:bg-purple-50 transition text-purple-500"
                              >
                                <ImageIcon size={28} />
                                <span className="text-xs font-black">اضغط لرفع صورة الإيصال</span>
                                <span className="text-[10px] text-purple-400">PNG / JPG / WEBP — حتى 10 ميجا</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Error message */}
                <AnimatePresence>
                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-600"
                    >
                      <AlertCircle size={16} className="shrink-0" />
                      {errorMsg}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Desktop CTA */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden md:flex w-full py-4 bg-gradient-to-r from-[#1E5EFF] to-[#3A8DFF] text-white rounded-2xl font-black text-xl shadow-[0_15px_30px_rgba(30,94,255,0.2)] hover:shadow-[0_20px_40px_rgba(30,94,255,0.4)] transition-all items-center justify-center gap-4 disabled:opacity-70 mt-4"
                >
                  {isSubmitting ? <><Loader2 size={22} className="animate-spin" /> جاري المعالجة...</> : <><CheckCircle2 size={24} /> تأكيد الطلب الآن</>}
                </motion.button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 pb-6 z-50 shadow-[0_-8px_25px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">الإجمالي النهائي</span>
            <span className="text-xl font-black text-[#1E5EFF] leading-none">{total.toLocaleString("ar-EG")} ج.م</span>
          </div>
          <div className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100/50 flex items-center gap-1">
            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
            متاح للشحن
          </div>
        </div>
        <button
          onClick={() => (document.getElementById("checkout-form") as HTMLFormElement)?.requestSubmit()}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-[#1E5EFF] to-[#3A8DFF] text-white rounded-xl font-black text-lg shadow-lg shadow-[#1E5EFF]/20 active:scale-[0.97] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
        >
          {isSubmitting ? <><Loader2 size={20} className="animate-spin" /> جاري المعالجة...</> : "تأكيد الطلب الآن"}
        </button>
      </div>
    </main>
  );
}
