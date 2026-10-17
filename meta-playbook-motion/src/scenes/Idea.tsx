import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { drift, ease, easeInOut, mix, mixColor, pop } from "../anim";
import { C, FONT, gradientAt } from "../brand";
import { AdCard, PersonIcon, Words } from "../components";
import { phoneGeometry } from "../geometry";
import { rectStyle, useLayout } from "../layout";
import { SCENES } from "../timeline";
import { STACK_COUNT, stackGeometry } from "./Problem";

const S = SCENES.idea;
const FILLS = [C.accent, C.teal, C.purple, C.pink, C.text, C.surface, C.teal, C.accent];
const INKS = [C.text, C.bg, C.text, C.text, C.bg, C.accentSoft, C.bg, C.text];
const MATCH = [2, 0, 3, 1, 1, 3, 0, 2]; // card -> person

const EXPLODE = 0.25;
const LINES = 1.25;
const SWAP = 2.1;
const COLLAPSE = 3.5;

export const Idea: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const v = L.visual;
  const stack = stackGeometry(L);
  const phone = phoneGeometry(L);

  // 2 rows x 4 columns of cards on the left, a column of 4 people on the right
  const gap = 18;
  const personSize = Math.min(v.h / 4 - 24, 112);
  const personX = v.x + v.w - personSize - 6;
  const gridW = personX - v.x - 90;
  const cw = Math.min((gridW - 3 * gap) / 4, ((v.h - gap) / 2) * 0.8);
  const ch = cw * 1.25;
  const gridTop = v.y + (v.h - (2 * ch + gap)) / 2;
  const cardX = (i: number) => v.x + (i % 4) * (cw + gap);
  const cardY = (i: number) => gridTop + Math.floor(i / 4) * (ch + gap);
  const personY = (j: number) => v.y + ((j + 0.5) * v.h) / 4 - personSize / 2;

  const collapse = ease(frame, COLLAPSE, COLLAPSE + 0.45, 0, 1, easeInOut);
  const swap = ease(frame, SWAP, SWAP + 0.3);

  return (
    <AbsoluteFill>
      {/* headline: two beats swapped in place */}
      <div style={{ ...rectStyle(L.text), display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 40,
            letterSpacing: 4,
            color: C.accent,
            textTransform: "uppercase",
            marginBottom: 22,
            opacity: pop(frame, 0),
          }}
        >
          {S.kicker}
        </div>
        <div style={{ position: "relative", height: L.head * 2.3 }}>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - swap, transform: `translateY(${-40 * swap}px)` }}>
            <Words words={S.line1.split(" ")} at={0.1} stagger={0.12} size={L.head} />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: swap }}>
            <Words
              words={S.line2.split(" ").map((t) => ({ t, color: t === "variety." ? C.pink : C.text }))}
              at={SWAP}
              stagger={0.1}
              size={Math.round(L.head * 1.15)}
            />
          </div>
        </div>
      </div>

      {/* connection lines */}
      <svg style={{ position: "absolute", left: 0, top: 0, width: L.width, height: L.height, opacity: 1 - collapse }}>
        {S.cards.map((_, i) => {
          const x1 = cardX(i) + cw / 2;
          const y1 = cardY(i) + ch / 2;
          const x2 = personX - 8;
          const y2 = personY(MATCH[i]) + personSize / 2;
          const len = Math.hypot(x2 - x1, y2 - y1) + 40;
          const p = ease(frame, LINES + i * 0.08, LINES + 0.5 + i * 0.08);
          return (
            <path
              key={i}
              d={`M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`}
              stroke={gradientAt(i / 7)}
              strokeWidth={4}
              fill="none"
              strokeDasharray={len}
              strokeDashoffset={len * (1 - p)}
              strokeLinecap="round"
            />
          );
        })}
      </svg>

      {/* people */}
      {[0, 1, 2, 3].map((j) => {
        const p = pop(frame, 0.9 + j * 0.1);
        const lit = ease(frame, LINES + 0.45, LINES + 0.9);
        return (
          <div
            key={j}
            style={{
              position: "absolute",
              left: personX,
              top: personY(j) + drift(frame, 4, 1.8, j),
              width: personSize,
              height: personSize,
              borderRadius: 99,
              background: mixColor(C.surface, gradientAt(j / 3), lit),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: p * (1 - collapse),
              transform: `scale(${p})`,
            }}
          >
            <PersonIcon size={personSize * 0.62} color={C.text} />
          </div>
        );
      })}

      {/* cards: grey stack -> exploded grid -> one landscape card */}
      {S.cards.map((kind, i) => {
        const e = pop(frame, EXPLODE + i * 0.035, 13);
        const so = stack.offset(Math.min(i, STACK_COUNT - 1));
        const sx = stack.cx - stack.w / 2 + so.x;
        const sy = stack.cy - stack.h / 2 + so.y;
        const gx = cardX(i);
        const gy = cardY(i) + drift(frame, 3, 2, i);
        const w0 = mix(stack.w, cw, e);
        const h0 = mix(stack.h, ch, e);
        // collapse target: landscape phone box, centered on the phone position
        const tw = phone.h;
        const th = phone.w;
        const x = mix(mix(sx, gx, e), phone.cx - tw / 2, collapse);
        const y = mix(mix(sy, gy, e), phone.cy - th / 2, collapse);
        const w = mix(w0, tw, collapse);
        const h = mix(h0, th, collapse);
        const pre = 1 - e;
        const shake = frame < EXPLODE * 30 ? Math.sin(frame * 3 + i) * 4 : 0;
        return (
          <AdCard
            key={i}
            w={w}
            h={h}
            kind={kind}
            label={e > 0.6 && collapse < 0.3}
            fill={mixColor(mixColor(FILLS[i], C.grey, pre), C.accent, collapse)}
            ink={mixColor(INKS[i], C.text, Math.max(pre, collapse))}
            style={{
              left: x + shake,
              top: y,
              transform: `rotate(${so.r * pre}deg)`,
              opacity: i >= STACK_COUNT ? e : 1,
              border: FILLS[i] === C.surface ? `3px solid ${C.accent}` : undefined,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
