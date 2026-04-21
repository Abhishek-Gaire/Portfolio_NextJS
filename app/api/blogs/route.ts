import { NextResponse } from "next/server";
import { sanitizeContent } from "../../../lib/sanitize";
import { z } from "zod";
import { getSupabaseServerAuthClient } from "../../../lib/supabase/server-auth";

const tagSchema = z.object({
  id: z.string().trim().min(1).max(100),
  name: z.string().trim().min(1).max(100),
});

const blogSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  content: z.string().trim().min(1, "Content is required").max(20000),
  imageUrl: z.string().trim().min(1, "Image is required").max(2048),
  tags: z.array(tagSchema).optional().default([]),
  publish: z.boolean(),
});

export async function POST(request: Request) {
  const supabase = await getSupabaseServerAuthClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = blogSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const sanitizedContent = sanitizeContent(parsed.data.content);
    const data = { ...parsed.data, content: sanitizedContent };

    const { error } = await supabase.from("Blogs").insert([data]);

    if (error) {
      return NextResponse.json(
        { message: "Failed to save blog post." },
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
