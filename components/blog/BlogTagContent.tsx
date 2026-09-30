import { Tag as TagIcon } from "lucide-react";
import { MonoTag } from "@/components/primitives/MonoTag";
import type { BlogPost, Tag } from "../../types/blog";

interface BlogTagContentProps {
  post: BlogPost;
}

const safeParseTag = (tag: string): Tag | null => {
  try {
    return JSON.parse(tag) as Tag;
  } catch {
    return null;
  }
};

function normalizeTags(tags: BlogPost["tags"]): Tag[] {
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

export default function BlogTagContent({ post }: BlogTagContentProps) {
  const parsedTags = normalizeTags(post.tags);

  if (parsedTags.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {parsedTags.map((tag) => (
        <MonoTag key={tag.id} accent className="inline-flex items-center gap-1">
          <TagIcon size={12} aria-hidden="true" />
          {tag.name}
        </MonoTag>
      ))}
    </div>
  );
}
