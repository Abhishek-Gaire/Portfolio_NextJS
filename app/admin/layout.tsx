import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import AdminGate from "../../components/admin/AdminGate";
import AdminSignOutButton from "../../components/admin/AdminSignOutButton";
import { getSupabaseServerAuthClient } from "../../lib/supabase/server-auth";

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s | Admin",
  },
  description: "Admin dashboard for managing portfolio content.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-image-preview": "none",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/admin",
  },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await getSupabaseServerAuthClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Portfolio CMS
            </p>
            <h1 className="text-sm font-semibold sm:text-base">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              Restricted
            </span>
            <AdminSignOutButton />
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8">
        <aside className="h-fit rounded-xl border border-slate-200 bg-white p-4">
          <nav aria-label="Admin navigation" className="space-y-2">
            <Link
              href="/admin/posts"
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Posts
            </Link>
            <Link
              href="/admin/projects"
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Projects
            </Link>
            <Link
              href="/admin/tags"
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Tags
            </Link>
            <Link
              href="/admin/notifications"
              className="block rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Notifications
            </Link>
          </nav>
        </aside>

        <AdminGate>
          <main
            id="admin-content"
            className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6"
          >
            {children}
          </main>
        </AdminGate>
      </div>
    </div>
  );
}
