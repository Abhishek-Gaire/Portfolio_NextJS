import type { Metadata } from "next";
import Link from "next/link";
import { getSupabaseServerClient } from "../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard overview for portfolio content management.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const supabase = getSupabaseServerClient();

  const [posts, projects, tags, contacts] = await Promise.all([
    supabase.from("Blogs").select("*", { count: "exact", head: true }),
    supabase.from("Projects").select("*", { count: "exact", head: true }),
    supabase.from("tags").select("*", { count: "exact", head: true }),
    supabase.from("Contacts").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    {
      label: "Posts",
      value: posts.count ?? 0,
      href: "/admin/posts",
      description: "Create, edit, and publish blog posts.",
    },
    {
      label: "Projects",
      value: projects.count ?? 0,
      href: "/admin/projects",
      description: "Manage portfolio projects and details.",
    },
    {
      label: "Tags",
      value: tags.count ?? 0,
      href: "/admin/tags",
      description: "Organize content tags for filtering.",
    },
    {
      label: "Notifications",
      value: contacts.count ?? 0,
      href: "/admin/notifications",
      description: "Review contact and system notifications.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-20">
      <section className="mx-auto w-full max-w-4xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Admin Dashboard
        </h1>
        <p className="mt-3 text-gray-600">
          Snapshot of your content inventory. Choose a section to manage.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:border-gray-300 hover:bg-gray-100"
            >
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="mt-2 text-2xl font-semibold text-gray-900">
                {stat.value}
              </div>
              <p className="mt-1 text-sm text-gray-600">{stat.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
