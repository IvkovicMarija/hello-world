import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { drift, ease, pop } from "../anim";
import { C, FONT } from "../brand";
import { Caption, CountUp, ImageIcon, PlayIcon, SoundWave, Words } from "../components";
import { rectStyle, useLayout } from "../layout";
import { SCENES } from "../timeline";

const S = SCENES.stat2;
const NUMBER_AT = 1.7;
const RATIOS = [1, 0.8, 9 / 16]; // width / height
const FILLS = [C.text, C.accentSoft, C.accent];
const INKS = [C.bg, C.bg, C.text];
const FROM = [
  { x: -700, y: 120, r: -18 },
  { x: 0, y: -700, r: 10 },
  { x: 700, y: 160, r: 16 },
];

export const Stat2: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const v = L.visual;
  const tileH = Math.min(v.h * 0.82, (v.w - 20) / (RATIOS[0] + RATIOS[1] + RATIOS[2]), 420);
  const widths = RATIOS.map((r) => r * tileH);
  const total = widths.reduce((a, b) => a + b, 0);
  const x0 = v.x + (v.w - total) / 2;
  const top = v.y + (v.h - tileH) / 2;
  const swap = ease(frame, NUMBER_AT - 0.2, NUMBER_AT + 0.1);
  const lastSnap = 0.2 + 2 * 0.28 + 0.35;
  const flash = Math.max(0, 1 - Math.abs(frame / 30 - lastSnap) * 4);

  let x = x0;
  return (
    <AbsoluteFill>
      <div style={{ ...rectStyle(L.text) }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", opacity: 1 - swap }}>
          <Words words={S.setup.split(" ")} at={0.05} stagger={0.08} size={L.head} />
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
          <CountUp value={S.value} decimals={S.decimals} at={NUMBER_AT} size={L.big} />
          <Caption text={S.caption} at={NUMBER_AT + 0.35} size={L.caption} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: x0 - 20,
          top: top - 20,
          width: total + 40,
          height: tileH + 40,
          borderRadius: 40,
          boxShadow: `0 0 ${80 * flash}px ${C.accent}`,
          border: `4px solid ${C.accent}`,
          opacity: ease(frame, lastSnap, lastSnap + 0.2) * (0.6 + 0.4 * Math.sin(frame / 6)),
        }}
      />

      {S.tiles.map((label, i) => {
        const p = pop(frame, 0.2 + i * 0.28, 12, 0.8);
        const w = widths[i];
        const left = x;
        x += w;
        const f = FROM[i];
        const bob = drift(frame, 3, 2, i);
        return (
          <div
            key={label}
            style={{
              position: "absolute",
              left: left + f.x * (1 - p),
              top: top + f.y * (1 - p) + bob,
              width: w,
              height: tileH,
              background: FILLS[i],
              borderRadius: i === 0 ? "28px 0 0 28px" : i === 2 ? "0 28px 28px 0" : 0,
              transform: `rotate(${f.r * (1 - p)}deg)`,
              opacity: Math.min(1, p * 2),
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 26,
              boxSizing: "border-box",
              zIndex: 3 - i,
            }}
          >
            {/* puzzle tab */}
            {i < 2 ? (
              <div
                style={{
                  position: "absolute",
                  right: -30,
                  top: tileH / 2 - 30,
                  width: 60,
                  height: 60,
                  borderRadius: 99,
                  background: FILLS[i],
                }}
              />
            ) : null}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {i === 0 ? <ImageIcon size={64} color={INKS[i]} /> : <PlayIcon size={60} color={INKS[i]} />}
              {i === 2 ? <SoundWave size={44} color={INKS[i]} frame={frame} /> : null}
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: Math.min(44, w / 5.2),
                lineHeight: 1.05,
                color: INKS[i],
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
