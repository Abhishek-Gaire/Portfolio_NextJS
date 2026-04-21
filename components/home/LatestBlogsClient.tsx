"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import type { BlogPost } from "../../types/blog";
import BlogHomeContent from "../../components/blog/BlogHomeContent";
import BlogTagContent from "../../components/blog/BlogTagContent";
import { estimateReadingTime } from "../../utils/dateUtils";

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

export default function LatestBlogsClient({ posts }: LatestBlogsClientProps) {
  return (
    <section id="blog" className="py-24 bg-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-full text-gray-400 text-sm font-medium mb-4">
            <Calendar size={16} className="mr-2" />
            Latest Insights
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Latest Blog Posts
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Thoughts, tutorials, and insights about web development, technology
            trends, and best practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post, index) => {
            const preview = post.content?.substring(0, 130) ?? "";
            const readingTime = estimateReadingTime(post.content ?? "");
            const href = `/blogs/${post.slug ?? post.id}`;

            return (
              <article
                key={post.id}
                className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:-translate-y-3 hover:border-blue-500/50"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={
                      post.imageUrl ||
                      "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600"
                    }
                    alt={post.title}
                    width={640}
                    height={360}
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm text-white text-xs rounded-full">
                    {readingTime} min read
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-gray-800/60 via-transparent to-transparent"></div>
                </div>

                <div className="p-8">
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-2" />
                      <time dateTime={post.created_at}>
                        {formatShortDate(post.created_at)}
                      </time>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                    <Link
                      href={href}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <div className="mb-6">
                    <BlogHomeContent content={preview} />
                  </div>

                  <div className="flex items-center justify-between">
                    <BlogTagContent post={post} />
                  </div>
                </div>

                <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </article>
            );
          })}
        </div>

        <div className="text-center">
          <Link
            href="/blogs"
            className="inline-flex items-center px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-1 group"
          >
            <span className="font-medium">Read All My Insights</span>
            <ArrowRight
              className="ml-2 group-hover:translate-x-1 transition-transform duration-300"
              size={20}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
