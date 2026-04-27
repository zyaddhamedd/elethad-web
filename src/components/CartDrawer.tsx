"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { isCartOpen, toggleCart, cartItems, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white shadow-2xl z-[210] flex flex-col"
            dir="rtl"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <h2 className="font-black text-slate-900 text-lg">سلة المشتريات</h2>
                  <p className="text-slate-400 text-xs font-bold">{totalItems} منتجات</p>
                </div>
              </div>
              <button 
                onClick={toggleCart}
                className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                    <ShoppingBag size={40} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900">السلة فارغة</h3>
                    <p className="text-slate-400 text-sm font-bold mt-1">ابدأ بتسوق أفضل المنتجات الآن</p>
                  </div>
                  <button 
                    onClick={toggleCart}
                    className="px-8 py-3 bg-blue-600 text-white rounded-full font-black text-sm shadow-lg shadow-blue-500/20"
                  >
                    تصفح المنتجات
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 p-2 shrink-0 overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-contain transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="font-black text-slate-900 text-sm leading-tight line-clamp-2 max-w-[150px]">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-blue-600 font-black text-sm mt-1">{item.price.toLocaleString("ar-EG")} ج.م</p>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-slate-50 w-fit rounded-full p-1 border border-slate-100">
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                        <span className="font-black text-sm text-slate-900 w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {cartItems.length > 0 && (
              <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-500 font-bold text-sm">
                    <span>إجمالي المنتجات</span>
                    <span>{totalPrice.toLocaleString("ar-EG")} ج.م</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-bold text-sm">
                    <span>الشحن</span>
                    <span className="text-emerald-600 uppercase text-[10px] font-black">مجاني بمناسبة الافتتاح</span>
                  </div>
                  <div className="h-px bg-slate-200 my-2" />
                  <div className="flex justify-between text-slate-900 font-black text-xl">
                    <span>الإجمالي</span>
                    <span className="text-blue-600">{totalPrice.toLocaleString("ar-EG")} ج.م</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link 
                    href="/checkout" 
                    onClick={toggleCart}
                    className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-full font-black text-base shadow-xl hover:bg-black transition-all"
                  >
                    <span>إتمام الطلب</span>
                    <ArrowLeft size={18} />
                  </Link>
                  <button 
                    onClick={toggleCart}
                    className="w-full py-3 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                  >
                    متابعة التسوق
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
