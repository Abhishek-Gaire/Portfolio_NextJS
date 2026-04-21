import { NextResponse } from "next/server";
import { z } from "zod";
import { Redis } from "@upstash/redis";
import { getSupabaseServerClient } from "../../../lib/supabase/server";

type ContactPayload = {
  name?: string;
  email?: string;
  message?: string;
};

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, { count: number; reset: number }>();
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z
    .string()
    .trim()
    .email("Email is invalid")
    .max(320, "Email is too long"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message is too long"),
});

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

function checkRateLimit(key: string) {
  const now = Date.now();
  const existing = rateLimitStore.get(key);

  if (!existing || existing.reset < now) {
    rateLimitStore.set(key, { count: 1, reset: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true, retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000) };
  }

  if (existing.count >= RATE_LIMIT_MAX) {
    return {
      ok: false,
      retryAfter: Math.ceil((existing.reset - now) / 1000),
    };
  }

  existing.count += 1;
  return { ok: true, retryAfter: Math.ceil((existing.reset - now) / 1000) };
}

async function getRateLimitResult(key: string) {
  if (redis) {
    const windowKey = `contact:${key}:${Math.floor(
      Date.now() / RATE_LIMIT_WINDOW_MS
    )}`;
    try {
      const count = await redis.incr(windowKey);
      if (count === 1) {
        await redis.expire(windowKey, Math.ceil(RATE_LIMIT_WINDOW_MS / 1000));
      }

      if (count > RATE_LIMIT_MAX) {
        const ttl = await redis.ttl(windowKey);
        const retryAfter =
          typeof ttl === "number" && ttl > 0
            ? ttl
            : Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);
        return { ok: false, retryAfter };
      }

      const ttl = await redis.ttl(windowKey);
      return {
        ok: true,
        retryAfter:
          typeof ttl === "number" && ttl > 0
            ? ttl
            : Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
      };
    } catch {
      return checkRateLimit(key);
    }
  }

  return checkRateLimit(key);
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

function normalizePayload(payload: ContactPayload) {
  return {
    name: stripTags(payload.name ?? ""),
    email: stripTags(payload.email ?? ""),
    message: stripTags(payload.message ?? ""),
  };
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = await getRateLimitResult(clientIp);

    if (!rateLimit.ok) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": rateLimit.retryAfter.toString() },
        }
      );
    }

    const payload = (await request.json()) as ContactPayload;
    const normalized = normalizePayload(payload);
    const parsed = contactSchema.safeParse(normalized);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid request payload." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from("Contacts").insert([parsed.data]);

    if (error) {
      return NextResponse.json(
        { message: "Failed to submit the contact form." },
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
