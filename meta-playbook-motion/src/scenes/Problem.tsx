import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { drift, ease, mixColor, pop } from "../anim";
import { C } from "../brand";
import { AdCard, Caption, Words } from "../components";
import { Layout, rectStyle, useLayout } from "../layout";
import { SCENES } from "../timeline";

const S = SCENES.problem;
export const STACK_COUNT = 6;

// Shared with the Idea scene so the grey stack continues across the cut.
export const stackGeometry = (L: Layout) => {
  const w = Math.min(L.visual.w * 0.34, 330);
  const h = w * 1.25;
  const cx = L.visual.x + L.visual.w / 2;
  const cy = L.visual.y + L.visual.h * 0.47;
  const offset = (i: number) => ({ x: (i - (STACK_COUNT - 1) / 2) * 26, y: -i * 22, r: (i - 2.5) * 2.2 });
  return { w, h, cx, cy, offset };
};

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const g = stackGeometry(L);
  const grey = ease(frame, 2.4, 3.4);

  return (
    <AbsoluteFill>
      <div style={{ ...rectStyle(L.text), display: "flex", flexDirection: "column", justifyContent: "center", gap: 28 }}>
        <Words words={S.line1.split(" ")} at={0} stagger={0.12} size={L.head} />
        <Caption text={S.line2} at={1.3} size={Math.round(L.head * 0.62)} color={mixColor(C.text, C.muted, grey)} />
      </div>

      {new Array(STACK_COUNT).fill(0).map((_, i) => {
        const p = i === 0 ? pop(frame, 0) : pop(frame, 0.5 + i * 0.16, 12);
        const o = g.offset(i);
        const bob = drift(frame, 5, 2.2, i);
        const fill = mixColor(C.accent, C.grey, grey);
        return (
          <AdCard
            key={i}
            w={g.w}
            h={g.h}
            fill={fill}
            ink={mixColor(C.text, C.muted, grey)}
            style={{
              left: g.cx - g.w / 2 + o.x * p,
              top: g.cy - g.h / 2 + o.y * p + bob,
              transform: `rotate(${o.r * p}deg) scale(${0.6 + 0.4 * p})`,
              opacity: (i === 0 ? 1 : p) * (1 - 0.35 * grey),
              zIndex: i,
            }}
          />
        );
      })}

      {/* "on repeat" loop badge */}
      <div
        style={{
          position: "absolute",
          left: g.cx + g.w / 2 + 90,
          top: g.cy - 46,
          width: 92,
          height: 92,
          borderRadius: 99,
          border: `6px solid ${mixColor(C.accent, C.muted, grey)}`,
          borderRightColor: "transparent",
          opacity: pop(frame, 1.4),
          transform: `rotate(${frame * 9}deg)`,
        }}
      />
    </AbsoluteFill>
  );
};
