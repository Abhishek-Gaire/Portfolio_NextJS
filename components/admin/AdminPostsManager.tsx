"use client";

import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";
import type { BlogPost, Tag } from "../../types/blog";
import PostEditor from "./posts/PostEditor";
import PostList from "./posts/PostList";

type AdminPostsManagerProps = {
  initialPosts?: BlogPost[];
};

type PostForm = {
  title: string;
  content: string;
  imageUrl: string;
  tags: Tag[];
  publish: boolean;
};

const normalizeTags = (tags: BlogPost["tags"]): Tag[] => {
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
};

const normalizePosts = (data: BlogPost[]) =>
  data.map((post) => ({
    ...post,
    tags: normalizeTags(post.tags),
  }));

export default function AdminPostsManager({
  initialPosts = [],
}: AdminPostsManagerProps) {
  const [posts, setPosts] = useState<BlogPost[]>(normalizePosts(initialPosts));
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | undefined>();

  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("Blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage(error.message || "Unable to fetch posts.");
      setLoading(false);
      return;
    }

    setPosts(normalizePosts((data ?? []) as BlogPost[]));
    setLoading(false);
  }, [supabase]);



  const handleSave = async (data: PostForm) => {
    try {
      if (selectedPost) {
        await supabase.from("Blogs").update(data).eq("id", selectedPost.id);
      } else {
        const response = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.message || "Unable to save post.");
        }
      }
      await fetchPosts();
      setIsEditing(false);
      setSelectedPost(undefined);
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isEditing ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">
              {selectedPost ? "Edit Blog Post" : "New Blog Post"}
            </h1>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setSelectedPost(undefined);
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
          <PostEditor post={selectedPost} onSaveAction={handleSave} />
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-black">Posts</h1>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Blog Post
            </button>
          </div>
          {errorMessage && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          )}
          <PostList
            posts={posts}
            onEdit={(post) => {
              setSelectedPost(post);
              setIsEditing(true);
            }}
            onDelete={async (id) => {
              await supabase.from("Blogs").delete().eq("id", id);
              await fetchPosts();
            }}
          />
        </div>
      )}
    </div>
  );
}
