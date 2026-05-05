"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import CartDrawer from "@/components/CartDrawer";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      {children}
      {!isAdminRoute && <CartDrawer />}
    </>
  );
}