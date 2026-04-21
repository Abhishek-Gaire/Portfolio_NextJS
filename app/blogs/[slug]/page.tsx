import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import BlogContent from "../../../components/blog/BlogContent";
import BlogTagContent from "../../../components/blog/BlogTagContent";
import ShareButtons from "../../../components/blog/ShareButtons";
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
    value
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
      images: post.imageUrl ? [{ url: post.imageUrl, alt: post.title }] : undefined,
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
    "https://example.com";
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
    <main className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      <article className="max-w-4xl mx-auto px-4 py-12 pt-25">
        <script
          type="application/ld+json"
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
        />
        <header className="mb-8">
          {displayImageUrl && (
            <Image
              src={displayImageUrl}
              alt={post.title}
              width={1200}
              height={400}
              sizes="100vw"
              unoptimized
              priority
              className="w-full h-auto object-cover rounded-lg mt-6 mb-6"
            />
          )}
          <h1 className="text-4xl font-bold text-white-900 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center space-x-4 text-white-600 mb-4">
            <div className="flex items-center">
              <span>{author}</span>
            </div>
            <span>•</span>
            <time dateTime={post.created_at}>
              {formatDate(post.created_at)}
            </time>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <BlogTagContent post={post} />
          </div>
        </header>

        {safeContent ? (
          <BlogContent content={safeContent} />
        ) : (
          <p className="mt-8 rounded-lg border border-dashed border-gray-300 bg-white p-6 text-gray-600">
            Blog content is unavailable right now. Please check back soon.
          </p>
        )}

        <ShareButtons url={canonicalPath} title={post.title} description={excerpt} />

        {(prev || next) && (
          <nav className="flex justify-between items-center my-8 border-gray-200 pt-8">
            {prev ? (
              <Link
                href={`/blogs/${prev.slug ?? prev.id}`}
                className="flex items-center text-gray-600 hover:text-blue-100"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                <div>
                  <div className="text-sm text-gray-500">Previous</div>
                  <div className="font-medium">{prev.title}</div>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`/blogs/${next.slug ?? next.id}`}
                className="flex items-center text-right text-gray-600 hover:text-blue-500"
              >
                <div>
                  <div className="text-sm text-gray-500">Next</div>
                  <div className="font-medium">{next.title}</div>
                </div>
                <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}

        {relatedPosts.length > 0 && (
          <section className="mt-12 border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={`/blogs/${related.slug ?? related.id}`}
                  className="group"
                >
                  {related.imageUrl && (
                    <Image
                      src={related.imageUrl}
                      alt={related.title}
                      width={640}
                      height={360}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      unoptimized
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <h3 className="font-semibold text-lg group-hover:text-indigo-600 transition-colors">
                    {related.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

      </article>
    </main>
  );
}
