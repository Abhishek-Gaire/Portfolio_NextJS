import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import BlogHomeContent from "../../components/blog/BlogHomeContent";
import BlogTagContent from "../../components/blog/BlogTagContent";
import BlogLimitControl from "../../components/blog/BlogLimitControl";
import BlogsViewToggle from "../../components/blog/BlogsViewToggle";

import type { BlogPost, Tag } from "../../types/blog";
import { getSupabaseServerClient } from "../../lib/supabase/server";
import { estimateReadingTime, formatDate } from "../../utils/dateUtils";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Read blog posts on web development, software engineering, projects, and technical learnings.",
  alternates: {
    canonical: "/blogs",
  },
  openGraph: {
    title: "Blogs",
    description:
      "Read blog posts on web development, software engineering, projects, and technical learnings.",
    url: "/blogs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blogs",
    description:
      "Read blog posts on web development, software engineering, projects, and technical learnings.",
  },
};

export const revalidate = 300;

const POSTS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

type BlogsPageProps = {
  searchParams?: Promise<{
    search?: string;
    sort?: string;
    view?: string;
    page?: string;
    limit?: string;
    tag?: string | string[];
  }>;
};

const safeParseTag = (tag: string): Tag | null => {
  try {
    return JSON.parse(tag) as Tag;
  } catch {
    return null;
  }
};

function normalizeTags(tags: unknown): Tag[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => {
      if (typeof tag === "string") {
        return safeParseTag(tag) ?? { id: tag, name: tag };
      }

      if (tag && typeof tag === "object" && "id" in tag && "name" in tag) {
        return tag as Tag;
      }

      return null;
    })
    .filter((tag): tag is Tag => Boolean(tag));
}

async function fetchTags() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("tags").select("*").order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Tag[];
}

async function fetchPosts() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("Blogs")
    .select("*")
    .eq("publish", true);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as BlogPost[];
}

function buildBlogsHref({
  search,
  sort,
  limit,
  view,
  page,
  tags,
}: {
  search?: string;
  sort?: string;
  limit?: number;
  view?: string;
  page?: number;
  tags?: string[];
}) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (sort) params.set("sort", sort);
  if (limit) params.set("limit", String(limit));
  if (view) params.set("view", view);
  if (page) params.set("page", String(page));
  (tags ?? []).forEach((tag) => params.append("tag", tag));

  const query = params.toString();
  return query ? `/blogs?${query}` : "/blogs";
}

function parsePositiveInt(
  value: string | undefined,
  fallback: number,
  min = 1,
  max?: number
) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  const clamped = Math.max(min, parsed);
  if (typeof max === "number") {
    return Math.min(max, clamped);
  }
  return clamped;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const [tags, posts] = await Promise.all([fetchTags(), fetchPosts()]);
  const resolvedSearchParams = await searchParams;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://example.com";
  const nonce = (await headers()).get("x-nonce") ?? "";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blogs",
        item: `${siteUrl}/blogs`,
      },
    ],
  };

  const view = resolvedSearchParams?.view === "list" ? "list" : "grid";
  const page = parsePositiveInt(resolvedSearchParams?.page, 1, 1);
  const limit = parsePositiveInt(resolvedSearchParams?.limit, 5, 1, 50);
  const search = resolvedSearchParams?.search ?? "";
  const sortBy = resolvedSearchParams?.sort === "oldest" ? "oldest" : "newest";
  const selectedTags = Array.isArray(resolvedSearchParams?.tag)
    ? resolvedSearchParams?.tag
    : resolvedSearchParams?.tag
      ? [resolvedSearchParams.tag]
      : [];

  const normalizedSearch = search.toLowerCase().trim();

  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        !normalizedSearch ||
        post.title.toLowerCase().includes(normalizedSearch);

      const postTags = normalizeTags(post.tags);
      const matchesTags =
        selectedTags.length === 0 ||
        postTags.some((tag) => selectedTags.includes(tag.name));

      return matchesSearch && matchesTags;
    })
    .sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pageStart = (safePage - 1) * limit;
  const pageEnd = pageStart + limit;
  const paginatedPosts = filteredPosts.slice(pageStart, pageEnd);

  return (
    <main className="min-h-screen bg-black pt-20">
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="container mx-auto px-6 py-16">
        <nav className="flex items-center mb-12 text-gray-400 text-sm">
          <Link
            href="/"
            className="hover:text-white transition-colors hover:translate-x-1 duration-300"
          >
            Home
          </Link>
          <span className="mx-3 text-gray-600">/</span>
          <span className="text-white">Blogs</span>
        </nav>

        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-400 text-sm font-medium mb-6">
            <Search size={16} className="mr-2" />
            Blog Collection
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            My Blog Posts
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Insights, tutorials, and thoughts on web development, technology
            trends, and software engineering best practices
          </p>
        </div>

        <form className="mb-12 space-y-6 lg:space-y-0 lg:flex lg:items-center lg:justify-between" method="get">
          <div className="relative flex-1 max-w-xl">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search by title..."
              className="pl-12 pr-4 py-3 w-full bg-gray-800/50 border border-gray-600/50 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 placeholder-gray-500 hover:border-gray-500/50"
            />
            {search && (
              <Link
                href={buildBlogsHref({
                  search: undefined,
                  sort: sortBy,
                  limit,
                  view,
                  page: 1,
                  tags: selectedTags,
                })}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded transition-all duration-300"
                aria-label="Clear search"
              >
                <X size={16} />
              </Link>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <select
              name="sort"
              defaultValue={sortBy}
              className="bg-gray-800/50 border border-gray-600/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-500/50"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <input type="hidden" name="view" value={view} />
            {selectedTags.map((tag) => (
              <input key={tag} type="hidden" name="tag" value={tag} />
            ))}
            <BlogsViewToggle />
          </div>
        </form>

        {tags.length > 0 && (
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-white mb-4">
              Filter by Tags
            </h3>
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => {
                const nextSelected = selectedTags.includes(tag.name)
                  ? selectedTags.filter((name) => name !== tag.name)
                  : [...selectedTags, tag.name];

                const params = new URLSearchParams();
                if (search) params.set("search", search);
                if (sortBy) params.set("sort", sortBy);
                if (limit) params.set("limit", String(limit));
                if (view) params.set("view", view);
                nextSelected.forEach((name) => params.append("tag", name));

                const href = params.toString() ? `/blogs?${params.toString()}` : "/blogs";

                return (
                  <Link
                    key={tag.id}
                    href={href}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${selectedTags.includes(tag.name)
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/50 hover:text-white"
                      }`}
                  >
                    {tag.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        <div
          className={`grid gap-8 ${view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
            }`}
        >
          {paginatedPosts.map((post) => {
            const previewContent = post.content?.substring(0, 150) ?? "";
            const readingTime = estimateReadingTime(post.content ?? "");

            return (
              <article
                key={post.id}
                className={`bg-gray-900 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500 transition-all duration-300 ${view === "list" ? "flex" : ""
                  }`}
              >
                {post.imageUrl?.trim() && (
                  <div className={view === "list" ? "w-1/4" : ""}>
                    <Image
                      src={post.imageUrl.trim()}
                      alt={post.title}
                      width={640}
                      height={360}
                      sizes={
                        view === "list"
                          ? "25vw"
                          : "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      }
                      unoptimized
                      loading="eager"
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className={`p-6 ${view === "list" ? "w-3/4" : ""}`}>
                  <h2 className="text-xl font-semibold mb-2 text-white">
                    <Link
                      href={`/blogs/${post.slug ?? post.id}`}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <span>{formatDate(post.created_at)}</span>
                    <span className="mx-2">•</span>
                    <span>{readingTime} min read</span>
                  </div>
                  <BlogHomeContent content={previewContent} />
                  <BlogTagContent post={post} />
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <BlogLimitControl options={POSTS_PER_PAGE_OPTIONS} defaultLimit={limit} />

          <div className="flex items-center space-x-3">
            <Link
              href={buildBlogsHref({
                search,
                sort: sortBy,
                limit,
                view,
                page: safePage > 1 ? safePage - 1 : undefined,
                tags: selectedTags,
              })}
              className={`p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed ${safePage <= 1
                ? "pointer-events-none opacity-50"
                : "hover:bg-gray-700/50 hover:border-gray-500/50"
                }`}
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </Link>
            <span className="text-sm text-gray-300 px-4">
              Page {safePage} of {totalPages}
            </span>
            <Link
              href={buildBlogsHref({
                search,
                sort: sortBy,
                limit,
                view,
                page: safePage < totalPages ? safePage + 1 : undefined,
                tags: selectedTags,
              })}
              className={`p-3 bg-gray-800/50 border border-gray-600/50 text-white rounded-xl transition-all duration-300 disabled:cursor-not-allowed ${safePage >= totalPages
                ? "pointer-events-none opacity-50"
                : "hover:bg-gray-700/50 hover:border-gray-500/50"
                }`}
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
