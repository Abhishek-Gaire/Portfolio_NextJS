import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "../../components/auth/LoginForm";
import { getSupabaseServerAuthClient } from "../../lib/supabase/server-auth";

export const metadata: Metadata = {
  title: "Login | Abhishek Gaire",
  description: "Secure login page for portfolio administration.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function LoginPage() {
  const supabase = await getSupabaseServerAuthClient();
  const { data, error } = await supabase.auth.getUser();

  if (!error && data.user) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      <section className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Login</h1>
        <p className="text-gray-600 mb-8">
          Sign in to access the admin dashboard.
        </p>

        <div className="max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
