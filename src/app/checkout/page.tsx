"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  User, 
  Wallet, 
  CheckCircle2, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Truck, 
  CreditCard,
  Phone,
  MapPin
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, buyNowItem, setBuyNowItem, updateQuantity, removeFromCart, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    governorate: ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const cart = useMemo(() => {
    if (cartItems.length > 0) return cartItems;
    if (buyNowItem) return [buyNowItem];
    return [];
  }, [buyNowItem, cartItems]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const shippingCost = cart.length > 0 ? 50 : 0;
  const total = subtotal + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      if (buyNowItem) {
        setBuyNowItem(null);
      } else {
        clearCart();
      }
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 pt-32 text-center" dir="rtl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">تم تأكيد طلبك!</h1>
          <p className="text-slate-500 font-bold mb-8 text-sm">شكراً لتسوقك معنا. سيتواصل بك فريق المبيعات قريباً لتأكيد تفاصيل الشحن.</p>
          <Link href="/products" className="block w-full py-4 bg-[#1E5EFF] text-white rounded-xl font-black shadow-lg">
            العودة للمتجر
          </Link>
        </motion.div>
      </div>
    );
  }

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
        

        {/* Mobile-optimized Grid Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Order Summary (First on mobile) */}
          <div className="lg:col-span-5 order-1">
            <div className="bg-white rounded-3xl md:rounded-[2rem] p-5 md:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
              <h2 className="text-lg md:text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <ShoppingBag className="text-[#1E5EFF]" size={20} />
                ملخص الطلب
              </h2>

              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 p-2.5 bg-slate-50/50 rounded-2xl border border-slate-100 transition-all">
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
                <Link 
                  href="/products" 
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-[#1E5EFF]/30 rounded-xl text-[#1E5EFF] font-black text-[11px] md:text-xs hover:bg-[#1E5EFF] hover:text-white transition-all mb-6"
                >
                  <Plus size={14} />
                  إضافة المزيد للمنتجات
                </Link>
              )}

              {/* Order Calculations */}
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
                    {total.toLocaleString("ar-EG")} <small className="text-[10px] md:text-xs font-black">ج.م</small>
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Badges - Optimized for mobile wrap */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                { icon: Wallet, label: "دفع استلام" },
                { icon: Truck, label: "شحن سريع" },
                { icon: ShieldCheck, label: "ضمان جودة" }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-2.5 bg-white rounded-2xl border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                  <badge.icon className="text-[#1E5EFF]" size={16} />
                  <span className="text-[8px] font-black text-slate-500 text-center">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Form (Second on mobile) */}
          <div className="lg:col-span-7 order-2 mb-8 md:mb-0">
            <div className="bg-white rounded-3xl md:rounded-[2rem] p-5 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100">
              <h2 className="text-lg md:text-2xl font-black text-slate-900 mb-6 md:mb-8 flex items-center gap-3 md:gap-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-[#1E5EFF] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#1E5EFF]/20">
                  <MapPin size={18} className="md:w-5 md:h-5" />
                </div>
                بيانات التوصيل
              </h2>

              <form id="mobile-checkout-form" onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] md:text-xs font-black text-slate-500 mr-1 uppercase">
                      <User size={12} className="text-[#1E5EFF]" />
                      الاسم بالكامل
                    </label>
                    <input required type="text" placeholder="أدخل اسمك بالكامل" className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1E5EFF]/10 focus:border-[#1E5EFF] focus:bg-white transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300 placeholder:font-medium" onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[10px] md:text-xs font-black text-slate-500 mr-1 uppercase">
                      <Phone size={12} className="text-[#1E5EFF]" />
                      رقم الهاتف
                    </label>
                    <input required type="tel" placeholder="01xxxxxxxxx" className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1E5EFF]/10 focus:border-[#1E5EFF] focus:bg-white transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300 placeholder:font-medium" onChange={handleInputChange} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] md:text-xs font-black text-slate-500 mr-1 uppercase">المحافظة</label>
                    <select required className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1E5EFF]/10 focus:border-[#1E5EFF] focus:bg-white transition-all font-bold text-slate-900 text-sm appearance-none cursor-pointer" onChange={handleInputChange}>
                      <option value="">اختر المحافظة</option>
                      <option value="cairo">القاهرة</option>
                      <option value="giza">الجيزة</option>
                      <option value="alex">الإسكندرية</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[10px] md:text-xs font-black text-slate-500 mr-1 uppercase">العنوان بالتفصيل</label>
                    <input required type="text" placeholder="اسم الشارع، رقم المبنى..." className="w-full px-4 md:px-5 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#1E5EFF]/10 focus:border-[#1E5EFF] focus:bg-white transition-all font-bold text-slate-900 text-sm placeholder:text-slate-300 placeholder:font-medium" onChange={handleInputChange} />
                  </div>
                </div>

                <div className="pt-2 md:pt-4">
                  <h3 className="font-black text-slate-900 text-sm md:text-base mb-3 md:mb-4 flex items-center gap-2">
                    <Wallet size={16} className="text-[#1E5EFF]" />
                    طريقة الدفع
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <label className="flex items-center gap-3 p-3.5 md:p-4 rounded-xl md:rounded-2xl border-2 border-[#1E5EFF] bg-[#1E5EFF]/5 cursor-pointer">
                      <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-[#1E5EFF] flex items-center justify-center">
                        <div className="w-2 md:w-2.5 h-2 md:h-2.5 bg-[#1E5EFF] rounded-full" />
                      </div>
                      <span className="font-black text-slate-900 text-xs md:text-sm">الدفع عند الاستلام</span>
                    </label>
                    <div className="flex items-center gap-3 p-3.5 md:p-4 rounded-xl md:rounded-2xl border-2 border-slate-100 bg-slate-50 opacity-50 grayscale cursor-not-allowed">
                      <CreditCard size={18} className="text-slate-400" />
                      <span className="font-black text-slate-400 text-xs md:text-sm">بطاقة بنكية (قريباً)</span>
                    </div>
                  </div>
                </div>

                {/* Desktop CTA Button */}
                <motion.button 
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden md:flex w-full py-4.5 bg-gradient-to-r from-[#1E5EFF] to-[#3A8DFF] text-white rounded-2xl font-black text-xl shadow-[0_15px_30px_rgba(30,94,255,0.2)] hover:shadow-[0_20px_40px_rgba(30,94,255,0.4)] transition-all items-center justify-center gap-4 relative overflow-hidden group disabled:opacity-70 mt-4"
                >
                   {isSubmitting ? "جاري معالجة طلبك..." : "تأكيد الطلب الآن"}
                   <CheckCircle2 size={24} />
                </motion.button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Optimized Mobile Sticky CTA */}
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
          onClick={() => (document.getElementById('mobile-checkout-form') as HTMLFormElement)?.requestSubmit()}
          disabled={isSubmitting}
          className="w-full py-4 bg-gradient-to-r from-[#1E5EFF] to-[#3A8DFF] text-white rounded-xl font-black text-lg shadow-lg shadow-[#1E5EFF]/20 active:scale-[0.97] transition-all flex items-center justify-center gap-3 overflow-hidden relative"
        >
          {isSubmitting ? "جاري المعالجة..." : "تأكيد الطلب الآن"}
          <div className="absolute inset-0 bg-white/10 -translate-x-full animate-[shimmer_2s_infinite]" />
        </button>
      </div>

    </main>
  );
}
