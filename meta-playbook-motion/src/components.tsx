import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { drift, ease, pop } from "./anim";
import { C, FONT } from "./brand";
import { rectStyle, useLayout } from "./layout";

export const Background: React.FC = () => {
  const frame = useCurrentFrame(); // global frame: continuous across scenes
  const { width, height } = useLayout();
  const gx = (frame * 0.6) % 60;
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${C.line} 2px, transparent 2px)`,
          backgroundSize: "60px 60px",
          backgroundPosition: `${gx}px ${gx * 0.5}px`,
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          width: width * 1.1,
          height: width * 1.1,
          left: width * 0.2 + drift(frame, 120, 9),
          top: height * 0.15 + drift(frame, 90, 7, 1),
          background: `radial-gradient(circle, ${C.accent}33 0%, transparent 65%)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const SafeZoneOverlay: React.FC = () => {
  const { width, height, safe, text, visual } = useLayout();
  const red = "rgba(255,40,40,0.28)";
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width, height: safe.y, background: red }} />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: safe.y + safe.h,
          width,
          height: height - safe.y - safe.h,
          background: red,
        }}
      />
      <div style={{ position: "absolute", left: 0, top: safe.y, width: safe.x, height: safe.h, background: red }} />
      <div
        style={{
          position: "absolute",
          left: safe.x + safe.w,
          top: safe.y,
          width: width - safe.x - safe.w,
          height: safe.h,
          background: red,
        }}
      />
      <div style={{ ...rectStyle(text), outline: "2px dashed rgba(255,255,0,0.7)" }} />
      <div style={{ ...rectStyle(visual), outline: "2px dashed rgba(0,255,255,0.7)" }} />
    </AbsoluteFill>
  );
};

type WordSpec = { t: string; color?: string };

// Words that spring up into place one by one (scene-local timing).
export const Words: React.FC<{
  words: (string | WordSpec)[];
  at: number;
  stagger?: number;
  size: number;
  weight?: number;
  color?: string;
  slam?: boolean;
  style?: React.CSSProperties;
}> = ({ words, at, stagger = 0.1, size, weight = 800, color = C.text, slam = false, style }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        columnGap: size * 0.26,
        rowGap: size * 0.02,
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.05,
        letterSpacing: -size * 0.03,
        color,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const spec = typeof w === "string" ? { t: w } : w;
        const p = pop(frame, at + i * stagger, slam ? 11 : 14);
        const scale = slam ? 2.1 - 1.1 * p : 1;
        const y = slam ? 0 : (1 - p) * size * 0.5;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: Math.min(1, p * 1.6),
              transform: `translateY(${y}px) scale(${scale})`,
              transformOrigin: "50% 60%",
              color: spec.color ?? color,
            }}
          >
            {spec.t}
          </span>
        );
      })}
    </div>
  );
};

export const CountUp: React.FC<{
  value: number;
  decimals: number;
  at: number;
  dur?: number;
  size: number;
}> = ({ value, decimals, at, dur = 1.2, size }) => {
  const frame = useCurrentFrame();
  const v = ease(frame, at, at + dur, 0, value);
  const appear = pop(frame, at, 12);
  const settle = pop(frame, at + dur, 8);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 0.95,
        letterSpacing: -size * 0.04,
        color: C.highlight,
        fontVariantNumeric: "tabular-nums",
        opacity: appear,
        transform: `scale(${0.85 + 0.15 * appear + 0.04 * Math.sin(settle * Math.PI)})`,
        transformOrigin: "0% 70%",
        textShadow: `0 0 ${40 * settle}px ${C.highlight}55`,
      }}
    >
      {v.toFixed(decimals)}%
    </div>
  );
};

export const Caption: React.FC<{ text: string; at: number; size: number; color?: string }> = ({
  text,
  at,
  size,
  color = C.text,
}) => {
  const frame = useCurrentFrame();
  const p = pop(frame, at);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.12,
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      {text}
    </div>
  );
};

// ---------- icons (pure SVG) ----------
type IconProps = { size: number; color?: string };

export const PlayIcon: React.FC<IconProps> = ({ size, color = C.text }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M7 4.5v15l13-7.5z" fill={color} />
  </svg>
);

export const ImageIcon: React.FC<IconProps> = ({ size, color = C.text }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="9" cy="10" r="2" fill={color} />
    <path d="M3 18l6-5 4 3 3-2 5 4" />
  </svg>
);

export const PersonIcon: React.FC<IconProps> = ({ size, color = C.text }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <circle cx="12" cy="7.5" r="4.2" />
    <path d="M3.5 21c.6-4.6 4-7.3 8.5-7.3s7.9 2.7 8.5 7.3z" />
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ size, color = C.text }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" />
  </svg>
);

export const SelfieIcon: React.FC<IconProps> = ({ size, color = C.text }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
    <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
    <circle cx="12" cy="10" r="2.6" fill={color} />
    <path d="M8.5 17c.6-2 1.9-3 3.5-3s2.9 1 3.5 3" />
  </svg>
);

export const SoundWave: React.FC<{ size: number; color?: string; frame: number }> = ({
  size,
  color = C.accent,
  frame,
}) => {
  const bars = 7;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.06, height: size }}>
      {new Array(bars).fill(0).map((_, i) => {
        const h = 0.25 + 0.75 * Math.abs(Math.sin(frame / 4 + i * 0.9));
        return (
          <div
            key={i}
            style={{ width: size * 0.08, height: size * h, borderRadius: size, background: color }}
          />
        );
      })}
    </div>
  );
};

export const CardKindIcon: React.FC<{ kind: string; size: number; color?: string }> = ({
  kind,
  size,
  color,
}) => {
  if (kind === "IMAGE") return <ImageIcon size={size} color={color} />;
  if (kind === "UGC") return <SelfieIcon size={size} color={color} />;
  if (kind === "CREATOR") return <StarIcon size={size} color={color} />;
  return <PlayIcon size={size} color={color} />;
};

// A generic "ad" card: icon + a few skeleton text lines.
export const AdCard: React.FC<{
  w: number;
  h: number;
  fill: string;
  ink?: string;
  kind?: string;
  label?: boolean;
  style?: React.CSSProperties;
}> = ({ w, h, fill, ink = C.text, kind = "VIDEO", label = false, style }) => (
  <div
    style={{
      position: "absolute",
      width: w,
      height: h,
      borderRadius: Math.min(w, h) * 0.09,
      background: fill,
      boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: Math.min(w, h) * 0.1,
      boxSizing: "border-box",
      ...style,
    }}
  >
    <CardKindIcon kind={kind} size={Math.min(w, h) * 0.3} color={ink} />
    <div>
      {label ? (
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: Math.min(w, h) * 0.13,
            color: ink,
            letterSpacing: 1,
          }}
        >
          {kind}
        </div>
      ) : (
        <>
          <div style={{ height: h * 0.05, width: "80%", borderRadius: 99, background: ink, opacity: 0.8 }} />
          <div
            style={{
              height: h * 0.05,
              width: "55%",
              borderRadius: 99,
              background: ink,
              opacity: 0.5,
              marginTop: h * 0.04,
            }}
          />
        </>
      )}
    </div>
  </div>
);
