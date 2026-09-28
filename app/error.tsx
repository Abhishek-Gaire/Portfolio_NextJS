"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/primitives/Button";
import { MonoTag } from "@/components/primitives/MonoTag";

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
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-measure text-center">
        <MonoTag accent as="p" className="mb-5 inline-block">
          Something went wrong
        </MonoTag>
        <h1 className="font-mono text-[clamp(30px,5.4vw,52px)] font-bold leading-[1.1] tracking-[-0.03em] text-hi">
          We hit an unexpected error
        </h1>
        <p className="mx-auto mt-5 max-w-measure text-lede text-mid">
          Please try again. If the problem continues, refresh the page or come back later.
        </p>

        {error?.digest ? (
          <p className="mt-5 font-mono text-caption text-low">
            Error reference: <span className="text-mid">{error.digest}</span>
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <Button onClick={reset} variant="primary">
            Try again
          </Button>
          <Button as={Link} href="/">
            Go to homepage
          </Button>
        </div>
      </div>
    </main>
  );
}
