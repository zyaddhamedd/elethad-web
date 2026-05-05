import Link from "next/link";
import { Mail, Phone, MapPin, ChevronLeft } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-10 md:pt-20 pb-6 md:pb-10 relative overflow-hidden" dir="rtl">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-16 pb-8 md:pb-16 border-b border-white/5">
          {/* Brand Col */}
          <div className="flex flex-col items-center md:items-start text-center md:text-right gap-4 md:gap-8">
            <Link href="/" className="flex items-center group">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <img 
                  src="/logo.svg" 
                  alt="الاتحاد" 
                  className="h-6 md:h-8 w-auto" 
                />
              </div>
            </Link>
            <p className="leading-relaxed text-[11px] md:text-sm font-medium text-slate-400 max-w-[280px]">
              مواتير مياه وأنظمة تنقية متطورة. تكنولوجيا ٢٠٢٨ بين يديك الآن.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all duration-300 group">
                <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 hover:text-white transition-all duration-300 group">
                <svg className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.98 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all duration-300 group">
                <svg className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Links Grid for Mobile */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:contents">
            {/* Quick Links */}
            <div>
              <h4 className="font-black text-white text-sm md:text-lg mb-4 md:mb-8 relative">
                المنتجات
                <span className="absolute -bottom-1.5 md:-bottom-2 right-0 w-6 md:w-8 h-0.5 md:h-1 bg-blue-500 rounded-full" />
              </h4>
              <ul className="flex flex-col gap-2.5 md:gap-4 text-[11px] md:text-sm font-medium">
                {[
                  { name: "مضخات ذكية", href: "/products?category=smart-pumps" },
                  { name: "تناضح عكسي", href: "/products?category=reverse-osmosis" },
                  { name: "مواتير صناعية", href: "/products?category=industrial" },
                  { name: "فلاتر مركزية", href: "/products?category=whole-house" }
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="hover:text-white transition-all duration-300 text-slate-400">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-black text-white text-sm md:text-lg mb-4 md:mb-8 relative">
                الشركة
                <span className="absolute -bottom-1.5 md:-bottom-2 right-0 w-6 md:w-8 h-0.5 md:h-1 bg-blue-500 rounded-full" />
              </h4>
              <ul className="flex flex-col gap-2.5 md:gap-4 text-[11px] md:text-sm font-medium">
                {[
                  { name: "الاستدامة", href: "/sustainability" },
                  { name: "وظائف", href: "/careers" },
                  { name: "اتصل بنا", href: "/contact" }
                ].map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="hover:text-white transition-all duration-300 text-slate-400">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 lg:col-span-1">
              <h4 className="font-black text-white text-sm md:text-lg mb-4 md:mb-8 relative">
                تواصل معنا
                <span className="absolute -bottom-1.5 md:-bottom-2 right-0 w-6 md:w-8 h-0.5 md:h-1 bg-blue-500 rounded-full" />
              </h4>
              <ul className="flex flex-col gap-4 md:gap-6 text-[11px] md:text-sm font-medium">
                <li className="flex items-start gap-3 md:gap-4 text-slate-400">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-blue-500">
                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <span>مول علي الدين،مبني ب،ميدان ليله, قسم ثان 6 أكتوبر، محافظة الجيزة</span>
                </li>
                <li className="flex items-center gap-3 md:gap-4 text-slate-400">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-blue-500">
                    <Phone className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <span dir="ltr">+20 100 570 8036</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-6 text-[10px] md:text-sm text-slate-500 font-bold uppercase tracking-wider">
          <p>&copy; {new Date().getFullYear()} شركة الاتحاد.</p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">الخصوصية</Link>
            <Link href="/terms" className="hover:text-white transition-colors">الشروط</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
