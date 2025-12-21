import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مخزنكو - نظام إدارة المخازن والمحاسبة",
  description: "نظام متعدد المستأجرين لإدارة المخازن والمحاسبة والمبيعات",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

