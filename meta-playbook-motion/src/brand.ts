import type React from "react";
import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Inter (SIL Open Font License), bundled in public/fonts so renders need no network.
export const FONT = "Inter";
const WEIGHTS: [string, string][] = [
  ["500", "Medium"],
  ["700", "Bold"],
  ["800", "ExtraBold"],
  ["900", "Black"],
];
for (const [weight, name] of WEIGHTS) {
  loadFont({ family: FONT, url: staticFile(`fonts/Inter-${name}.otf`), weight, format: "opentype" });
}

// Advantage brand kit (sampled from the logo files in public/brand/).
export const C = {
  bg: "#0C1B35", // navy
  bgGlowBlue: "#16326A",
  bgGlowPurple: "#3B3259",
  surface: "#16284A",
  line: "#243A63",
  text: "#FFFFFF",
  muted: "#8C9AB8",
  grey: "#3A4560",
  teal: "#1ECEA6",
  accent: "#2A6AFF", // brand blue
  accentSoft: "#8DB0FF",
  purple: "#9465D1",
  pink: "#F25FA7",
} as const;

const STOPS: [number, string][] = [
  [0, C.teal],
  [0.5, C.accent],
  [0.75, C.purple],
  [1, C.pink],
];

// The logo's left-to-right gradient. Used for numbers and brand moments.
export const GRADIENT = `linear-gradient(90deg, ${STOPS.map(([p, c]) => `${c} ${p * 100}%`).join(", ")})`;

// Colour at position t (0..1) along the brand gradient.
export const gradientAt = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  for (let i = 1; i < STOPS.length; i++) {
    const [p1, c1] = STOPS[i];
    const [p0, c0] = STOPS[i - 1];
    if (x <= p1) {
      const k = (x - p0) / (p1 - p0);
      const a = [1, 3, 5].map((j) => parseInt(c0.slice(j, j + 2), 16));
      const b = [1, 3, 5].map((j) => parseInt(c1.slice(j, j + 2), 16));
      return `rgb(${a.map((v, j) => Math.round(v + (b[j] - v) * k)).join(",")})`;
    }
  }
  return C.pink;
};

// Gradient-filled text (numbers only, plus the end card).
export const gradientText: React.CSSProperties = {
  backgroundImage: GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};
