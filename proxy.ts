import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function getEnvValue(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

type CookieOptions = {
  domain?: string;
  path?: string;
  maxAge?: number;
  expires?: Date;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
};

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export async function proxy(request: NextRequest) {
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const isProd = process.env.NODE_ENV === "production";
  if (forwardedProto === "http" && isProd) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    return NextResponse.redirect(url);
  }

  const { pathname } = request.nextUrl;

  const nonce = crypto.randomUUID();
  const nonceValue =
    typeof Buffer !== "undefined"
      ? Buffer.from(nonce).toString("base64")
      : btoa(nonce);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonceValue);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = [
    "script-src 'self'",
    `'nonce-${nonceValue}'`,
    "'strict-dynamic'",
    "https://va.vercel-scripts.com",
    isDev ? "'unsafe-eval'" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "img-src 'self' https: data: blob: https://*.supabase.co",
    "font-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline' https:",
    scriptSrc,
    "connect-src 'self' https: wss: https://*.supabase.co wss://*.supabase.co",
    "upgrade-insecure-requests",
  ].join("; ");

  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("x-nonce", nonceValue);

  const requiresAuthCheck =
    pathname.startsWith("/admin") || pathname === "/login";
  if (!requiresAuthCheck) {
    return response;
  }

  const supabaseUrl = getEnvValue("NEXT_PUBLIC_SUPABASE_URL");
  const supabaseAnonKey = getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll().map((cookie) => ({
          name: cookie.name,
          value: cookie.value,
        }));
      },
      setAll(cookiesToSet: CookieToSet[]) {
        cookiesToSet.forEach((cookie) => {
          response.cookies.set({
            name: cookie.name,
            value: cookie.value,
            ...cookie.options,
          });
        });
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  const isAuthed = !error && Boolean(data.user);

  if (pathname.startsWith("/admin") && !isAuthed) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && isAuthed) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export default proxy;
