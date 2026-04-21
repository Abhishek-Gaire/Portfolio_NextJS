import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl rounded-2xl bg-white shadow-sm border border-gray-200 p-8 md:p-12 text-center">
        <p className="text-sm font-semibold tracking-wide text-blue-600 uppercase">
          404 Error
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900">
          Page not found
        </h1>
        <p className="mt-4 text-gray-600 leading-relaxed">
          The page you’re looking for doesn’t exist or may have been moved.
          Please check the URL or navigate back to the homepage.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Go to Home
          </Link>
          <Link
            href="/blogs"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Browse Blogs
          </Link>
        </div>
      </section>
    </main>
  );
}
