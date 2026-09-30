import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb } from "@/components/primitives/Breadcrumb";
import { ArrowRight, ChevronLeft, ChevronRight, Search, X } from "lucide-react";
import BlogHomeContent from "../../components/blog/BlogHomeContent";
import BlogTagContent from "../../components/blog/BlogTagContent";
import BlogLimitControl from "../../components/blog/BlogLimitControl";
import BlogsViewToggle from "../../components/blog/BlogsViewToggle";
import { BentoCard } from "@/components/primitives/BentoCard";
import { CardBody, CardItem } from "@/components/motion/CardItem";
import { TiltCard } from "@/components/motion/TiltCard";
import { MonoTag } from "@/components/primitives/MonoTag";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";

import type { BlogPost, Tag } from "../../types/blog";
import { getSupabaseServerClient } from "../../lib/supabase/server";
import { estimateReadingTime } from "../../utils/dateUtils";

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
        const trimmed = tag.trim();
        const parsed = safeParseTag(trimmed);
        if (parsed) {
          return {
            ...parsed,
            id: String(parsed.id).trim(),
            name: parsed.name.trim(),
          };
        }
        return { id: trimmed, name: trimmed };
      }

      if (tag && typeof tag === "object" && "id" in tag && "name" in tag) {
        const t = tag as Tag;
        return { ...t, id: String(t.id).trim(), name: t.name.trim() };
      }

      return null;
    })
    .filter((tag): tag is Tag => Boolean(tag));
}

function stripMarkdown(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~>]/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatShortDate(dateString: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

async function fetchTags() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("tags").select("*").order("name");

  if (error) {
    console.error("Failed to fetch tags:", error.message);
    return []; // tags are non-critical, show page without them
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
  max?: number,
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
    "https://www.abhishekgaire.com.np";
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
  const selectedTags = (
    Array.isArray(resolvedSearchParams?.tag)
      ? resolvedSearchParams?.tag
      : resolvedSearchParams?.tag
        ? [resolvedSearchParams.tag]
        : []
  ).map((tag) => tag.trim());

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
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }
      return (
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / limit));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const pageStart = (safePage - 1) * limit;
  const pageEnd = pageStart + limit;
  const paginatedPosts = filteredPosts.slice(pageStart, pageEnd);
  const hasActiveFilter = Boolean(search) || selectedTags.length > 0;

  return (
    <main className="min-h-screen py-16">
      <script
        type="application/ld+json"
        nonce={nonce}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="mx-auto max-w-shell px-6">
        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Blogs" }]}
        />

        <SectionHead
          as="h1"
          eyebrow="WRITING"
          title="Latest blog posts"
          lede="Insights, tutorials, and thoughts on web development, technology trends, and software engineering best practices."
        />

        <form
          method="get"
          className="mb-6 flex flex-col gap-3 rounded-card border border-line bg-surface p-4 lg:flex-row lg:items-center"
        >
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-low"
              size={16}
              aria-hidden="true"
            />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search posts by title..."
              aria-label="Search posts by title"
              className="w-full rounded-control border border-line bg-code-bg py-2.5 pl-10 pr-9 text-[14px] text-hi transition-colors duration-200 placeholder:text-low focus:border-accent-line"
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-low transition-colors duration-200 hover:text-hi"
                aria-label="Clear search"
              >
                <X size={16} />
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              name="sort"
              defaultValue={sortBy}
              aria-label="Sort posts"
              className="rounded-control border border-line bg-code-bg px-3 py-2.5 text-[13.5px] text-mid transition-colors duration-200 hover:border-line-hi focus:border-accent-line"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            {/* `view` is a hidden input rather than a query built by JS because the
                toggle lives inside this form: without it, submitting the search or
                sort form would reset the view mode the user picked. */}
            <input type="hidden" name="view" value={view} />
            {selectedTags.map((tag) => (
              <input key={tag} type="hidden" name="tag" value={tag} />
            ))}
            <BlogsViewToggle />
          </div>
        </form>

        {tags.length > 0 && (
          <div className="mb-8">
            <p className="mb-3 font-mono text-micro text-low">FILTER BY TAGS</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const nextSelected = selectedTags.includes(tag.name)
                  ? selectedTags.filter((name) => name !== tag.name)
                  : [...selectedTags, tag.name];

                return (
                  <Link
                    key={tag.id}
                    href={buildBlogsHref({
                      search,
                      sort: sortBy,
                      limit,
                      view,
                      tags: nextSelected,
                    })}
                    aria-pressed={selectedTags.includes(tag.name)}
                    className={`rounded-full border px-2.5 py-1.25 font-mono text-[10.5px] transition-colors duration-200 ${
                      selectedTags.includes(tag.name)
                        ? "border-accent-line bg-accent-soft text-accent"
                        : "border-line text-low hover:border-line-hi hover:text-hi"
                    }`}
                  >
                    {tag.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {paginatedPosts.length === 0 ? (
          <BentoCard className="p-10 text-center">
            <p className="mb-2 font-mono text-micro text-accent">
              NO POSTS FOUND
            </p>
            <h2 className="mb-2.5 text-[17px] font-semibold text-hi">
              {hasActiveFilter
                ? "Nothing matches this filter"
                : "No blog posts published yet"}
            </h2>
            <p className="mx-auto max-w-measure text-[13.5px] text-mid">
              {hasActiveFilter
                ? "Try a different search term, or clear the selected tags to see every post."
                : "Check back soon for new writing on web development and software engineering."}
            </p>
            {hasActiveFilter && (
              <Link
                href="/blogs"
                className="mt-5 inline-flex items-center gap-1.5 font-mono text-micro text-hi transition-colors duration-200 hover:text-accent"
              >
                Clear all filters
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </BentoCard>
        ) : (
          <div
            className={`grid gap-4 ${
              view === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {paginatedPosts.map((post, index) => {
              const previewContent = `${stripMarkdown(post.content ?? "")
                .substring(0, 150)
                .trim()}....`;
              const readingTime = estimateReadingTime(post.content ?? "");
              const href = `/blogs/${post.slug ?? post.id}`;
              const isList = view === "list";
              const postTags = normalizeTags(post.tags);
              const categoryTag = postTags[0];
              const remainingTags: Tag[] = postTags.slice(1);
              const imageUrl = post.imageUrl?.trim();

              return (
                <Reveal key={post.id} delay={index * 60} className="h-full">
                  <TiltCard wrapperClassName="h-full w-full" className="h-full w-full">
                    <CardBody className="h-full w-full">
                      <BentoCard interactive clip={false} className="h-full w-full">
                        <article
                          className={`flex h-full flex-col ${isList ? "sm:flex-row" : ""}`}
                        >
                          {imageUrl && (
                            <CardItem translateZ={100} className="shrink-0">
                              {/*
                                A list card is far taller than 224px is wide,
                                so a full-height fill would crop these 16:9
                                covers down to a sliver. Fixed band, vertically
                                centred instead.
                              */}
                              <div
                                className={`flex shrink-0 items-center justify-center overflow-hidden rounded-t-card border-b border-line sm:border-b-0 sm:border-r ${
                                  isList ? "sm:w-56" : "h-37.5"
                                }`}
                              >
                                <Image
                                  src={imageUrl}
                                  alt={post.title}
                                  width={640}
                                  height={360}
                                  sizes={
                                    isList
                                      ? "224px"
                                      : "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                                  }
                                  loading={index === 0 ? "eager" : "lazy"}
                                  unoptimized
                                  className={isList ? "h-40 w-full" : "h-full w-full"}
                                />
                              </div>
                            </CardItem>
                          )}
                          <div className="flex flex-1 flex-col p-5.5">
                            <CardItem translateZ={50}>
                              {categoryTag && (
                                <MonoTag accent className="mb-3 w-fit">
                                  {categoryTag.name}
                                </MonoTag>
                              )}
                              <h2 className="mb-3 line-clamp-2 text-[16px] font-semibold leading-[1.4] text-hi">
                                <Link
                                  href={href}
                                  className="transition-colors duration-200 hover:text-accent"
                                >
                                  {post.title}
                                </Link>
                              </h2>
                            </CardItem>
                            <CardItem
                              translateZ={30}
                              className="mb-5 [&_.prose]:mb-0 [&_.prose]:text-[13.5px] [&_.prose]:leading-[1.6]"
                            >
                              <BlogHomeContent content={previewContent} />
                            </CardItem>
                            {remainingTags.length > 0 && (
                              <CardItem translateZ={20} className="mb-4">
                                <BlogTagContent post={{ ...post, tags: remainingTags }} />
                              </CardItem>
                            )}
                            <CardItem
                              translateZ={20}
                              className="mt-auto flex items-center justify-between border-t border-line pt-3.5 font-mono text-micro text-low"
                            >
                              <span className="flex items-center gap-2">
                                <span>{readingTime} min read</span>
                                <time dateTime={post.created_at}>
                                  {formatShortDate(post.created_at)}
                                </time>
                              </span>
                              <Link
                                href={href}
                                aria-label={`Read ${post.title}`}
                                className="group/read inline-flex items-center gap-1.5 text-hi transition-colors duration-200 hover:text-accent"
                              >
                                <span>Read</span>
                                <ArrowRight
                                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover/read:translate-x-[3px]"
                                  aria-hidden="true"
                                />
                              </Link>
                            </CardItem>
                          </div>
                        </article>
                      </BentoCard>
                    </CardBody>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-5 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <BlogLimitControl
            options={POSTS_PER_PAGE_OPTIONS}
            defaultLimit={limit}
          />

          <div className="flex items-center gap-3">
            <Link
              href={buildBlogsHref({
                search,
                sort: sortBy,
                limit,
                view,
                page: safePage > 1 ? safePage - 1 : undefined,
                tags: selectedTags,
              })}
              className={`flex h-10 w-10 items-center justify-center rounded-control border transition-colors duration-200 ${
                safePage <= 1
                  ? "pointer-events-none border-line text-low opacity-40"
                  : "border-line text-mid hover:border-line-hi hover:text-accent"
              }`}
              aria-label="Previous page"
              aria-disabled={safePage <= 1}
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </Link>
            <span className="min-w-26 text-center font-mono text-micro text-low">
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
              className={`flex h-10 w-10 items-center justify-center rounded-control border transition-colors duration-200 ${
                safePage >= totalPages
                  ? "pointer-events-none border-line text-low opacity-40"
                  : "border-line text-mid hover:border-line-hi hover:text-accent"
              }`}
              aria-label="Next page"
              aria-disabled={safePage >= totalPages}
            >
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
