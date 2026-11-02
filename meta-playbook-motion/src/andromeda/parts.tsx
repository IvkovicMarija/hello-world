import React from "react";
import { useCurrentFrame } from "remotion";
import { ease, pop } from "../anim";
import { C, FONT, gradientText } from "../brand";
import { Layout, Rect } from "../layout";

// ---------- the "ad pool": a grid of mini ad cards shared by several scenes ----------
// Same geometry in every scene, so the grid reads as one continuous object across cuts.
export const poolGeometry = (L: Layout) => {
  const v = L.visual;
  const area: Rect = { x: v.x, y: v.y, w: v.w * 0.6, h: v.h };
  const cols = 8;
  const gap = 10;
  const cw = (area.w - gap * (cols - 1)) / cols;
  const ch = cw * 1.25;
  const rows = Math.max(3, Math.floor((area.h + gap) / (ch + gap)));
  const top = area.y + (area.h - (rows * ch + (rows - 1) * gap)) / 2;
  const cell = (i: number) => ({
    x: area.x + (i % cols) * (cw + gap),
    y: top + Math.floor(i / cols) * (ch + gap),
    col: i % cols,
    row: Math.floor(i / cols),
  });
  const side: Rect = { x: v.x + area.w + 40, y: v.y, w: v.w - area.w - 40, h: v.h };
  return { area, cols, rows, count: cols * rows, cw, ch, cell, side };
};

export type DotStyle = { fill: string; opacity?: number; scale?: number; glow?: string };

export const AdPool: React.FC<{ L: Layout; style: (i: number, col: number, row: number) => DotStyle }> = ({
  L,
  style,
}) => {
  const g = poolGeometry(L);
  return (
    <>
      {new Array(g.count).fill(0).map((_, i) => {
        const c = g.cell(i);
        const s = style(i, c.col, c.row);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c.x,
              top: c.y,
              width: g.cw,
              height: g.ch,
              borderRadius: g.cw * 0.18,
              background: s.fill,
              opacity: s.opacity ?? 1,
              transform: `scale(${s.scale ?? 1})`,
              boxShadow: s.glow ? `0 0 18px ${s.glow}` : undefined,
            }}
          />
        );
      })}
    </>
  );
};

// ---------- icons ----------
export const GpuIcon: React.FC<{ size: number; glow: number }> = ({ size, glow }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" style={{ filter: `drop-shadow(0 0 ${14 * glow}px ${C.accent})` }}>
    {[10, 18, 26, 34].map((p) => (
      <g key={p} stroke={C.accentSoft} strokeWidth={2.5} strokeLinecap="round">
        <line x1={p + 2} y1={2} x2={p + 2} y2={8} />
        <line x1={p + 2} y1={40} x2={p + 2} y2={46} />
        <line x1={2} y1={p + 2} x2={8} y2={p + 2} />
        <line x1={40} y1={p + 2} x2={46} y2={p + 2} />
      </g>
    ))}
    <rect x="8" y="8" width="32" height="32" rx="5" fill={C.surface} stroke={C.accent} strokeWidth={3} />
    <rect x="15" y="15" width="18" height="18" rx="3" fill={C.accent} opacity={0.5 + 0.5 * glow} />
    <text x="24" y="28.5" textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize="9" fill={C.text}>
      GPU
    </text>
  </svg>
);

export const CheckIcon: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="11" fill={color} />
    <path d="M6.5 12.5l3.5 3.5 7.5-8" stroke={C.bg} strokeWidth={2.8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const Kicker: React.FC<{ text: string; at?: number; color?: string }> = ({ text, at = 0, color = C.accent }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 40,
        letterSpacing: 4,
        textTransform: "uppercase",
        color,
        marginBottom: 22,
        opacity: pop(frame, at),
      }}
    >
      {text}
    </div>
  );
};

// Big counting number with thousands separators, auto-shrunk to fit `maxW`.
export const BigCount: React.FC<{ value: number; suffix: string; at: number; dur: number; size: number; maxW: number }> = ({
  value,
  suffix,
  at,
  dur,
  size,
  maxW,
}) => {
  const frame = useCurrentFrame();
  const v = Math.round(ease(frame, at, at + dur, 0, value));
  const done = frame >= (at + dur) * 30;
  const text = v.toLocaleString("en-US") + (done ? suffix : "");
  const full = value.toLocaleString("en-US") + suffix;
  const fit = Math.min(size, maxW / (full.length * 0.6));
  const appear = pop(frame, at, 12);
  const settle = pop(frame, at + dur, 8);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: fit,
        lineHeight: 1,
        letterSpacing: -fit * 0.03,
        fontVariantNumeric: "tabular-nums",
        ...gradientText,
        alignSelf: "flex-start",
        opacity: appear,
        transform: `scale(${0.88 + 0.12 * appear + 0.04 * Math.sin(settle * Math.PI)})`,
        transformOrigin: "0% 70%",
        filter: `drop-shadow(0 0 ${30 * settle}px ${C.accent}88)`,
      }}
    >
      {text}
    </div>
  );
};
