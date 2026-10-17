import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { ease, pop } from "../anim";
import { C, FONT, gradientText } from "../brand";
import { useLayout } from "../layout";
import { SCENES } from "../timeline";

const S = SCENES.endCard;
const MARK_RATIO = 866 / 862; // h / w of advantage-mark.png
const WORD_RATIO = 146 / 1224; // h / w of advantage-wordmark.png

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const mark = pop(frame, 0, 16);
  const word = pop(frame, 0.2, 16);
  const breathe = 1 + ease(frame, 0, 2, 0, 0.04);
  const tag = pop(frame, 0.4);
  const url = pop(frame, 0.55);
  const src = ease(frame, 0.7, 1.1);

  const markW = Math.min(L.safe.w * 0.36, L.safe.h * 0.3);
  const wordW = Math.min(L.safe.w * 0.78, 720);

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
        <Img
          src={staticFile(S.logoMark)}
          style={{
            width: markW,
            height: markW * MARK_RATIO,
            opacity: mark,
            transform: `scale(${(0.8 + 0.2 * mark) * breathe}) rotate(${(1 - mark) * -12}deg)`,
            filter: `blur(${(1 - mark) * 10}px)`,
          }}
        />
        <Img
          src={staticFile(S.logoWordmark)}
          style={{
            width: wordW,
            height: wordW * WORD_RATIO,
            marginTop: markW * 0.22,
            opacity: word,
            transform: `translateY(${(1 - word) * 30}px)`,
          }}
        />
        <div
          style={{
            fontWeight: 700,
            fontSize: 56,
            color: C.text,
            marginTop: 48,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 24}px)`,
          }}
        >
          {S.tagline}
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 48,
            ...gradientText,
            marginTop: 22,
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
