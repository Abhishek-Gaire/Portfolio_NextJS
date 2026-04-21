"use client";

import Link from "next/link";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log for observability; replace with external reporting if needed.
    console.error("Unhandled route error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl rounded-2xl bg-white border border-gray-200 shadow-sm p-8 md:p-10">
        <p className="text-sm font-medium text-blue-600 mb-2">Something went wrong</p>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          We hit an unexpected error
        </h1>
        <p className="text-gray-600 mb-8">
          Please try again. If the problem continues, refresh the page or come back later.
        </p>

        {error?.digest ? (
          <p className="text-xs text-gray-500 mb-6">
            Error reference: <span className="font-mono">{error.digest}</span>
          </p>
        ) : null}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Go to homepage
          </Link>
        </div>
      </section>
    </main>
  );
}
