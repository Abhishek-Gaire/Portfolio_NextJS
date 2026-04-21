import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Abhishek Gaire — Full Stack Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#000000",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: "#60a5fa",
            marginBottom: 16,
            fontFamily: "sans-serif",
          }}
        >
          abhishekgaire.com.np
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            fontFamily: "sans-serif",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Abhishek Gaire
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#9ca3af",
            fontFamily: "sans-serif",
          }}
        >
          Full Stack Developer · MERN · Next.js · Supabase
        </div>
      </div>
    ),
    size
  );
}
