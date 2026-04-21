"use client";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BlogPost, Tag } from "../../../types/blog";
import TagSelector from "./TagSelector";
import ImageUpload from "./ImageUpload";
import FullFeaturedEditor from "./FullFeaturedEditor";

const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  imageUrl: z.string().min(1, "Image is required"),
  tags: z.array(tagSchema),
  publish: z.boolean(),
});

type PostForm = z.infer<typeof postSchema>;

type PostEditorProps = {
  post?: BlogPost;
  onSaveAction: (data: PostForm) => Promise<void>;
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

export default function PostEditor({ post, onSaveAction }: PostEditorProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      publish: post?.publish || false,
      tags: normalizeTags(post?.tags),
      imageUrl: post?.imageUrl || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSaveAction)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          {...register("title")}
          className="mt-1 px-3 py-3 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <FullFeaturedEditor newBlog={field.value} setNewBlogAction={field.onChange} />
          )}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
        )}
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700 mt-25">
          Tags
        </label>
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TagSelector selectedTags={field.value || []} onChange={field.onChange} />
          )}
        />
      </div>

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700">
          Featured Image
        </label>
        <Controller
          name="imageUrl"
          control={control}
          render={({ field }) => (
            <ImageUpload value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.imageUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-slate-900 text-white rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>

        <label className="flex items-center">
          <input
            type="checkbox"
            {...register("publish")}
            className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-600">Publish</span>
        </label>
      </div>
    </form>
  );
}
