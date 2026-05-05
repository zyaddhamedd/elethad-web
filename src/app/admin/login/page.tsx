"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
        // Redirect to admin dashboard
        router.push("/admin");
        router.refresh(); // Force refresh to apply middleware state
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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-navy p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">لوحة الإدارة</h1>
          <p className="text-slate-300 mt-2 text-sm">قم بتسجيل الدخول للوصول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleLogin} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">اسم المستخدم</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="admin"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">كلمة المرور</label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
