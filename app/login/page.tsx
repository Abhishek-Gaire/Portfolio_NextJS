import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "../../components/auth/LoginForm";
import { BentoCard } from "@/components/primitives/BentoCard";
import { Eyebrow } from "@/components/primitives/Eyebrow";
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
    <main className="min-h-screen px-6 py-20">
      <div className="mx-auto w-full max-w-[440px]">
        <BentoCard className="p-7 sm:p-8">
          <Eyebrow>SECURE AREA</Eyebrow>
          <h1 className="text-title font-bold text-hi">Login</h1>
          <p className="mt-2.5 mb-7 text-[15px] text-mid">
            Sign in to access the admin dashboard.
          </p>

          <LoginForm />
        </BentoCard>
      </div>
    </main>
  );
}
