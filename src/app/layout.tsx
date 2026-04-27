import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { CartProvider } from "@/context/CartContext";
import CartDrawer from "@/components/CartDrawer";

// ── Font: preload + swap to avoid FOUT blocking render ──────────────────────
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  display: "swap",     // non-blocking font load
  preload: true,
  weight: ["400", "500", "600", "700", "800", "900"],
});

// ── Shared Metadata ──────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "الاتحاد - مواتير مياه وفلاتر متميزة",
  description:
    "مواتير وفلاتر مياه عالية الجودة للاستخدام المنزلي والتجاري والصناعي.",
  robots: { index: true, follow: true },
};

// ── Viewport (separate export as required by Next.js 15+) ───────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      </head>
      <body className={`${cairo.variable} font-cairo antialiased bg-slate-50`}>
        <CartProvider>
          <Navbar />
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
