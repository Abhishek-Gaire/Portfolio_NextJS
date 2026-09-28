"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "../../types/blog";
import BlogHomeContent from "../../components/blog/BlogHomeContent";
import BlogTagContent from "../../components/blog/BlogTagContent";
import { estimateReadingTime } from "../../utils/dateUtils";
import { BentoCard } from "@/components/primitives/BentoCard";
import { Button } from "@/components/primitives/Button";
import { Reveal } from "@/components/primitives/Reveal";
import { SectionHead } from "@/components/primitives/SectionHead";

type LatestBlogsClientProps = {
  posts: BlogPost[];
};

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

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ");
}

function stripMarkdown(value: string) {
  return stripHtml(value)
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function LatestBlogsClient({ posts }: LatestBlogsClientProps) {
  return (
    <section id="blog" className="py-16">
      <div className="mx-auto max-w-shell px-6">
        <Reveal>
          <SectionHead
            eyebrow="LATEST INSIGHTS"
            title="Latest blog posts"
            lede="Thoughts, tutorials, and insights about web development, technology trends, and best practices."
          />
        </Reveal>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            const preview = `${stripMarkdown(post.content ?? "").substring(0, 130)}....`;
            const readingTime = estimateReadingTime(post.content ?? "");
            const href = `/blogs/${post.slug ?? post.id}`;

            return (
              <Reveal key={post.id} delay={index * 80} className="h-full">
                <BentoCard interactive className="h-full">
                  <article className="flex h-full flex-col">
                    <div className="relative h-37 shrink-0 overflow-hidden border-b border-line">
                      <Image
                        src={
                          post.imageUrl ||
                          "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600"
                        }
                        alt={post.title}
                        width={640}
                        height={360}
                        unoptimized
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-3 left-3 rounded-full border border-line bg-code-bg/85 px-2 py-0.75 font-mono text-[10.5px] text-low backdrop-blur-sm">
                        {readingTime} min read
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5.5">
                      <BlogTagContent post={post} />

                      <h2 className="mt-3 mb-3 line-clamp-2 text-[16px] font-semibold leading-[1.4] text-hi">
                        <Link
                          href={href}
                          className="transition-colors duration-200 hover:text-accent"
                        >
                          {post.title}
                        </Link>
                      </h2>

                      <div className="mb-5 [&_.prose]:mb-0 [&_.prose]:text-[13.5px] [&_.prose]:leading-[1.6]">
                        <BlogHomeContent content={preview} />
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-line pt-3.5 font-mono text-micro text-low">
                        <time dateTime={post.created_at}>
                          {formatShortDate(post.created_at)}
                        </time>
                        <Link
                          href={href}
                          aria-label={`Read ${post.title}`}
                          className="group/read inline-flex items-center gap-1.5 text-hi transition-colors duration-200 hover:text-accent"
                        >
                          <span>Read</span>
                          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/read:translate-x-[3px]" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </BentoCard>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={160} className="mt-8 flex justify-center">
          <Button as={Link} href="/blogs">
            <span>Read all my insights</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
