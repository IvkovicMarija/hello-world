import { Layout } from "./layout";

// Phone frame used in Stat 1. The Idea scene ends on a landscape card with the
// same box rotated 90deg, so the cut into Stat 1 reads as one shape turning.
export const phoneGeometry = (L: Layout) => {
  const h = Math.min(L.visual.h * 0.92, 600);
  const w = h * (9 / 16) + 24;
  const cx = L.visual.x + Math.max(L.visual.w * 0.3, h / 2 + 4);
  const cy = L.visual.y + L.visual.h / 2;
  return { w, h, cx, cy };
};
