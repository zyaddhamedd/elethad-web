import type { Metadata } from "next";
import dynamic from "next/dynamic";
import ServicesHero from "@/components/services/ServicesHero";
import { SectionSkeleton } from "@/components/Skeletons";

export const metadata: Metadata = {
  title: "خدماتنا - الاتحاد لأنظمة المياه",
  description: "نقدم مجموعة متكاملة من الخدمات تشمل التوريد والتركيب والصيانة الدورية وحلول المياه المخصصة.",
};

// Lazy load all below-fold sections
const ServicesGrid = dynamic(() => import("@/components/services/ServicesGrid"), {
  loading: () => <SectionSkeleton height="h-96" />,
  ssr: true,
});

const WhyChooseUs = dynamic(() => import("@/components/services/WhyChooseUs"), {
  loading: () => <SectionSkeleton height="h-64" />,
  ssr: true,
});

const ProcessTimeline = dynamic(() => import("@/components/services/ProcessTimeline"), {
  loading: () => <SectionSkeleton height="h-80" />,
  ssr: true,
});

const ProjectsGrid = dynamic(() => import("@/components/services/ProjectsGrid"), {
  loading: () => <SectionSkeleton height="h-96" />,
  ssr: true,
});

const Testimonials = dynamic(() => import("@/components/Testimonials"), {
  loading: () => <SectionSkeleton height="h-80" />,
  ssr: true,
});

const FinalCTA = dynamic(() => import("@/components/services/FinalCTA"), {
  loading: () => <SectionSkeleton height="h-48" />,
  ssr: true,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <SectionSkeleton height="h-64" />,
  ssr: true,
});

const ServicesPage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero is critical — SSR + no lazy */}
      <ServicesHero />
      <ServicesGrid />
      <WhyChooseUs />
      <ProcessTimeline />
      <ProjectsGrid />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default ServicesPage;
