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

export const C = {
  bg: "#0B0B0F",
  surface: "#16161D",
  line: "#2A2A35",
  text: "#FFFFFF",
  muted: "#8A8A99",
  grey: "#3A3A44",
  accent: "#2F6BFF", // electric blue
  accentSoft: "#8DB0FF",
  highlight: "#C8FF3D", // lime, numbers only
} as const;
