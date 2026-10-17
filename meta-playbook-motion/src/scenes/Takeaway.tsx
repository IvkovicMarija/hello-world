import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { drift, ease, mixColor, pop } from "../anim";
import { C, FONT } from "../brand";
import { Words } from "../components";
import { useLayout } from "../layout";
import { SCENES } from "../timeline";

const S = SCENES.takeaway;
const STRIKE_AT = 0.4;
const LINE2_AT = 0.8;
const TILES_AT = 0.85;

// deterministic scatter for the letter tiles
const scatter = (i: number) => ({
  x: Math.sin(i * 12.9898) * 420,
  y: Math.cos(i * 78.233) * 380 + 200,
  r: Math.sin(i * 3.7) * 70,
});

export const Takeaway: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const size = L.head;
  const strike = ease(frame, STRIKE_AT, STRIKE_AT + 0.3);
  const struckP = pop(frame, 0.24);
  const letters = S.tileWord.split("");
  const tile = Math.min(size * 1.15, (L.safe.w - 10 * (letters.length - 1)) / letters.length);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: L.safe.x,
          top: L.safe.y,
          width: L.safe.w,
          height: L.safe.h,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: size * 0.5,
          transform: `translateY(${drift(frame, 4, 2)}px)`,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.26, alignItems: "baseline" }}>
          <Words words={S.line1Pre.split(" ")} at={0} stagger={0.1} size={size} />
          <div style={{ position: "relative", opacity: struckP }}>
            <Words
              words={S.line1Struck.split(" ")}
              at={0.2}
              stagger={0.08}
              size={size}
              color={mixColor(C.text, C.muted, strike)}
            />
            <div
              style={{
                position: "absolute",
                left: -8,
                top: "52%",
                height: size * 0.12,
                width: `calc(${strike * 100}% + 16px)`,
                background: C.accent,
                borderRadius: 99,
              }}
            />
          </div>
        </div>

        <div>
          <Words words={S.line2Pre.split(" ")} at={LINE2_AT} stagger={0.08} size={size} />
          <div style={{ display: "flex", gap: 10, marginTop: size * 0.3 }}>
            {letters.map((ch, i) => {
              const p = pop(frame, TILES_AT + i * 0.035, 13);
              const s = scatter(i);
              return (
                <div
                  key={i}
                  style={{
                    width: ch === "." ? tile * 0.35 : tile,
                    height: tile * 1.15,
                    borderRadius: tile * 0.16,
                    background: ch === "." ? "transparent" : C.accent,
                    color: C.text,
                    fontFamily: FONT,
                    fontWeight: 900,
                    fontSize: tile * 0.78,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transform: `translate(${s.x * (1 - p)}px, ${s.y * (1 - p)}px) rotate(${s.r * (1 - p)}deg) scale(${0.4 + 0.6 * p})`,
                    opacity: Math.min(1, p * 2),
                    boxShadow: p > 0.95 && ch !== "." ? `0 0 ${24 + 10 * Math.sin(frame / 4)}px ${C.accent}88` : undefined,
                  }}
                >
                  {ch}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
