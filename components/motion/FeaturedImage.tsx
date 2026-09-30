"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { PixelImage } from "@/components/motion/PixelImage";
import { usePrefersReducedMotion } from "@/components/motion/usePrefersReducedMotion";

type FeaturedImageProps = {
  src: string;
  alt: string;
  /** Session key. The mosaic plays once per slug per session. */
  slug: string;
  width: number;
  height: number;
  sizes: string;
  priority?: boolean;
  /** Mosaic resolution. Default matches the reference's hero choice. */
  grid?: "6x4" | "8x8" | "8x3" | "4x6" | "3x8";
  /** Frame: the border, radius and overflow live here, not in PixelImage. */
  className?: string;
  imageClassName?: string;
};

type Intrinsic = { width: number; height: number };

/**
 * Ported from the reference project's src/components/featured-image.tsx.
 *
 * The reference renders a 384px square in a fixed two-column detail layout, so
 * it hardcodes `h-96 w-96` on all three branches and never has to think about
 * aspect ratio. Both call sites here are full-bleed banners inside the shell,
 * and the images behind them are user uploads with ratios from 0.79 (portrait)
 * to 2.0 (wide). The declared `width`/`height` on both call sites are nominal
 * layout hints, not the files' real dimensions, so this component cannot trust
 * them — hence the intrinsic measurement below.
 *
 * The session gate is the reference's own and is kept verbatim in behaviour:
 * reduced motion skips it, and a slug already played this session is not
 * replayed. Without it, the mosaic would fire on every navigation back into a
 * case study.
 *
 * Ordering matters and is the reason this is not a three-line component. The
 * intrinsic size is resolved *before* the mosaic is switched on, because
 * PixelImage's container is sized by an explicit aspect ratio — feeding it the
 * declared numbers instead of the file's real ones crops the banner and changes
 * its height by 82px on /projects/digital-kirana alone. Measuring first means
 * the resize happens while nothing is animating and before any cell paints.
 */
export function FeaturedImage({
  src,
  alt,
  slug,
  width,
  height,
  sizes,
  priority = false,
  grid = "8x8",
  className,
  imageClassName,
}: FeaturedImageProps) {
  // null until the effect decides. Rendering the real image first would flash
  // it for a frame before the mosaic replaced it, which is the exact artifact
  // the reference's placeholder box exists to avoid.
  const [animate, setAnimate] = useState<boolean | null>(null);
  const [intrinsic, setIntrinsic] = useState<Intrinsic | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let cancelled = false;

    const decide = async () => {
      const key = `pixel-image:${slug}`;
      const played = window.sessionStorage.getItem(key) === "1";
      if (prefersReducedMotion || played) {
        if (!cancelled) setAnimate(false);
        return;
      }

      // Decode off-screen first so the ratio is known before the mosaic mounts.
      try {
        const probe = new window.Image();
        probe.src = src;
        await probe.decode();
        if (cancelled) return;
        if (probe.naturalWidth && probe.naturalHeight) {
          setIntrinsic({
            width: probe.naturalWidth,
            height: probe.naturalHeight,
          });
        }
      } catch {
        // decode() rejects on a broken or blocked source. Fall through to the
        // declared ratio rather than leaving the banner at zero height.
      }

      window.sessionStorage.setItem(key, "1");
      if (!cancelled) setAnimate(true);
    };

    void decide();
    return () => {
      cancelled = true;
    };
  }, [slug, src, prefersReducedMotion]);

  const box = intrinsic ?? { width, height };

  return (
    <div className={className}>
      {animate === null ? (
        // Placeholder, sized by the declared ratio until the probe resolves.
        // Its background is the card surface, not transparent, so the banner
        // does not read as a hole while the mosaic decides.
        <div
          className="w-full bg-surface-2"
          style={{ aspectRatio: `${width} / ${height}` }}
          aria-hidden="true"
        />
      ) : animate ? (
        <PixelImage
          src={src}
          alt={alt}
          grid={grid}
          width={box.width}
          height={box.height}
          // PixelImage carries its own border, radius and background for the
          // standalone case. The frame belongs to this component, so both are
          // neutralised rather than doubled.
          className="rounded-none border-0 bg-transparent"
        />
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          unoptimized
          // h-auto lets the file's own ratio win over the declared one, which
          // is what keeps this branch identical to the pre-mosaic markup.
          className={imageClassName}
        />
      )}
    </div>
  );
}

export default FeaturedImage;
