import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import { SectionSkeleton, ProductGridSkeleton } from "@/components/Skeletons";

// ── Lazy load all below-the-fold sections with skeleton fallbacks ─────────
const Partners = dynamic(() => import("@/components/Partners"), {
  loading: () => <SectionSkeleton height="h-24" />,
  ssr: true,
});

const Categories = dynamic(() => import("@/components/Categories"), {
  loading: () => <SectionSkeleton height="h-80" />,
  ssr: true,
});

const PurchaseJourney = dynamic(() => import("@/components/PurchaseJourney"), {
  loading: () => <SectionSkeleton height="h-64" />,
  ssr: true,
});

const BestSellers = dynamic(() => import("@/components/BestSellers"), {
  loading: () => (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <ProductGridSkeleton count={4} />
      </div>
    </section>
  ),
  ssr: true,
});

const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  loading: () => <SectionSkeleton height="h-80" />,
  ssr: true,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <SectionSkeleton height="h-64" />,
  ssr: true,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary/30 selection:text-navy">
      {/* Hero is critical — loaded immediately, not lazy */}
      <Hero />
      <Partners />
      <Categories />
      <PurchaseJourney />
      <BestSellers />
      <Testimonials />
      <Footer />
    </main>
  );
}
