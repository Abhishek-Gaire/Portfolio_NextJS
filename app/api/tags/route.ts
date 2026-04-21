import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerAuthClient } from "../../../lib/supabase/server-auth";

const tagSchema = z.object({
  name: z.string().trim().min(1, "Tag name is required").max(100),
});

export async function POST(request: Request) {
  const supabase = await getSupabaseServerAuthClient();
  const { data, error: userError } = await supabase.auth.getUser();

  if (userError || !data.user) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const parsed = tagSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const { data: existing, error: fetchError } = await supabase
      .from("tags")
      .select("id")
      .eq("name", parsed.data.name);

    if (fetchError) {
      return NextResponse.json(
        { message: "Failed to validate tag." },
        { status: 500 }
      );
    }

    if (existing && existing.length > 0) {
      return NextResponse.json(
        { message: "Tag already exists." },
        { status: 409 }
      );
    }

    const { data: created, error } = await supabase
      .from("tags")
      .insert([{ name: parsed.data.name }])
      .select();

    if (error) {
      return NextResponse.json(
        { message: "Failed to add tag." },
        { status: 500 }
      );
    }

    return NextResponse.json({ data: created ?? [] }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Invalid request payload." },
      { status: 400 }
    );
  }
}
