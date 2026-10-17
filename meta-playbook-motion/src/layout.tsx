import React, { createContext, useContext } from "react";

export type Rect = { x: number; y: number; w: number; h: number };

export type Layout = {
  format: "9x16" | "4x5";
  width: number;
  height: number;
  safe: Rect; // all text and key visuals live in here
  text: Rect; // headline zone (top of safe)
  visual: Rect; // illustration zone (below headline)
  head: number; // headline font size
  big: number; // stat number font size
  caption: number;
};

const split = (safe: Rect, textH: number, gap: number) => ({
  text: { x: safe.x, y: safe.y, w: safe.w, h: textH },
  visual: { x: safe.x, y: safe.y + textH + gap, w: safe.w, h: safe.h - textH - gap },
});

// 9:16 Reels: keep out of top 14%, bottom 35%, right 6%.
const reelsSafe: Rect = (() => {
  const W = 1080;
  const H = 1920;
  const top = Math.ceil(H * 0.14);
  const bottom = Math.floor(H * 0.65);
  const right = Math.floor(W * 0.94);
  return { x: 64, y: top, w: right - 64, h: bottom - top };
})();

// 4:5 Feed: no Reels UI, so a uniform margin with a little extra at the bottom.
const feedSafe: Rect = { x: 72, y: 84, w: 1080 - 144, h: 1350 - 84 - 120 };

export const LAYOUTS: Record<Layout["format"], Layout> = {
  "9x16": {
    format: "9x16",
    width: 1080,
    height: 1920,
    safe: reelsSafe,
    ...split(reelsSafe, 410, 20),
    head: 96,
    big: 210,
    caption: 54,
  },
  "4x5": {
    format: "4x5",
    width: 1080,
    height: 1350,
    safe: feedSafe,
    ...split(feedSafe, 470, 30),
    head: 100,
    big: 230,
    caption: 56,
  },
};

const Ctx = createContext<Layout>(LAYOUTS["9x16"]);
export const LayoutProvider: React.FC<{ layout: Layout; children: React.ReactNode }> = ({
  layout,
  children,
}) => <Ctx.Provider value={layout}>{children}</Ctx.Provider>;
export const useLayout = () => useContext(Ctx);

export const rectStyle = (r: Rect): React.CSSProperties => ({
  position: "absolute",
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
});
