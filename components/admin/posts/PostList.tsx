"use client";

import { useState } from "react";
import { Edit2, Trash2, Search, Filter } from "lucide-react";
import type { BlogPost } from "../../../types/blog";

interface PostListProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function PostList({ posts, onEdit, onDelete }: PostListProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && post.publish) ||
      (filter === "draft" && !post.publish);
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10 px-5 py-5 w-full rounded-md text-black border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-black h-5 w-5" />
          <select
            value={filter}
            onChange={(event) =>
              setFilter(event.target.value as "all" | "published" | "draft")
            }
            className="rounded-md text-black px-5 py-5 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredPosts.map((post) => (
            <li key={post.id}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {post.title}
                  </h3>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.publish
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {post.publish ? "Published" : "Draft"}
                    </span>
                    <span className="ml-2">
                      {post.created_at
                        ? new Date(post.created_at).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                </div>
                <div className="ml-5 shrink-0 flex space-x-2">
                  <button
                    type="button"
                    onClick={() => onEdit(post)}
                    className="p-2 text-gray-400 hover:text-gray-500"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(post.id)}
                    className="p-2 text-red-400 hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
