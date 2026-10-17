// Renders one still from the middle of each scene (+ optional extra frames).
// Usage: node scripts/stills.mjs [--debug] [--comp=MetaPlaybook9x16] [--out=out/stills] [--frames=30,60]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const arg = (k, d) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d;
const debug = process.argv.includes("--debug");
const compId = arg("comp", "MetaPlaybook9x16");
const outDir = arg("out", "out/stills");
const browserExecutable = process.env.REMOTION_BROWSER ?? null;

// One frame per scene, mid-scene but after count-ups settle (mirror src/timeline.ts).
const mids = [
  ["1-hook", 1.4], ["2-problem", 4.0], ["3-idea", 8.0], ["4-stat1", 13.0],
  ["5-stat2", 17.0], ["6-stat3", 20.0], ["7-takeaway", 22.6], ["8-endcard", 24.4],
];
const extra = arg("frames", "");
const list = extra
  ? extra.split(",").map((f) => [`f${f}`, Number(f) / 30])
  : mids;

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const inputProps = { showSafeZone: debug };
const composition = await selectComposition({ serveUrl, id: compId, inputProps, browserExecutable });
for (const [name, s] of list) {
  const output = path.join(outDir, `${compId === "MetaPlaybook4x5" ? "4x5_" : ""}${name}.png`);
  await renderStill({ composition, serveUrl, output, frame: Math.round(s * 30), inputProps, browserExecutable });
  console.log(output);
}
