"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type Grid = { rows: number; cols: number };

const DEFAULT_GRIDS = {
  "6x4": { rows: 4, cols: 6 },
  "8x8": { rows: 8, cols: 8 },
  "8x3": { rows: 3, cols: 8 },
  "4x6": { rows: 6, cols: 4 },
  "3x8": { rows: 8, cols: 3 },
} satisfies Record<string, Grid>;

type PredefinedGridKey = keyof typeof DEFAULT_GRIDS;

type PixelImageProps = {
  src: string;
  alt: string;
  className?: string;
  grid?: PredefinedGridKey;
  customGrid?: Grid;
  grayscaleAnimation?: boolean;
  pixelFadeInDuration?: number;
  maxAnimationDelay?: number;
  colorRevealDelay?: number;
  width?: number;
  height?: number;
};

function goldenRatioFraction(index: number): number {
  return (index * 0.6180339887) % 1;
}

function isValidGrid(grid?: Grid): grid is Grid {
  return (
    !!grid &&
    Number.isInteger(grid.rows) &&
    Number.isInteger(grid.cols) &&
    grid.rows >= 1 &&
    grid.cols >= 1 &&
    grid.rows <= 16 &&
    grid.cols <= 16
  );
}

export function PixelImage({
  src,
  alt,
  className,
  grid = "6x4",
  customGrid,
  grayscaleAnimation = true,
  pixelFadeInDuration = 1000,
  maxAnimationDelay = 1200,
  colorRevealDelay = 1300,
  width = 384,
  height = 384,
}: PixelImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showColor, setShowColor] = useState(false);

  const { rows, cols } = useMemo(
    () => (isValidGrid(customGrid) ? customGrid : DEFAULT_GRIDS[grid]),
    [customGrid, grid],
  );

  useEffect(() => {
    const revealTimeout = setTimeout(() => setIsVisible(true), 0);
    const colorTimeout = setTimeout(() => setShowColor(true), colorRevealDelay);
    return () => {
      clearTimeout(revealTimeout);
      clearTimeout(colorTimeout);
    };
  }, [colorRevealDelay]);

  const pieces = useMemo(() => {
    const total = rows * cols;
    return Array.from({ length: total }, (_, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      const cellWidth = 100 / cols;
      const cellHeight = 100 / rows;
      const clipPath = `polygon(${col * cellWidth}% ${row * cellHeight}%, ${(col + 1) * cellWidth}% ${row * cellHeight}%, ${(col + 1) * cellWidth}% ${(row + 1) * cellHeight}%, ${col * cellWidth}% ${(row + 1) * cellHeight}%)`;
      return { clipPath, delay: goldenRatioFraction(index) * maxAnimationDelay };
    });
  }, [rows, cols, maxAnimationDelay]);

  return (
    <div
      className={cn(
        "relative w-full select-none overflow-hidden rounded-tile border border-line bg-surface-2",
        className,
      )}
      style={{
        aspectRatio: `${width} / ${height}`,
        /*
         * Seam guard, and it is load-bearing.
         *
         * Adjacent clip-path polygons share an edge computed as a percentage,
         * so the browser antialiases both sides of it and a sub-pixel strip of
         * the container's own background shows through between cells. Measured
         * by diffing a rendered mosaic against the same image drawn as a plain
         * <img>: mean per-column difference 0.34, but 56 at the cell boundaries
         * — spikes at x = 196, 589, 982, 1375 on a 1572px-wide 8-column grid,
         * i.e. exact multiples of the 196.5px cell pitch. On a dark banner
         * that reads as a faint grid drawn over the photograph.
         *
         * Painting the same source as the container's own background costs one
         * cached request and closes the gap with a 1px sliver of the correct
         * image rather than of bg-surface-2. Sized and positioned to match the
         * cells' object-cover, so it lines up everywhere.
         */
        backgroundImage: `url(${JSON.stringify(src)})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {pieces.map((piece, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity ease-out",
            isVisible ? "opacity-100" : "opacity-0",
          )}
          style={{
            clipPath: piece.clipPath,
            transitionDelay: `${piece.delay}ms`,
            transitionDuration: `${pixelFadeInDuration}ms`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- every cell of the
              mosaic needs the unoptimised source at its own intrinsic size, and
              next.config.ts only whitelists two remote hostnames for the optimizer. */}
          <img
            src={src}
            alt={index === 0 ? alt : ""}
            width={width}
            height={height}
            draggable={false}
            className={cn(
              "h-full w-full object-cover",
              grayscaleAnimation && (showColor ? "grayscale-0" : "grayscale"),
            )}
            style={{
              transition: grayscaleAnimation
                ? `filter ${pixelFadeInDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
                : "none",
            }}
          />
        </div>
      ))}
    </div>
  );
}
