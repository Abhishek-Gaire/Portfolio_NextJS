import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "Typeshala — free, open-source Nepali and English typing tutor for Windows, macOS and Linux";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social card for the Typeshala subdomain.
 *
 * The palette is the app icon's (src-tauri/icons and
 * ~/Desktop/OpenSource/Typeshala/public/typeshala_app_icon.svg) rather than the
 * portfolio's teal, so the card is recognisable as the product the moment it
 * lands in a feed and not as another page of the portfolio.
 *
 * No Devanagari here on purpose. satori resolves glyphs from its own bundled
 * fonts, which carry no Devanagari coverage, so टाइपशाला would render as a row
 * of empty boxes. The Devanagari name is in the title tag, the meta description
 * and the visible h1, which is where it needs to be indexed — a card image is
 * the one place it could not be read.
 */
const CREAM = "#fbf4e7";
const CRIMSON = "#ad2e45";
const GOLD = "#f2c14e";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: CRIMSON,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 26,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: GOLD,
              fontFamily: "sans-serif",
            }}
          >
            Free &amp; open source
          </div>

          <div
            style={{
              fontSize: 92,
              fontWeight: 700,
              color: CREAM,
              fontFamily: "sans-serif",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              marginTop: 18,
            }}
          >
            Typeshala
          </div>

          <div
            style={{
              fontSize: 36,
              color: CREAM,
              fontFamily: "sans-serif",
              lineHeight: 1.35,
              marginTop: 18,
              maxWidth: 900,
            }}
          >
            A typing tutor for Nepali and English — Preeti, Romanized and
            QWERTY layouts.
          </div>

          {/*
            The middle line of the card. Without it the layout is two blocks at
            the extremes of the canvas and the middle third is empty, which
            reads as a mistake rather than as breathing room.
          */}
          <div
            style={{
              fontSize: 25,
              color: "rgba(251, 244, 231, 0.72)",
              fontFamily: "sans-serif",
              marginTop: 26,
            }}
          >
            Structured lessons · Speed and accuracy scoring · Progress trends ·
            Offline
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 14 }}>
            {["Windows", "macOS", "Linux"].map((platform) => (
              <div
                key={platform}
                style={{
                  display: "flex",
                  border: `2px solid ${CREAM}`,
                  borderRadius: 999,
                  padding: "10px 24px",
                  fontSize: 26,
                  color: CREAM,
                  fontFamily: "sans-serif",
                }}
              >
                {platform}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 24,
              color: GOLD,
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                display: "flex",
                width: 18,
                height: 18,
                borderRadius: 999,
                background: GOLD,
              }}
            />
            MIT
          </div>
        </div>
      </div>
    ),
    size,
  );
}