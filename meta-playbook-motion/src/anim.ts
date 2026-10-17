import { Easing, interpolate, spring } from "remotion";
import { FPS } from "./timeline";

// Spring 0 -> 1 starting at `atSec` (scene-local seconds).
export const pop = (frame: number, atSec: number, damping = 14, mass = 0.7) =>
  spring({ frame: frame - atSec * FPS, fps: FPS, config: { damping, mass, stiffness: 170 } });

// Ease-out tween between two scene-local times.
export const ease = (
  frame: number,
  fromSec: number,
  toSec: number,
  from = 0,
  to = 1,
  curve: (t: number) => number = Easing.out(Easing.cubic),
) =>
  interpolate(frame, [fromSec * FPS, toSec * FPS], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: curve,
  });

export const easeInOut = Easing.inOut(Easing.cubic);

// Gentle perpetual motion so nothing is ever fully still.
export const drift = (frame: number, amp = 6, periodSec = 3, phase = 0) =>
  Math.sin((frame / FPS / periodSec) * Math.PI * 2 + phase) * amp;

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// Accepts "#rrggbb" or "rgb(r,g,b)" so results can be mixed again.
const rgb = (c: string) =>
  c.startsWith("#")
    ? [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
    : c.replace(/[^\d,]/g, "").split(",").map(Number);

export const mixColor = (a: string, b: string, t: number) => {
  const pa = rgb(a);
  const pb = rgb(b);
  return `rgb(${pa.map((v, i) => Math.round(mix(v, pb[i], t))).join(",")})`;
};
