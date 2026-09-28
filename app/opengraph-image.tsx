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
          background: "#0a0a0c",
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
            color: "#2dd4bf",
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
            color: "#9a9ba0",
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
