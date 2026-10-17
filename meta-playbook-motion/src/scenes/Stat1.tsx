import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { drift, ease, mixColor, pop } from "../anim";
import { C, FONT } from "../brand";
import { Caption, CountUp, PlayIcon, SoundWave, Words } from "../components";
import { phoneGeometry } from "../geometry";
import { rectStyle, useLayout } from "../layout";
import { SCENES } from "../timeline";

const S = SCENES.stat1;
const NUMBER_AT = 1.6;

const ChipIcon: React.FC<{ i: number; frame: number }> = ({ i, frame }) => {
  if (i === 0)
    return <div style={{ width: 26, height: 44, border: `5px solid ${C.text}`, borderRadius: 6 }} />;
  if (i === 1) return <SoundWave size={44} color={C.text} frame={frame} />;
  return <div style={{ width: 40, height: 40, border: `4px dashed ${C.text}`, borderRadius: 6 }} />;
};

export const Stat1: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const ph = phoneGeometry(L);
  const turn = pop(frame, 0, 15, 0.8);
  const body = ease(frame, 0.15, 0.6);
  const swap = ease(frame, NUMBER_AT - 0.2, NUMBER_AT + 0.1);

  const chipX = ph.cx + ph.w / 2 + 40;
  const chipW = L.visual.x + L.visual.w - chipX;

  return (
    <AbsoluteFill>
      <div style={{ ...rectStyle(L.text) }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            opacity: 1 - swap,
          }}
        >
          <Words words={S.setup.split(" ")} at={0.25} stagger={0.09} size={L.head} />
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

      {/* phone: starts as the landscape card from the Idea scene and turns upright */}
      <div
        style={{
          position: "absolute",
          left: ph.cx - ph.w / 2,
          top: ph.cy - ph.h / 2 + drift(frame, 4, 2.4),
          width: ph.w,
          height: ph.h,
          borderRadius: ph.w * 0.14,
          background: mixColor(C.accent, C.surface, body),
          border: `6px solid ${mixColor(C.accent, C.accent, body)}`,
          boxSizing: "border-box",
          transform: `rotate(${90 * (1 - turn)}deg)`,
          boxShadow: `0 0 ${60 * body}px ${C.accent}55`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 16,
            width: 70,
            height: 14,
            marginLeft: -35,
            borderRadius: 99,
            background: C.bg,
            opacity: body,
          }}
        />
        {/* safe-zone guide inside the phone */}
        <div
          style={{
            position: "absolute",
            left: "8%",
            right: "10%",
            top: "14%",
            bottom: "35%",
            border: `4px dashed ${C.accentSoft}`,
            borderRadius: 14,
            opacity: ease(frame, 1.0, 1.3),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ opacity: body, transform: `scale(${1 + 0.06 * Math.sin(frame / 5)})` }}>
            <PlayIcon size={ph.w * 0.32} color={C.text} />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: "12%",
            display: "flex",
            justifyContent: "center",
            opacity: ease(frame, 0.75, 1.0),
          }}
        >
          <SoundWave size={ph.w * 0.3} color={C.accent} frame={frame} />
        </div>
      </div>

      {/* chips */}
      <div
        style={{
          position: "absolute",
          left: chipX,
          top: L.visual.y,
          width: chipW,
          height: L.visual.h,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 26,
        }}
      >
        {S.chips.map((label, i) => {
          const p = pop(frame, 0.5 + i * 0.25);
          const pulse = Math.max(0, Math.sin((frame / 30 - 1.8 - i * 0.35) * Math.PI * 1.4));
          const lit = frame / 30 > 1.8 ? pulse : 0;
          return (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 22,
                padding: "22px 26px",
                borderRadius: 22,
                background: mixColor(C.surface, C.accent, 0.35 + 0.65 * lit),
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: Math.min(48, chipW / 7),
                color: C.text,
                opacity: p,
                transform: `translateX(${(1 - p) * 80}px)`,
              }}
            >
              <ChipIcon i={i} frame={frame} />
              {label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
