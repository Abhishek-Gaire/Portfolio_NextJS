"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from '@vercel/analytics/next';

import Header from "./Header";
import Footer from "./Footer";
import ToastContainerClient from "./ToastContainerClient";

type AppShellProps = {
  children: ReactNode;
  /** True when served from typeshala.abhishekgaire.com.np (computed server-side in root layout). */
  isTypeshalaHost?: boolean;
};

export default function AppShell({ children, isTypeshalaHost = false }: AppShellProps) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname.startsWith("/admin");
  const isStandaloneRoute =
    pathname === "/typeshala" || pathname.startsWith("/typeshala/");
  // On the typeshala subdomain, "/" is rewritten to "/typeshala" but the
  // visible pathname stays "/", so hide the portfolio chrome there too.
  const isTypeshalaRoot = isTypeshalaHost && pathname === "/";
  const hideChrome = isAuthRoute || isStandaloneRoute || isTypeshalaRoot;

  return (
    <>
      <ToastContainerClient />
      {!hideChrome && <Header />}
      <div className="flex-1">{children}</div>
      {!hideChrome && <Footer />}
      <SpeedInsights />
      <Analytics />

    </>
  );
}
