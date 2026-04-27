import React from "react";
import { Metadata } from "next";
import ContactHero from "@/components/contact/ContactHero";
import ContactOptions from "@/components/contact/ContactOptions";
import ContactForm from "@/components/contact/ContactForm";
import ContactMap from "@/components/contact/ContactMap";
import ContactCTA from "@/components/contact/ContactCTA";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "تواصل معنا - الاتحاد لأنظمة المياه",
  description: "تواصل مع فريق الاتحاد لأنظمة المياه للحصول على استشارات فنية، طلبات شراء، أو دعم فني متخصص.",
};

const ContactPage = () => {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <ContactHero />

      {/* Contact Options */}
      <ContactOptions />

      {/* Contact Form & Quick Info */}
      <ContactForm />

      {/* Map Section */}
      <ContactMap />

      {/* Final CTA */}
      <ContactCTA />

      {/* Footer */}
      <Footer />
    </main>
  );
};

export default ContactPage;
