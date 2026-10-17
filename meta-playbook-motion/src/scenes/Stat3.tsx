import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { drift, ease, mixColor, pop } from "../anim";
import { C, FONT, GRADIENT, gradientText } from "../brand";
import { Caption, CountUp, Words } from "../components";
import { rectStyle, useLayout } from "../layout";
import { SCENES } from "../timeline";

const S = SCENES.stat3;
const NUMBER_AT = 1.35;
const FILL_FROM = 0.3;
const FILL_TO = 1.05;
const CELLS = 10;

export const Stat3: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const v = L.visual;
  const swap = ease(frame, NUMBER_AT - 0.2, NUMBER_AT + 0.1);
  const fill = ease(frame, FILL_FROM, FILL_TO); // 0..1 of the way to the mark
  const glow = ease(frame, FILL_TO, FILL_TO + 0.25) * (0.75 + 0.25 * Math.sin(frame / 4));

  const barH = 56;
  const barY = v.y + v.h * 0.62;
  const markX = v.x + (v.w * S.markPercent) / 100;
  const gap = 12;
  const cellW = (v.w - gap * (CELLS - 1)) / CELLS;
  const cellH = cellW * 1.5;
  const cellY = barY - 60 - cellH;
  const lit = Math.round((S.markPercent / 100) * CELLS);

  return (
    <AbsoluteFill>
      <div style={{ ...rectStyle(L.text) }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", opacity: 1 - swap }}>
          <Words words={S.setup.split(" ")} at={0} stagger={0.07} size={L.head} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 10,
            opacity: swap,
          }}
        >
          <CountUp value={S.value} decimals={S.decimals} at={NUMBER_AT} dur={0.9} size={L.big} />
          <Caption text={S.caption} at={NUMBER_AT + 0.3} size={L.caption} />
        </div>
      </div>

      {/* the ad set: 10 creatives, the first 20% become 9:16 video */}
      {new Array(CELLS).fill(0).map((_, i) => {
        const p = pop(frame, 0.05 + i * 0.03);
        const on = i < lit ? ease(frame, FILL_FROM + (i / lit) * (FILL_TO - FILL_FROM) * 0.8, FILL_TO) : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: v.x + i * (cellW + gap),
              top: cellY + (1 - p) * 60 + drift(frame, 3, 1.6, i) - on * 30,
              width: cellW,
              height: cellH + on * 30,
              borderRadius: 14,
              background: mixColor(C.surface, C.accent, on),
              border: `3px solid ${mixColor(C.line, C.accent, on)}`,
              boxShadow: on > 0.9 ? `0 0 ${36 * glow}px ${C.accent}` : undefined,
              opacity: p,
            }}
          />
        );
      })}

      {/* bar */}
      <div
        style={{
          position: "absolute",
          left: v.x,
          top: barY,
          width: v.w,
          height: barH,
          borderRadius: 99,
          background: C.surface,
          border: `3px solid ${C.line}`,
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: (markX - v.x) * fill,
            height: "100%",
            borderRadius: 99,
            backgroundImage: GRADIENT,
            backgroundSize: `${v.w * 0.2}px 100%`,
            boxShadow: `0 0 ${50 * glow}px ${C.accent}`,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: markX - 3,
          top: barY - 18,
          width: 6,
          height: barH + 36,
          borderRadius: 3,
          background: C.pink,
          opacity: pop(frame, 0.2),
        }}
      />
      <div
        style={{
          position: "absolute",
          left: markX - 80,
          width: 160,
          textAlign: "center",
          top: barY + barH + 34,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 64,
          ...gradientText,
          opacity: pop(frame, 0.3),
          transform: `scale(${1 + 0.12 * glow})`,
        }}
      >
        {S.markPercent}%
      </div>
    </AbsoluteFill>
  );
};
