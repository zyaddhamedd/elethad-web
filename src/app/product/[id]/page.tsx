"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  ShoppingCart,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Heart,
  Truck,
  RotateCcw,
  Headphones,
  CreditCard,
  Award,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ProductDetailSkeleton } from "@/components/Skeletons";
const Footer = dynamic(() => import("@/components/Footer"), { ssr: true });
const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: true });
import { useCart } from "@/context/CartContext";
import { CATEGORY_MAP } from "@/lib/products";
import { fetchStorefrontCategories, fetchStorefrontProduct, StorefrontCategory, StorefrontProduct } from "@/lib/storefront-api";
import { getOptimizedCloudinaryUrl } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, setBuyNowItem, cartItems } = useCart();
  const [product, setProduct] = useState<StorefrontProduct | null>(null);
  const [categories, setCategories] = useState<StorefrontCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);

      try {
        const idOrSlug = params.id as string;
        const [fetchedProduct, fetchedCategories] = await Promise.all([
          fetchStorefrontProduct(idOrSlug),
          fetchStorefrontCategories(),
        ]);

        setProduct(fetchedProduct);
        setCategories(fetchedCategories);
        setActiveImage(0);
      } catch (error) {
        console.error("Failed to load product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [params.id]);

  const categoryLabelBySlug = categories.reduce<Record<string, string>>((accumulator, category) => {
    accumulator[category.slug] = category.name;
    return accumulator;
  }, {});

  const handleBuyNow = () => {
    if (!product) return;
    setIsBuying(true);
    setTimeout(() => {
      if (cartItems.length > 0) {
        setBuyNowItem(null);
      } else {
        setBuyNowItem({ id: product.id, name: product.name, price: product.price, image: product.image, quantity });
      }
      router.push("/checkout");
    }, 400);
  };

  if (isLoading || !product) {
    return <ProductDetailSkeleton />;
  }

  const productImages = (product.images && product.images.length > 0 ? product.images : [product.image]).filter(Boolean);
  const prevImage = () => setActiveImage((i) => (i - 1 + productImages.length) % productImages.length);
  const nextImage = () => setActiveImage((i) => (i + 1) % productImages.length);

  const features = [
    { icon: ShieldCheck, text: "ضمان شامل ٥ سنوات" },
    { icon: Truck,       text: "شحن سريع لكل المحافظات" },
    { icon: RotateCcw,  text: "سياسة استرجاع مرنة" },
    { icon: CheckCircle2,text: "تركيب مجاني بواسطة خبراء" },
  ];

  return (
    <main
      className="product-page-root bg-[#fafbfc] selection:bg-blue-100"
      dir="rtl"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <style>{`
        /* ── Product Page Root ── */
        .product-page-root {
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --surface: #ffffff;
          --border: #e8edf3;
          --text-main: #0f172a;
          --text-muted: #64748b;
        }

        /* ── Hero Section ── */
        .product-hero {
          display: grid;
          grid-template-columns: 45% 55%;
          height: calc(100vh - 130px);
          max-height: calc(100vh - 130px);
          overflow: hidden;
          gap: 0;
          padding-inline: 24px;
          align-items: center;
        }

        /* ── Image Panel ── */
        .image-panel {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 12px 16px 12px 8px;
        }

        .image-stage {
          position: relative;
          width: 100%;
          height: min(360px, calc(100vh - 260px));
          max-height: min(360px, calc(100vh - 260px));
          background: var(--surface);
          border-radius: 20px;
          border: 1px solid var(--border);
          box-shadow: 0 8px 30px rgba(0,0,0,0.05);
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* soft glow behind image */
        .image-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
          border-radius: 20px;
        }

        /* ── Slider Nav Arrows ── */
        .slider-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12);
          border: 1px solid rgba(255,255,255,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #334155;
          cursor: pointer;
          z-index: 20;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        }
        .slider-arrow:hover {
          background: var(--primary);
          color: #fff;
          box-shadow: 0 8px 24px rgba(37,99,235,0.35);
          transform: translateY(-50%) scale(1.08);
        }
        .slider-arrow-right { right: 10px; }
        .slider-arrow-left  { left:  10px; }

        /* ── Thumbnails ── */
        .thumbs-row {
          display: flex;
          gap: 6px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .thumb-btn {
          position: relative;
          width: 60px;
          height: 60px;
          border-radius: 10px;
          border: 2px solid transparent;
          background: var(--surface);
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
          cursor: pointer;
          transition: border-color 0.18s, transform 0.18s;
          overflow: hidden;
        }
        .thumb-btn:hover  { transform: scale(1.08); }
        .thumb-btn.active { border-color: var(--primary); }

        /* ── Content Panel ── */
        .content-panel {
          padding: 12px 8px 12px 24px;
          display: flex;
          flex-direction: column;
          gap: 0;
          overflow: hidden;
        }

        /* ── Description clamp ── */
        .product-desc {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Features compact grid ── */
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding: 10px 12px;
          background: #f8fafc;
          border-radius: 14px;
          border: 1px solid var(--border);
        }
        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .feature-icon {
          width: 30px;
          height: 30px;
          background: var(--surface);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
          flex-shrink: 0;
        }

        /* ── CTA Row ── */
        .cta-row {
          display: flex;
          gap: 10px;
          align-items: center;
        }
        .btn-cart {
          flex: 1;
          height: 44px;
          border: 2px solid #0f172a;
          color: #0f172a;
          background: transparent;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: background 0.18s, color 0.18s;
          white-space: nowrap;
        }
        .btn-cart:hover { background: #f1f5f9; }
        .btn-buy {
          flex: 1.4;
          height: 44px;
          background: var(--primary);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          box-shadow: 0 6px 20px rgba(37,99,235,0.3);
          transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
          white-space: nowrap;
        }
        .btn-buy:hover:not(:disabled) {
          background: var(--primary-dark);
          box-shadow: 0 8px 24px rgba(37,99,235,0.4);
          transform: translateY(-1px);
        }
        .btn-buy:disabled { opacity: 0.7; }

        /* ── Quantity control ── */
        .qty-ctrl {
          display: flex;
          align-items: center;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          overflow: hidden;
          height: 38px;
        }
        .qty-btn {
          width: 34px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          cursor: pointer;
          border: none;
          background: transparent;
          transition: color 0.15s;
        }
        .qty-btn:hover { color: var(--primary); }
        .qty-val { width: 34px; text-align: center; font-weight: 700; font-size: 14px; color: var(--text-main); }

        /* ── Mobile Sticky CTA ── */
        .mobile-cta {
          display: none;
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: rgba(255,255,255,0.88);
          backdrop-filter: blur(16px);
          border-top: 1px solid var(--border);
          padding: 10px 16px;
          z-index: 50;
          gap: 10px;
          align-items: center;
          box-shadow: 0 -8px 30px rgba(0,0,0,0.06);
        }

        /* ── Mobile ── */
        @media (max-width: 767px) {
          .product-page-root {
            height: auto !important;
            overflow: auto !important;
          }
          .product-hero {
            grid-template-columns: 1fr;
            height: auto;
            max-height: none;
            padding-inline: 12px;
            padding-bottom: 90px;
          }
          .image-stage {
            max-height: 250px;
            height: 250px;
          }
          .content-panel {
            padding: 8px 0;
          }
          .mobile-cta { display: flex; }
        }

        /* ── New Sections ── */
        .premium-section-container {
          background: #fff;
          position: relative;
          z-index: 5;
        }

        .section-title {
          font-size: clamp(22px, 3vw, 30px);
          font-weight: 800;
          color: var(--text-main);
          margin-bottom: 30px;
          text-align: center;
        }

        .deep-description {
          padding: 80px 24px;
          background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .deep-description p {
          max-width: 800px;
          font-size: 16px;
          line-height: 1.9;
          color: var(--text-muted);
          margin-bottom: 24px;
          font-weight: 500;
        }

        .features-expansion {
          padding: 80px 24px;
        }
        .features-grid-expanded {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 30px;
          max-width: 1100px;
          margin: 0 auto;
        }
        .feature-card-expanded {
          background: var(--surface);
          padding: 30px;
          border-radius: 20px;
          border: 1px solid var(--border);
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          display: flex;
          gap: 20px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card-expanded:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.06);
        }
        .feature-expanded-icon {
          width: 48px;
          height: 48px;
          background: #eff6ff;
          color: var(--primary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .feature-expanded-info h3 {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-main);
          margin-bottom: 8px;
        }
        .feature-expanded-info p {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.6;
          font-weight: 500;
        }

        .reviews-section {
          padding: 80px 24px;
          background: #f8fafc;
          overflow: hidden;
        }
        .reviews-container {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding: 20px 0 40px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          max-width: 1200px;
          margin: 0 auto;
        }
        .reviews-container::-webkit-scrollbar { display: none; }
        .review-card {
          min-width: 340px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(12px);
          padding: 28px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.6);
          box-shadow: 0 10px 35px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }
        .review-card:hover { 
          transform: translateY(-5px) scale(1.02);
          background: #fff;
          box-shadow: 0 15px 45px rgba(0,0,0,0.08);
        }
        .review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
        .customer-info { display: flex; align-items: center; gap: 12px; }
        .customer-avatar { width: 40px; height: 40px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #64748b; font-size: 14px; }
        .customer-name { font-weight: 700; color: var(--text-main); font-size: 16px; }
        .review-stars { display: flex; gap: 2px; color: #f59e0b; }
        .review-text { font-size: 15px; color: var(--text-muted); line-height: 1.7; font-weight: 500; font-style: italic; }

        .trust-strip {
          padding: 60px 24px;
          background: #fff;
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: center;
          gap: 60px;
          flex-wrap: wrap;
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .trust-item-icon { 
          width: 44px;
          height: 44px;
          background: #f0fdf4;
          color: #10b981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .trust-item-text { font-weight: 700; color: var(--text-main); font-size: 16px; }

        .final-cta {
          padding: 120px 24px;
          text-align: center;
          background: radial-gradient(circle at 50% 50%, rgba(37,99,235,0.03) 0%, #ffffff 100%);
        }
        .final-cta h2 {
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 900;
          color: var(--text-main);
          margin-bottom: 35px;
        }
        .btn-final {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: var(--primary);
          color: #fff;
          padding: 20px 56px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 20px;
          box-shadow: 0 15px 35px rgba(37,99,235,0.3);
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: none;
          cursor: pointer;
        }
        .btn-final:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 50px rgba(37,99,235,0.5);
          background: var(--primary-dark);
        }

        @media (max-width: 767px) {
          .features-grid-expanded { grid-template-columns: 1fr; }
          .trust-strip { gap: 30px; justify-content: center; padding: 40px 24px; }
          .review-card { min-width: 290px; padding: 22px; }
          .section-title { margin-bottom: 25px; }
          .final-cta { padding: 80px 24px; }
          .trust-item { flex-direction: column; text-align: center; width: calc(50% - 20px); }
        }
      `}</style>

      <Navbar />

      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-2 text-[12px] font-bold text-slate-400 px-6"
        style={{ paddingTop: "72px", paddingBottom: "6px" }}
      >
        <Link href="/" className="hover:text-blue-600 transition-colors">الرئيسية</Link>
        <ChevronLeft size={12} className="rotate-180" />
        <Link href="/products" className="hover:text-blue-600 transition-colors">المنتجات</Link>
        <ChevronLeft size={12} className="rotate-180" />
        <span className="text-slate-700 line-clamp-1">{product.name}</span>
      </nav>

      {/* ── Hero 2-Column Grid ── */}
      <div className="product-hero">

        {/* ── LEFT col (45%): Image Slider ── */}
        <div className="image-panel">
          <div className="image-stage">
            {/* Soft glow */}
            <div className="image-glow" />

            {/* Crossfade image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: "easeInOut" }}
                style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}
              >
                <Image
                  src={getOptimizedCloudinaryUrl(productImages[activeImage] || product.image, 1200, "products") || product.image}
                  alt={product.name}
                  fill
                  className="object-contain"
                  style={{ padding: "20px" }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                  priority
                  quality={85}
                />
              </motion.div>
            </AnimatePresence>

            {/* Nav Arrows — always visible if >1 image */}
            {productImages.length > 1 && (
              <>
                <button className="slider-arrow slider-arrow-right" onClick={nextImage} aria-label="الصورة التالية">
                  <ChevronRight size={18} />
                </button>
                <button className="slider-arrow slider-arrow-left" onClick={prevImage} aria-label="الصورة السابقة">
                  <ChevronLeft size={18} />
                </button>
              </>
            )}

            {/* Favorite */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              style={{ position: "absolute", top: 10, left: 10, zIndex: 20 }}
              className={`w-9 h-9 rounded-full bg-white/85 backdrop-blur shadow-sm border border-slate-100 flex items-center justify-center transition-all ${isFavorite ? "text-red-500 bg-red-50" : "text-slate-300 hover:text-red-400"}`}
            >
              <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            </button>

            {/* Dot indicators */}
            {productImages.length > 1 && (
              <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 5, zIndex: 20 }}>
                {productImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    style={{
                      width: activeImage === i ? 18 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: activeImage === i ? "var(--primary)" : "#cbd5e1",
                      border: "none",
                      cursor: "pointer",
                      transition: "width 0.25s ease, background 0.2s",
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {productImages.length > 1 && (
            <div className="thumbs-row">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`thumb-btn ${activeImage === idx ? "active" : ""}`}
                >
                  <Image
                    src={getOptimizedCloudinaryUrl(img, 200, "products") || img}
                    alt={`صورة ${idx + 1}`}
                    fill
                    className="object-contain"
                    style={{ padding: "4px" }}
                    sizes="64px"
                    loading="lazy"
                    quality={70}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT col (55%): Product Info ── */}
        <div className="content-panel">

          {/* Category + Stock */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span style={{ padding: "3px 10px", background: "#eff6ff", color: "#2563eb", fontSize: 10, fontWeight: 900, borderRadius: 999, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {categoryLabelBySlug[product.category] || CATEGORY_MAP[product.category] || product.category}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#059669", fontSize: 11, fontWeight: 700 }}>
              <span style={{ width: 6, height: 6, background: "#10b981", borderRadius: "50%", display: "inline-block", animation: "pulse 2s infinite" }} />
              متوفر في المخزن
            </div>
          </div>

          {/* Product Name */}
          <h1 style={{ fontSize: "clamp(18px, 2vw, 26px)", fontWeight: 800, color: "#0f172a", lineHeight: 1.25, marginBottom: 6 }}>
            {product.name}
          </h1>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <div style={{ display: "flex", gap: 2, color: "#f59e0b" }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span style={{ fontWeight: 700, fontSize: 12, color: "#0f172a" }}>{product.rating}</span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>({product.reviews} تقييم)</span>
          </div>

          {/* Price */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: "clamp(20px, 2.2vw, 28px)", fontWeight: 800, color: "#2563eb" }}>
              {product.price.toLocaleString("ar-EG")}
            </span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>جنية مصري</span>
          </div>

          {/* Description — 3-line clamp */}
          <p
            className="product-desc"
            style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, marginBottom: 10 }}
          >
            {product.description}
          </p>

          {/* Features compact 2-col grid */}
          <div className="features-grid" style={{ marginBottom: 12 }}>
            {features.map((item, i) => (
              <div key={i} className="feature-item">
                <div className="feature-icon"><item.icon size={15} /></div>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>{item.text}</span>
              </div>
            ))}
          </div>

          {/* Quantity + CTA inline */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={13} /></button>
              <span className="qty-val">{quantity}</span>
              <button className="qty-btn" onClick={() => setQuantity(q => q + 1)}><Plus size={13} /></button>
            </div>

            <div className="cta-row" style={{ flex: 1 }}>
              <button
                className="btn-cart"
                onClick={() => { for (let i = 0; i < quantity; i++) addToCart(product); }}
              >
                <ShoppingCart size={15} />
                أضف للسلة
              </button>

              <button
                className="btn-buy"
                disabled={isBuying}
                onClick={handleBuyNow}
              >
                <Zap size={15} className={isBuying ? "animate-spin" : "fill-current"} />
                {isBuying ? "جاري..." : "اطلب الآن"}
              </button>
            </div>
          </div>

          {/* Trust micro-copy */}
          <p style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
            <ShieldCheck size={11} />
            جميع الأسعار شاملة الضريبة · دفع آمن عند الاستلام
          </p>
        </div>
      </div>
      
      {/* ── Premium Extension Sections ── */}
      <div className="premium-section-container">
        
        {/* 1. Deep Description Block */}
        <section className="deep-description">
          <h2 className="section-title">لماذا هذه المضخة هي الخيار الأفضل؟</h2>
          <p>
            تعد هذه المضخة ثمرة سنوات من الابتكار الهندسي، حيث تم تصميمها لتوفير حل متكامل لمشاكل ضغط المياه في المنازل والمباني السكنية. بفضل محركها القوي وتكنولوجيتها الذكية، تضمن لك تدفقاً مستمراً حتى في أصعب الظروف.
          </p>
          <p>
            لقد اخترنا أفضل الخامات العالمية من النحاس النقي والستانلس ستيل لضمان مقاومة قصوى للتآكل والصدأ، مما يجعلها استثماراً طويل الأمد يوفر لك راحة البال لسنوات طويلة دون الحاجة للصيانة المستمرة.
          </p>
        </section>

        {/* 2. Features Expansion Grid */}
        <section className="features-expansion">
          <h2 className="section-title">مميزات تقنية تجعلنا في الصدارة</h2>
          <div className="features-grid-expanded">
            {[
              {
                title: "تكنولوجيا ألمانية متطورة",
                desc: "صُممت المضخة بأعلى معايير الهندسة الألمانية لضمان أداء مستقر وعمر افتراضي طويل جداً.",
                icon: Award
              },
              {
                title: "توفير ذكي للطاقة",
                desc: "نظام تشغيل ذكي يقلل استهلاك الكهرباء بنسبة تصل إلى 40% مقارنة بالموديلات التقليدية.",
                icon: Zap
              },
              {
                title: "هدوء تام أثناء التشغيل",
                desc: "محرك صامت تماماً يجعلها مثالية للتركيب داخل الشقق أو في المناطق التي تتطلب هدوءاً.",
                icon: Headphones
              },
              {
                title: "مقاومة فائقة للصدأ",
                desc: "أجزاء داخلية من الستانلس ستيل والنحاس النقي لمواجهة أملاح المياه والترسبات.",
                icon: CheckCircle2
              }
            ].map((f, i) => (
              <div key={i} className="feature-card-expanded">
                <div className="feature-expanded-icon"><f.icon size={24} /></div>
                <div className="feature-expanded-info">
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Customer Reviews Section */}
        <section className="reviews-section">
          <h2 className="section-title">آراء العملاء</h2>
          <div className="reviews-container">
            {[
              { name: "أحمد منصور", text: "ممتازة جداً، ضغط الميه فرق معايا كتير والتركيب كان سريع جداً ومحترف.", initial: "أ" },
              { name: "سارة محمود", text: "الموتور صوته واطي فعلاً ومبيسخنش حتى مع التشغيل المستمر. خدمة ممتازة.", initial: "س" },
              { name: "كريم حسن", text: "تجربة شراء رائعة، التوصيل كان في خلال ٢٤ ساعة والمنتج أصلي وبالضمان.", initial: "ك" },
              { name: "هاني يوسف", text: "أنصح بها بشدة لكل حد بيعاني من ضعف الميه في الأدوار العليا. فعلاً جبارة.", initial: "ه" }
            ].map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <div className="customer-info">
                    <div className="customer-avatar">{r.initial}</div>
                    <span className="customer-name">{r.name}</span>
                  </div>
                  <div className="review-stars">
                    {[...Array(5)].map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                  </div>
                </div>
                <p className="review-text">"{r.text}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Trust Indicators Strip */}
        <section className="trust-strip">
          {[
            { icon: ShieldCheck, text: "ضمان 5 سنوات" },
            { icon: CreditCard, text: "دفع عند الاستلام" },
            { icon: Truck, text: "شحن سريع" },
            { icon: MessageSquare, text: "دعم فني 24/7" }
          ].map((t, i) => (
            <div key={i} className="trust-item">
              <div className="trust-item-icon">
                <t.icon size={22} />
              </div>
              <span className="trust-item-text">{t.text}</span>
            </div>
          ))}
        </section>

        {/* 5. Final CTA Block */}
        <section className="final-cta">
          <h2>جاهز لتحسين تدفق المياه في منزلك؟</h2>
          <button className="btn-final" onClick={handleBuyNow}>
            اطلب الآن ووفّر 10% اليوم
            <Zap size={22} fill="currentColor" />
          </button>
        </section>
      </div>

      {/* Mobile Sticky CTA */}
      <div className="mobile-cta">
        <div style={{ flexGrow: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 900, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>السعر الإجمالي</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#2563eb" }}>{(product.price * quantity).toLocaleString("ar-EG")} ج.م</div>
        </div>
        <button className="btn-buy" style={{ flex: "0 0 auto", paddingInline: 24 }} onClick={handleBuyNow}>
          اطلب الآن
        </button>
      </div>

      <Footer />
    </main>
  );
}
