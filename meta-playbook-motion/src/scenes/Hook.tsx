import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { drift } from "../anim";
import { C } from "../brand";
import { Words } from "../components";
import { useLayout } from "../layout";
import { FPS, SCENES } from "../timeline";

const S = SCENES.hook;
const STAGGER = 0.12;
const LINE2_AT = 0.62;

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const size = Math.round(L.head * 1.22);

  const shakeIdx = S.line2.indexOf(S.shakeWord);
  const shakeAt = (LINE2_AT + shakeIdx * STAGGER) * FPS + 4;
  const t = frame - shakeAt;
  const shake = t >= 0 ? Math.exp(-t / 5) * 22 : 0;
  const sx = shake * Math.sin(t * 2.4);
  const sy = shake * Math.cos(t * 3.1) * 0.6;

  return (
    <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
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
          gap: size * 0.35,
          transform: `translateY(${drift(frame, 4, 2)}px)`,
        }}
      >
        <Words words={[...S.line1]} at={-0.1} stagger={STAGGER} size={size} slam />
        <Words
          words={S.line2.map((w) => ({ t: w, color: w === "ad" || w === "set" || w === "is." ? C.accent : C.text }))}
          at={LINE2_AT}
          stagger={STAGGER}
          size={size}
          slam
        />
      </div>
    </AbsoluteFill>
  );
};
