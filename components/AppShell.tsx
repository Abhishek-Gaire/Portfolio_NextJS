"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "./Header";
import Footer from "./Footer";
import ToastContainerClient from "./ToastContainerClient";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname.startsWith("/admin");

  return (
    <>
      <ToastContainerClient />
      {!isAuthRoute && <Header />}
      <div className="flex-1">{children}</div>
      {!isAuthRoute && <Footer />}
      <SpeedInsights />
    </>
  );
}
