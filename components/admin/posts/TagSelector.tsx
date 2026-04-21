"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getSupabaseBrowserClient } from "../../../lib/supabase/client";

type Tag = {
  id: string;
  name: string;
};

type TagSelectorProps = {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
};

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      const supabase = getSupabaseBrowserClient();
      const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

      if (error) {
        console.error("Error fetching tags:", error);
      } else {
        setTags((data ?? []) as Tag[]);
      }
      setLoading(false);
    };

    fetchTags();
  }, []);

  const selectedTagIds = new Set(selectedTags.map((tag) => tag.id));

  const handleTagClick = (tag: Tag) => {
    if (selectedTagIds.has(tag.id)) {
      onChange(selectedTags.filter((selectedTag) => selectedTag.id !== tag.id));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-indigo-500"></span>
        <span className="ml-2">Loading tags...</span>
      </div>
    );
  }

  if (!tags.length) {
    return <div>No tags available.</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-5">
      {tags.map((tag) => (
        <button
          key={tag.id}
          type="button"
          onClick={() => handleTagClick(tag)}
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${selectedTagIds.has(tag.id)
              ? "bg-indigo-100 text-indigo-800"
              : "bg-gray-100 text-gray-800"
            }`}
        >
          {tag.name}
          {selectedTagIds.has(tag.id) && <X className="ml-1 h-4 w-4" />}
        </button>
      ))}
    </div>
  );
}
