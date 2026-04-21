"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";
import type { Project } from "../../types/project";

type FormState = {
  title: string;
  description: string;
  completionDate: string;
  category: string;
  image_url: string;
  technologiesInput: string;
  role: string;
  challenges: string;
  solutions: string;
  live_url: string;
  github_url: string;
};

type SubmitState = "idle" | "saving" | "error";

const emptyForm: FormState = {
  title: "",
  description: "",
  completionDate: "",
  category: "Full Stack",
  image_url: "",
  technologiesInput: "",
  role: "",
  challenges: "",
  solutions: "",
  live_url: "",
  github_url: "",
};

const categories = ["Full Stack", "Backend", "Collaboration"];

function normalizeTechnologies(input: string): string[] {
  return input
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);
}

function technologiesToInput(technologies: Project["technologies"]): string {
  if (!Array.isArray(technologies)) {
    return "";
  }
  return technologies.join(", ");
}

type AdminProjectsManagerProps = {
  initialProjects?: Project[];
};

export default function AdminProjectsManager({
  initialProjects = [],
}: AdminProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>(emptyForm);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const fetchProjects = async () => {
    setIsLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase
      .from("Projects")
      .select("*")
      .order("completionDate", { ascending: false });

    if (error) {
      setErrorMessage(error.message || "Unable to fetch projects.");
      setIsLoading(false);
      return;
    }

    setProjects((data ?? []) as Project[]);
    setIsLoading(false);
  };



  const handleEdit = (project: Project) => {
    setIsEditing(true);
    setEditingProjectId(project.id);
    setFormState({
      title: project.title ?? "",
      description: project.description ?? "",
      completionDate: project.completionDate ?? "",
      category: project.category ?? "Full Stack",
      image_url: project.image_url ?? "",
      technologiesInput: technologiesToInput(project.technologies),
      role: project.role ?? "",
      challenges: project.challenges ?? "",
      solutions: project.solutions ?? "",
      live_url: project.live_url ?? "",
      github_url: project.github_url ?? "",
    });
  };

  const handleReset = () => {
    setIsEditing(false);
    setEditingProjectId(null);
    setFormState(emptyForm);
    setSubmitState("idle");
    setErrorMessage("");
  };

  const handleDelete = async (id: string) => {
    setErrorMessage("");
    const { error } = await supabase.from("Projects").delete().eq("id", id);

    if (error) {
      setErrorMessage(error.message || "Unable to delete the project.");
      return;
    }

    await fetchProjects();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("saving");
    setErrorMessage("");

    const payload = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      completionDate: formState.completionDate.trim(),
      category: formState.category,
      image_url: formState.image_url.trim() || null,
      technologies: normalizeTechnologies(formState.technologiesInput),
      role: formState.role.trim(),
      challenges: formState.challenges.trim(),
      solutions: formState.solutions.trim(),
      live_url: formState.live_url.trim() || null,
      github_url: formState.github_url.trim() || null,
    };

    if (!payload.title || !payload.description) {
      setSubmitState("error");
      setErrorMessage("Title and description are required.");
      return;
    }

    let error: { message?: string } | null = null;

    if (editingProjectId) {
      const response = await supabase
        .from("Projects")
        .update(payload)
        .eq("id", editingProjectId);
      error = response.error ?? null;
    } else {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const payloadResponse = await response.json().catch(() => null);
        error = {
          message: payloadResponse?.message || "Unable to save the project.",
        };
      }
    }

    if (error) {
      setSubmitState("error");
      setErrorMessage(error.message || "Unable to save the project.");
      return;
    }

    await fetchProjects();
    handleReset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-sm text-slate-500">
            Manage portfolio projects stored in Supabase.
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </button>
        )}
      </div>

      {isEditing && (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {editingProjectId ? "Edit Project" : "New Project"}
            </h2>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              value={formState.title}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, title: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formState.description}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, description: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="completionDate">
                Completion Date
              </label>
              <input
                id="completionDate"
                value={formState.completionDate}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, completionDate: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                placeholder="2025-01-01"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={formState.category}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, category: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="imageUrl">
              Project Image URL
            </label>
            <input
              id="imageUrl"
              value={formState.image_url}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, image_url: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="technologies">
              Technologies (comma separated)
            </label>
            <input
              id="technologies"
              value={formState.technologiesInput}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, technologiesInput: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="role">
                Role
              </label>
              <input
                id="role"
                value={formState.role}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, role: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="liveUrl">
                Live URL
              </label>
              <input
                id="liveUrl"
                value={formState.live_url}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, live_url: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="githubUrl">
                GitHub URL
              </label>
              <input
                id="githubUrl"
                value={formState.github_url}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, github_url: event.target.value }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="challenges">
              Challenges
            </label>
            <textarea
              id="challenges"
              rows={2}
              value={formState.challenges}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, challenges: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="solutions">
              Solutions
            </label>
            <textarea
              id="solutions"
              rows={2}
              value={formState.solutions}
              onChange={(event) =>
                setFormState((prev) => ({ ...prev, solutions: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {submitState === "error" && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage || "Unable to save the project."}
            </p>
          )}

          <button
            type="submit"
            disabled={submitState === "saving"}
            className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600"
          >
            {submitState === "saving" ? "Saving..." : "Save Project"}
          </button>
        </form>
      )}

      {errorMessage && !isEditing && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-slate-500">Loading projects…</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-slate-500">No projects found.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500">{project.category}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(project)}
                  className="inline-flex items-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <Pencil className="mr-1 h-3 w-3" />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(project.id)}
                  className="inline-flex items-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
