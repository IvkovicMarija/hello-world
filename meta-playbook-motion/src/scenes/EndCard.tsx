import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ease, pop } from "../anim";
import { C, FONT } from "../brand";
import { useLayout } from "../layout";
import { SCENES } from "../timeline";

const S = SCENES.endCard;

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const mark = pop(frame, 0, 16);
  const breathe = 1 + ease(frame, 0, 2, 0, 0.04);
  const tag = pop(frame, 0.3);
  const url = pop(frame, 0.5);
  const src = ease(frame, 0.7, 1.1);

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
          justifyContent: "center",
          textAlign: "center",
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 210,
            letterSpacing: -9,
            color: C.text,
            opacity: mark,
            transform: `scale(${(0.9 + 0.1 * mark) * breathe})`,
            filter: `blur(${(1 - mark) * 12}px)`,
          }}
        >
          {S.wordmark}
          <span style={{ color: C.accent }}>.</span>
        </div>
        <div
          style={{
            fontWeight: 700,
            fontSize: 58,
            color: C.text,
            marginTop: 10,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 24}px)`,
          }}
        >
          {S.tagline}
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 50,
            color: C.accent,
            marginTop: 34,
            opacity: url,
            transform: `translateY(${(1 - url) * 24}px)`,
          }}
        >
          {S.url}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            fontWeight: 500,
            fontSize: 26,
            color: C.muted,
            opacity: src,
          }}
        >
          {S.source}
        </div>
      </div>
    </AbsoluteFill>
  );
};
