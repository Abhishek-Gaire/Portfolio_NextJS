import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import BlogContent from "../../../components/blog/BlogContent";
import BlogTagContent from "../../../components/blog/BlogTagContent";
import ShareButtons from "../../../components/blog/ShareButtons";
import { BentoCard } from "@/components/primitives/BentoCard";
import { SectionHead } from "@/components/primitives/SectionHead";
import { getSupabaseServerClient } from "../../../lib/supabase/server";
import type { BlogPost, Tag } from "../../../types/blog";
import { estimateReadingTime, formatDate } from "../../../utils/dateUtils";

export const revalidate = 300;

function stripHtml(content: string) {
  return content.replace(/<[^>]*>/g, "").trim();
}

function getExcerpt(post: BlogPost) {
  if (post.excerpt) {
    return post.excerpt;
  }
  const safeContent = post.content?.trim() ?? "";
  if (!safeContent) {
    return "";
  }
  return stripHtml(safeContent).slice(0, 160);
}

function normalizeTags(tags: unknown): Tag[] {
  if (!Array.isArray(tags)) {
    return [];
  }

  return tags
    .map((tag) => {
      if (typeof tag === "string") {
        try {
          return JSON.parse(tag) as Tag;
        } catch {
          return { id: tag, name: tag };
        }
      }

      if (tag && typeof tag === "object" && "id" in tag && "name" in tag) {
        return tag as Tag;
      }

      return null;
    })
    .filter((tag): tag is Tag => Boolean(tag));
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

async function fetchPostBySlug(slug: string) {
  const supabase = getSupabaseServerClient();

  if (!slug) {
    return null;
  }

  const baseQuery = supabase.from("Blogs").select("*").eq("publish", true);

  const { data, error } = isUuid(slug)
    ? await baseQuery.eq("id", slug).maybeSingle()
    : await baseQuery.eq("slug", slug).maybeSingle();

  if (error) {
    return null;
  }

  return (data ?? null) as BlogPost | null;
}

async function fetchRelatedPosts(currentId: string, tags: Tag[]) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("Blogs")
    .select("id, title, imageUrl, created_at, tags, slug")
    .neq("id", currentId)
    .eq("publish", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    return [];
  }

  const allPosts = (data ?? []) as BlogPost[];

  if (!tags.length) {
    return [];
  }

  return allPosts.slice(0, 3);
}

async function fetchAdjacentPosts(createdAt: string) {
  const supabase = getSupabaseServerClient();
  const [prev, next] = await Promise.all([
    supabase
      .from("Blogs")
      .select("id, title, created_at, slug")
      .lt("created_at", createdAt)
      .eq("publish", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("Blogs")
      .select("id, title, created_at, slug")
      .gt("created_at", createdAt)
      .eq("publish", true)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);

  return {
    prev: (prev.data ?? null) as BlogPost | null,
    next: (next.data ?? null) as BlogPost | null,
  };
}

async function fetchAllSlugs() {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("Blogs")
    .select("id, slug")
    .eq("publish", true);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Array<{ id: string; slug?: string | null }>;
}

export async function generateStaticParams() {
  const posts = await fetchAllSlugs();
  return posts.map((post) => ({
    slug: post.slug ?? post.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  if (!slug) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const post = await fetchPostBySlug(slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${post.title} | Blog`;
  const description = getExcerpt(post);
  const canonicalPath = `/blogs/${post.slug ?? post.id}`;
  const publishedAt = post.created_at;
  const updatedAt = post.updated_at;
  const author = post.author ?? "Abhishek Gaire";

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: canonicalPath,
      images: post.imageUrl
        ? [{ url: post.imageUrl, alt: post.title }]
        : undefined,
      publishedTime: publishedAt,
      modifiedTime: updatedAt,
      authors: [author],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.imageUrl ? [post.imageUrl] : undefined,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) {
    notFound();
  }

  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const safeContent = post.content?.trim() ?? "";
  const readingTime = estimateReadingTime(safeContent);
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "https://www.abhishekgaire.com.np";
  const nonce = (await headers()).get("x-nonce") ?? "";
  const canonicalPath = `${siteUrl}/blogs/${post.slug ?? post.id}`;
  const author = post.author ?? "Abhishek Gaire";
  const excerpt = getExcerpt({ ...post, content: safeContent });
  const postTags = normalizeTags(post.tags);
  const relatedPosts = await fetchRelatedPosts(post.id, postTags);
  const { prev, next } = await fetchAdjacentPosts(post.created_at);
  const rawImageUrl = post.imageUrl?.trim();
  const imageUrl =
    rawImageUrl && rawImageUrl.startsWith("http")
      ? rawImageUrl
      : rawImageUrl
        ? `${siteUrl}${rawImageUrl}`
        : undefined;
  const displayImageUrl = rawImageUrl;

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: excerpt,
    author: {
      "@type": "Person",
      name: author,
    },
    datePublished: post.created_at,
    dateModified: post.updated_at ?? post.created_at,
    image: imageUrl ? [imageUrl] : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalPath,
    },
  };

  return (
    <main className="min-h-screen py-16">
      <div className="mx-auto max-w-shell px-6">
        {/*
          max-w-4xl here, max-w-3xl on the .prose inside it. The article is
          headroom; the prose is the measure. They move together — see the
          matching note on `.prose` in app/globals.css.
        */}
        <article className="mx-auto max-w-4xl">
          <script
            type="application/ld+json"
            nonce={nonce}
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(blogPostingJsonLd),
            }}
          />
          <nav className="mb-8 flex items-center gap-2 font-mono text-micro text-low">
            <Link
              href="/"
              className="transition-colors duration-200 hover:text-accent"
            >
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              href="/blogs"
              className="transition-colors duration-200 hover:text-accent"
            >
              Blogs
            </Link>
            <span aria-hidden="true">/</span>
            <span className="truncate text-mid">{post.title}</span>
          </nav>

          <header className="mb-8">
            <p className="mb-2.5 font-mono text-[13px] text-accent">WRITING</p>
            <h1 className="mb-4 text-display font-bold text-hi">
              {post.title}
            </h1>
            <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-micro text-low">
              <span className="text-mid">{author}</span>
              <span aria-hidden="true">•</span>
              <time dateTime={post.created_at}>
                {formatDate(post.created_at)}
              </time>
              <span aria-hidden="true">•</span>
              <span>{readingTime} min read</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <BlogTagContent post={post} />
            </div>
          </header>

          {displayImageUrl && (
            <div className="mb-8 overflow-hidden rounded-card border border-line">
              <Image
                src={displayImageUrl}
                alt={post.title}
                width={1200}
                height={400}
                sizes="(min-width: 768px) 720px, 100vw"
                unoptimized
                priority
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          <BentoCard className="p-6 sm:p-8">
            {safeContent ? (
              <BlogContent content={safeContent} />
            ) : (
              <p className="rounded-control border border-dashed border-line px-5 py-6 text-[14px] text-mid">
                Blog content is unavailable right now. Please check back soon.
              </p>
            )}
          </BentoCard>

          <ShareButtons
            url={canonicalPath}
            title={post.title}
            description={excerpt}
          />

          {(prev || next) && (
            <nav className="my-8 flex items-stretch justify-between gap-4 border-t border-line pt-8">
              {prev ? (
                <Link
                  href={`/blogs/${prev.slug ?? prev.id}`}
                  className="group/prev flex max-w-[45%] items-center gap-2.5 text-low transition-colors duration-200 hover:text-accent"
                >
                  <ChevronLeft
                    className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/prev:-translate-x-[3px]"
                    aria-hidden="true"
                  />
                  <span className="min-w-0">
                    <span className="block font-mono text-micro">
                      Previous
                    </span>
                    <span className="block truncate text-[14px] font-semibold text-hi">
                      {prev.title}
                    </span>
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/blogs/${next.slug ?? next.id}`}
                  className="group/next flex max-w-[45%] items-center gap-2.5 text-right text-low transition-colors duration-200 hover:text-accent"
                >
                  <span className="min-w-0">
                    <span className="block font-mono text-micro">Next</span>
                    <span className="block truncate text-[14px] font-semibold text-hi">
                      {next.title}
                    </span>
                  </span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover/next:translate-x-[3px]"
                    aria-hidden="true"
                  />
                </Link>
              ) : (
                <div />
              )}
            </nav>
          )}

          {relatedPosts.length > 0 && (
            <section className="mt-12 border-t border-line pt-8">
              <SectionHead
                eyebrow="KEEP READING"
                title="Related posts"
                className="mb-6"
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {relatedPosts.map((related) => (
                  <BentoCard key={related.id} interactive className="h-full">
                    <Link
                      href={`/blogs/${related.slug ?? related.id}`}
                      className="group flex h-full flex-col"
                    >
                      {related.imageUrl && (
                        <div className="relative h-32 shrink-0 border-b border-line">
                          <Image
                            src={related.imageUrl}
                            alt={related.title}
                            width={640}
                            height={360}
                            sizes="(min-width: 768px) 33vw, 100vw"
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="line-clamp-2 p-4 text-[14px] font-semibold leading-[1.45] text-hi transition-colors duration-200 group-hover:text-accent">
                        {related.title}
                      </h3>
                    </Link>
                  </BentoCard>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </main>
  );
}
