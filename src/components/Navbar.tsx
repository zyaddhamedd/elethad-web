"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { toggleCart, totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "المنتجات", path: "/products" },
    { name: "خدماتنا", path: "/services" },
    { name: "تواصل معنا", path: "/contact" },
  ];

  return (
    <>
      <header
        dir="rtl"
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          isScrolled
            ? "bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] py-3"
            : "bg-transparent border-b border-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 max-w-[1400px]">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center group relative z-[110] cursor-pointer">
              <div className="relative">
                <span 
                  className={`text-2xl md:text-3xl font-black tracking-wide transition-all duration-500 ease-out group-hover:scale-105 ${
                    isScrolled 
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500" 
                      : "text-white"
                  }`}
                  style={{
                    textShadow: isScrolled 
                      ? "none"
                      : "0 0 12px rgba(37, 99, 235, 0.4), 0 2px 8px rgba(0,0,0,0.2)",
                    fontFamily: "'Segoe UI', 'Apple Color Emoji', system-ui, sans-serif",
                    letterSpacing: "0.05em"
                  }}
                >
                  الاتحاد
                </span>
                <div 
                  className={`absolute -inset-3 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    isScrolled 
                      ? "bg-blue-400/10" 
                      : "bg-blue-500/15"
                  }`} 
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative px-4 py-2 text-sm font-black transition-all duration-300 group overflow-hidden ${
                    pathname === link.path ? "text-blue-600" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="relative z-10">{link.name}</span>
                  {/* Indicator */}
                  {pathname === link.path && (
                    <motion.div 
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-1 bg-blue-600 rounded-full" 
                    />
                  )}
                  {/* Hover background */}
                  <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/50 rounded-full transition-colors -z-0" />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={toggleCart}
                className="relative p-2 text-slate-700 hover:text-blue-600 transition-all duration-300 hover:scale-110 group"
              >
                <ShoppingCart size={22} strokeWidth={2.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-blue-600 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link
                href="/products"
                className="group flex items-center gap-2 px-6 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-full font-bold text-sm transition-all shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
              >
                <span>تسوق الآن</span>
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden relative z-[110] w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            {/* Menu Content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 w-[80%] h-[100dvh] bg-white shadow-2xl md:hidden flex flex-col p-8"
              dir="rtl"
            >
              <div className="flex flex-col gap-8 mt-20">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`text-3xl font-black transition-all ${
                        pathname === link.path ? "text-blue-600 scale-105" : "text-slate-800"
                      } flex items-center justify-between group`}
                    >
                      {link.name}
                      <ArrowLeft className={`transition-transform ${pathname === link.path ? "opacity-100" : "opacity-0"}`} />
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-4">
                <button 
                  onClick={() => { setIsMobileMenuOpen(false); toggleCart(); }}
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-blue-50 text-blue-600 font-black"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={20} />
                    <span>سلة المشتريات</span>
                  </div>
                  {totalItems > 0 && (
                    <span className="w-6 h-6 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
                <Link
                  href="/products"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-5 rounded-2xl bg-slate-900 text-white font-black text-xl shadow-xl text-center hover:bg-blue-600 transition-colors"
                >
                  تسوق الآن
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
