import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { drift, ease, pop } from "../anim";
import { C, FONT, gradientText } from "../brand";
import { useLayout } from "../layout";
import { SCENES } from "../timeline";

const S = SCENES.endCard;
const MARK_RATIO = 866 / 862; // h / w of advantage-mark.png

const LinkedInIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <rect width="24" height="24" rx="5" fill={C.accent} />
    <rect x="5" y="9.5" width="3" height="9" fill={C.text} />
    <circle cx="6.5" cy="6.3" r="1.8" fill={C.text} />
    <path
      d="M10.5 9.5h2.9v1.3c.5-.9 1.6-1.5 3-1.5 2.4 0 3.1 1.5 3.1 3.9v5.3h-3v-4.7c0-1.1-.3-1.9-1.4-1.9-1.2 0-1.6.9-1.6 2v4.6h-3z"
      fill={C.text}
    />
  </svg>
);

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const avatar = pop(frame, 0, 15);
  const markP = pop(frame, 0.25, 12);
  const name = pop(frame, 0.3);
  const tag = pop(frame, 0.45);
  const link = pop(frame, 0.6);
  const src = ease(frame, 0.8, 1.2);
  const breathe = 1 + ease(frame, 0, 2, 0, 0.035);

  const avatarSize = Math.min(L.safe.w * 0.46, L.safe.h * 0.42);
  const markW = avatarSize * 0.3;

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
          alignItems: "center",
          textAlign: "center",
          fontFamily: FONT,
        }}
      >
        <div style={{ flex: 1 }} />

        {/* avatar with the Advantage "A" as a badge */}
        <div
          style={{
            position: "relative",
            width: avatarSize,
            height: avatarSize,
            opacity: avatar,
            transform: `scale(${(0.85 + 0.15 * avatar) * breathe}) translateY(${drift(frame, 3, 2)}px)`,
          }}
        >
          <Img src={staticFile(S.avatar)} style={{ width: avatarSize, height: avatarSize }} />
          <div
            style={{
              position: "absolute",
              right: -markW * 0.1,
              bottom: -markW * 0.05,
              width: markW * 1.3,
              height: markW * 1.3,
              borderRadius: 999,
              background: C.bg,
              boxShadow: `0 0 0 4px ${C.bg}, 0 12px 30px rgba(0,0,0,0.5)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: markP,
              transform: `scale(${0.4 + 0.6 * markP}) rotate(${(1 - markP) * -40}deg)`,
            }}
          >
            <Img src={staticFile(S.logoMark)} style={{ width: markW, height: markW * MARK_RATIO }} />
          </div>
        </div>

        <div
          style={{
            fontWeight: 900,
            fontSize: 92,
            letterSpacing: -2.5,
            color: C.text,
            marginTop: 44,
            opacity: name,
            transform: `translateY(${(1 - name) * 30}px)`,
          }}
        >
          {S.name}
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 52,
            marginTop: 14,
            ...gradientText,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 24}px)`,
          }}
        >
          {S.tagline}
        </div>

        <div style={{ flex: 1 }} />

        {/* bottom: LinkedIn + source */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            padding: "18px 30px",
            borderRadius: 999,
            background: C.surface,
            border: `2px solid ${C.line}`,
            fontWeight: 700,
            fontSize: 40,
            color: C.text,
            opacity: link,
            transform: `translateY(${(1 - link) * 30}px)`,
          }}
        >
          <LinkedInIcon size={48} />
          {S.linkedin}
        </div>
        <div style={{ fontWeight: 500, fontSize: 26, color: C.muted, marginTop: 26, opacity: src }}>
          {S.source}
        </div>
      </div>
    </AbsoluteFill>
  );
};
