import Link from "next/link";
import { Button } from "@/components/primitives/Button";
import { MonoTag } from "@/components/primitives/MonoTag";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-measure text-center">
        <MonoTag accent as="p" className="mb-5 inline-block">
          404 Error
        </MonoTag>
        <h1 className="font-mono text-[clamp(44px,9vw,88px)] font-bold leading-[1.05] tracking-[-0.03em] text-hi">
          Page not found
        </h1>
        <p className="mx-auto mt-5 max-w-measure text-lede text-mid">
          The page you’re looking for doesn’t exist or may have been moved.
          Please check the URL or navigate back to the homepage.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
          <Button as={Link} href="/" variant="primary">
            Go to Home
          </Button>
          <Button as={Link} href="/blogs">
            Browse Blogs
          </Button>
        </div>
      </div>
    </main>
  );
}
