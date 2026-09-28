"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";

type LoginState = "idle" | "loading" | "success" | "error";

export default function LoginForm() {
  const router = useRouter();
  const [status, setStatus] = useState<LoginState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setStatus("error");
        setErrorMessage(error.message || "Unable to sign in.");
        return;
      }

      setStatus("success");
      router.push("/admin");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to sign in."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-label="Login form">
      <div>
        <label htmlFor="email" className="mb-2 block font-mono text-[11px] text-mid">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
          className="w-full rounded-control border border-line bg-surface-2 px-3.5 py-3 text-[14px] text-hi placeholder:text-low focus:border-accent-line"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block font-mono text-[11px] text-mid">
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          className="w-full rounded-control border border-line bg-surface-2 px-3.5 py-3 text-[14px] text-hi placeholder:text-low focus:border-accent-line"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {status === "error" && (
        <p className="rounded-control border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-[13px] text-red-300">
          {errorMessage || "Unable to sign in. Please try again."}
        </p>
      )}

      {status === "success" && (
        <p className="rounded-control border border-accent-line bg-accent-soft px-4 py-2.5 text-[13px] text-accent">
          Signed in successfully. Redirecting…
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-control bg-accent px-4 py-3 text-[13.5px] font-semibold text-[#08110f] transition-colors hover:bg-[#5eead4] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
