import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Image Optimization ───────────────────────────────────────────────────
  images: {
    // Prefer modern formats: AVIF first, then WebP
    formats: ["image/avif", "image/webp"],
    // Responsive sizes for srcset generation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 64, 128, 256, 384],
    // Minimize revalidation for static product images
    minimumCacheTTL: 31536000, // 1 year
  },

  // ─── Package Import Tree-Shaking ──────────────────────────────────────────
  // lucide-react is already optimized by default; framer-motion benefits here
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },

  // ─── HTTP Caching Headers ─────────────────────────────────────────────────
  async headers() {
    return [
      // Static assets (images, fonts, media) — 1-year immutable cache
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2|ttf|eot)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Videos — long cache
      {
        source: "/:all*(mp4|webm|ogg)",
        locale: false,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      // JS/CSS static chunks — immutable (Next.js hashes them)
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // Security & performance headers for all routes
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  // ─── Compression ─────────────────────────────────────────────────────────
  compress: true,

  // ─── Remove X-Powered-By header ──────────────────────────────────────────
  poweredByHeader: false,
};

export default nextConfig;
