import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "الاتحاد - لوحة الإدارة",
  description: "لوحة الإدارة الخاصة بتطبيق الاتحاد",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}