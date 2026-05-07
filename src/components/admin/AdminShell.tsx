"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.16),_transparent_24%),linear-gradient(180deg,#060816_0%,#0b1020_100%)] text-white" dir="rtl">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <AdminHeader title={title} subtitle={subtitle} onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
          <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}