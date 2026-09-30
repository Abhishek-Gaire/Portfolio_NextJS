import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerAuthClient } from "../../../lib/supabase/server-auth";

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Description is required").max(5000),
  completionDate: z.string().trim().max(50).optional(),
  category: z.string().trim().min(1).max(50),
  image_url: z.string().trim().max(2048).nullable().optional(),
  technologies: z.array(z.string().trim().min(1).max(100)).default([]),
  role: z.string().trim().max(2000).optional(),
  challenges: z.string().trim().max(5000).optional(),
  solutions: z.string().trim().max(5000).optional(),
  live_url: z.string().trim().max(2048).nullable().optional(),
  github_url: z.string().trim().max(2048).nullable().optional(),
  // Coerced from truthy input rather than a strict z.boolean(): the admin form
  // posts JSON, so a checkbox sends either a real boolean or nothing, and a
  // strict boolean would 400 the whole insert over a missing optional key.
  // The 2-project cap itself is enforced by a database trigger, not here.
  isFeatured: z
    .union([z.boolean(), z.literal("true"), z.literal("false")])
    .transform((value) => value === true || value === "true")
    .optional(),
  // Mirrors the database CHECK constraint. Zod validates the request body; the
  // CHECK is the guard for rows written by a direct table edit or by the admin's
  // browser-direct path, neither of which passes through here.
  tags: z
    .array(z.enum(["client", "personal", "oss", "hobby", "college"]))
    .max(5)
    .optional(),
  context: z.string().trim().max(120).nullable().optional(),
});

export async function POST(request: Request) {
  const supabase = await getSupabaseServerAuthClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = projectSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("Projects").insert([parsed.data]);

    if (error) {
      return NextResponse.json(
        { message: "Failed to save project." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 }
    );
  }
}
