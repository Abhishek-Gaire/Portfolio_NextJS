"use client";

import { Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";

type Tag = {
  id: string;
  name: string;
};

type AdminTagsManagerProps = {
  initialTags?: Tag[];
};

export default function AdminTagsManager({
  initialTags = [],
}: AdminTagsManagerProps) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [tagName, setTagName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddTag = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    const normalized = tagName.trim();
    if (!normalized) {
      setErrorMessage("Tag name cannot be empty.");
      return;
    }

    setIsSubmitting(true);

    const { data: existing, error: fetchError } = await supabase
      .from("tags")
      .select("id")
      .eq("name", normalized);

    if (fetchError) {
      setErrorMessage(fetchError.message || "Unable to validate tag.");
      setIsSubmitting(false);
      return;
    }

    if (existing && existing.length > 0) {
      setErrorMessage("Tag already exists.");
      setIsSubmitting(false);
      return;
    }

    const response = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: normalized }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setErrorMessage(payload?.message || "Unable to add tag.");
      setIsSubmitting(false);
      return;
    }

    const payload = await response.json().catch(() => ({ data: [] }));
    setTags((prev) => [...prev, ...((payload?.data as Tag[] | undefined) ?? [])]);
    setTagName("");
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    setErrorMessage("");

    const { error } = await supabase.from("tags").delete().eq("id", id);

    if (error) {
      setErrorMessage(error.message || "Unable to delete tag.");
      return;
    }

    setTags((prev) => prev.filter((tag) => tag.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Tags</h1>
        <p className="text-sm text-slate-500">
          Manage tags used across blogs and projects.
        </p>
      </div>

      <form onSubmit={handleAddTag} className="flex flex-wrap gap-3">
        <input
          type="text"
          value={tagName}
          onChange={(event) => setTagName(event.target.value)}
          placeholder="Enter tag name"
          disabled={isSubmitting}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Adding..." : "Add Tag"}
        </button>
      </form>

      {errorMessage && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      {tags.length === 0 ? (
        <p className="text-sm text-slate-500">No tags created yet.</p>
      ) : (
        <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white">
          {tags.map((tag) => (
            <li
              key={tag.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="text-sm text-slate-700">{tag.name}</span>
              <button
                type="button"
                onClick={() => handleDelete(tag.id)}
                className="inline-flex items-center rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="mr-1 h-3 w-3" />
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
