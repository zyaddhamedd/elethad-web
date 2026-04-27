/**
 * Reusable skeleton loader components for all pages.
 * Uses pure CSS animations — no JS overhead.
 */

// ── Product Card Skeleton ──────────────────────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl md:rounded-[2rem] bg-white border border-slate-100 shadow-sm overflow-hidden h-[300px] md:h-[440px] flex flex-col">
      {/* Image area */}
      <div className="flex-grow bg-slate-100 skeleton-pulse" />
      {/* Info panel */}
      <div className="p-4 md:p-5 bg-slate-50 space-y-2">
        <div className="h-2.5 w-1/3 rounded-full bg-slate-200 skeleton-pulse" />
        <div className="h-4 w-4/5 rounded-full bg-slate-200 skeleton-pulse" />
        <div className="h-5 w-2/5 rounded-full bg-slate-200 skeleton-pulse" />
      </div>
    </div>
  );
}

// ── Product Grid Skeleton (4 cards) ───────────────────────────────────────
export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Section Skeleton (generic block) ─────────────────────────────────────
export function SectionSkeleton({ height = "h-64" }: { height?: string }) {
  return (
    <div className={`w-full ${height} bg-slate-100 skeleton-pulse rounded-2xl`} />
  );
}

// ── Product Detail Hero Skeleton ──────────────────────────────────────────
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white pt-24 px-4 md:px-12" dir="rtl">
      <div className="grid md:grid-cols-[45%_55%] gap-8 max-w-7xl mx-auto">
        {/* Image panel */}
        <div className="space-y-3">
          <div className="w-full h-[300px] md:h-[400px] rounded-2xl bg-slate-100 skeleton-pulse" />
          <div className="flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-16 h-16 rounded-xl bg-slate-100 skeleton-pulse" />
            ))}
          </div>
        </div>
        {/* Content panel */}
        <div className="space-y-4 py-4">
          <div className="h-4 w-1/4 rounded-full bg-slate-200 skeleton-pulse" />
          <div className="h-8 w-3/4 rounded-lg bg-slate-200 skeleton-pulse" />
          <div className="h-4 w-1/3 rounded-full bg-slate-200 skeleton-pulse" />
          <div className="h-8 w-1/3 rounded-lg bg-slate-200 skeleton-pulse" />
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-3 w-full rounded-full bg-slate-100 skeleton-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-xl bg-slate-100 skeleton-pulse" />
            ))}
          </div>
          <div className="h-12 w-full rounded-xl bg-slate-200 skeleton-pulse" />
        </div>
      </div>
    </div>
  );
}

// ── Checkout Skeleton ─────────────────────────────────────────────────────
export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 px-4 md:px-12" dir="rtl">
      <div className="max-w-4xl mx-auto grid md:grid-cols-[1fr_380px] gap-8">
        <div className="space-y-4">
          <div className="h-8 w-1/3 rounded-lg bg-slate-200 skeleton-pulse" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 w-full rounded-xl bg-slate-200 skeleton-pulse" />
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-8 w-2/3 rounded-lg bg-slate-200 skeleton-pulse" />
          <div className="h-40 w-full rounded-xl bg-slate-200 skeleton-pulse" />
          <div className="h-14 w-full rounded-xl bg-slate-300 skeleton-pulse" />
        </div>
      </div>
    </div>
  );
}
