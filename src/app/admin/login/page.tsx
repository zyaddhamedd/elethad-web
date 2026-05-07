"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "فشل تسجيل الدخول. يرجى التحقق من بياناتك.");
      }
    } catch (err) {
      setError("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_24%),linear-gradient(180deg,#060816_0%,#0b1020_100%)] flex items-center justify-center p-3 sm:p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_24px_80px_rgba(2,6,23,0.55)] overflow-hidden">
          
          {/* Header Section */}
          <div className="relative bg-gradient-to-b from-blue-600/20 to-transparent border-b border-white/10 p-6 sm:p-8 text-center">
            {/* Decorative background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.1),_transparent_60%)]" />
            
            {/* Logo */}
            <div className="relative mb-4 flex justify-center">
              <div className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-2xl shadow-[0_18px_35px_rgba(37,99,235,0.35)]">
                <Image 
                  src="/os.jpg" 
                  alt="شعار الاتحاد" 
                  fill 
                  className="object-cover" 
                  sizes="80px"
                  priority
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">الاتحاد</h1>
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.28em] text-blue-400/80">لوحة الإدارة</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-3">قم بتسجيل الدخول للوصول إلى لوحة التحكم</p>
          </div>

          {/* Form Section */}
          <form onSubmit={handleLogin} className="p-6 sm:p-8 space-y-5 sm:space-y-6">
            
            {/* Error Message */}
            {error && (
              <div className="animate-in fade-in rounded-2xl border border-rose-500/20 bg-rose-500/10 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-rose-200">
                <p className="flex items-start gap-2">
                  <span className="shrink-0 mt-0.5">⚠️</span>
                  <span>{error}</span>
                </p>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-300">اسم المستخدم</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  className="block w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-white/10 rounded-2xl bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                  placeholder="أدخل اسم المستخدم"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-xs sm:text-sm font-bold text-slate-300">كلمة المرور</label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="block w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 border border-white/10 rounded-2xl bg-white/5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white/10 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50"
                  placeholder="أدخل كلمة المرور"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-2xl font-bold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-500 shadow-[0_10px_20px_rgba(37,99,235,0.2)] focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] duration-200"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  جاري التحقق...
                </>
              ) : (
                "تسجيل الدخول"
              )}
            </button>

            {/* Info Footer */}
            <div className="pt-2 sm:pt-3 border-t border-white/10">
              <p className="text-[10px] sm:text-xs text-slate-500 text-center">
                حسابك محمي بتشفير عالي المستوى
              </p>
            </div>
          </form>
        </div>

        {/* Branding Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-xs sm:text-sm text-slate-500">
            <span className="text-blue-400 font-bold">الاتحاد</span> - نظام إدارة متكامل
          </p>
        </div>
      </div>
    </div>
  );
}
