import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { drift, ease, easeInOut, mix, mixColor, pop } from "../anim";
import { C, FONT, gradientAt } from "../brand";
import { AdCard, Caption, CountUp, PersonIcon, Words } from "../components";
import { rectStyle, useLayout } from "../layout";
import { SCENES } from "./timeline";
import { AdPool, BigCount, CheckIcon, GpuIcon, Kicker, poolGeometry } from "./parts";

// headline that swaps from one beat to the next in place
const Swap: React.FC<{ a: React.ReactNode; b?: React.ReactNode; at?: number }> = ({ a, b, at = 99 }) => {
  const frame = useCurrentFrame();
  const s = ease(frame, at - 0.15, at + 0.15);
  return (
    <div style={{ position: "relative", flex: 1 }}>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", opacity: 1 - s, transform: `translateY(${-30 * s}px)` }}>
        {a}
      </div>
      {b ? <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", opacity: s }}>{b}</div> : null}
    </div>
  );
};

const TextZone: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const L = useLayout();
  return <div style={{ ...rectStyle(L.text), display: "flex", flexDirection: "column", justifyContent: "center" }}>{children}</div>;
};

// ---------------------------------------------------------------- 1. hook
export const AHook: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const S = SCENES.hook;
  const size = Math.round(L.head * 1.22);
  return (
    <AbsoluteFill>
      <div
        style={{
          ...rectStyle(L.safe),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: size * 0.3,
          transform: `translateY(${drift(frame, 4, 2)}px)`,
        }}
      >
        <Words
          words={S.line1.map((t) => ({ t, color: t === "rebuilt" ? C.teal : C.text }))}
          at={-0.1}
          stagger={0.12}
          size={size}
          slam
        />
        <Words
          words={S.line2.map((t, i) => ({ t, color: t === "picked." ? C.pink : i >= 2 ? gradientAt(0.4 + i * 0.1) : C.text }))}
          at={0.55}
          stagger={0.11}
          size={size}
          slam
        />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 2. what is Andromeda
const PICKED = [3, 10, 20, 27, 33, 44];

export const AWhatIs: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const S = SCENES.whatIs;
  const g = poolGeometry(L);
  const pick = ease(frame, 1.0, 1.6);
  return (
    <AbsoluteFill>
      <TextZone>
        <Kicker text={S.kicker} />
        <Swap
          at={1.9}
          a={<Words words={S.line1.split(" ")} at={0.1} stagger={0.1} size={L.head} />}
          b={
            <Words
              words={S.line2.split(" ").map((t) => ({ t, color: t === "shot." ? C.teal : C.text }))}
              at={1.9}
              stagger={0.08}
              size={L.head}
            />
          }
        />
      </TextZone>

      <AdPool
        L={L}
        style={(i, col, row) => {
          const p = pop(frame, (col + row) * 0.03);
          const chosen = PICKED.includes(i % g.count);
          return {
            fill: chosen ? mixColor(C.grey, gradientAt(PICKED.indexOf(i) / 5), pick) : C.grey,
            opacity: p * (chosen ? 1 : 1 - 0.45 * pick),
            scale: (0.5 + 0.5 * p) * (chosen ? 1 + 0.12 * pick : 1),
            glow: chosen && pick > 0.5 ? gradientAt(PICKED.indexOf(i) / 5) : undefined,
          };
        }}
      />

      {/* pipeline: retrieval (Andromeda) -> ranking -> auction */}
      <div style={{ ...rectStyle(g.side), display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
        {S.stages.map((stage, i) => {
          const p = pop(frame, 0.5 + i * 0.18);
          const first = i === 0;
          return (
            <React.Fragment key={stage}>
              {i > 0 ? (
                <div style={{ alignSelf: "center", width: 4, height: 22, borderRadius: 2, background: C.line, opacity: p }} />
              ) : null}
              <div
                style={{
                  padding: "20px 22px",
                  borderRadius: 20,
                  background: first ? C.accent : C.surface,
                  border: `3px solid ${first ? C.accentSoft : C.line}`,
                  boxShadow: first ? `0 0 ${30 + 12 * Math.sin(frame / 5)}px ${C.accent}aa` : undefined,
                  fontFamily: FONT,
                  color: C.text,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 60}px)`,
                }}
              >
                <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: 2, opacity: 0.75 }}>STEP {i + 1}</div>
                <div style={{ fontSize: Math.min(42, g.side.w / 7), fontWeight: 800 }}>{stage}</div>
                {first ? <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4, color: C.text }}>= Andromeda</div> : null}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 3. before
// A lighter model scans the pool: scores come out fuzzy (uneven, low-confidence greys).
const fuzz = (i: number) => (Math.sin(i * 12.9898) * 43758.5453) % 1;

export const ABefore: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const S = SCENES.before;
  const g = poolGeometry(L);
  const scanEnd = 0.4 + g.cols * 0.14;
  return (
    <AbsoluteFill>
      <TextZone>
        <Kicker text={S.kicker} color={C.muted} />
        <Swap a={<Words words={S.line1.split(" ")} at={0.1} stagger={0.08} size={L.head} />} />
      </TextZone>

      <AdPool
        L={L}
        style={(i, col) => {
          const seen = ease(frame, 0.4 + col * 0.14, 0.6 + col * 0.14);
          const f = Math.abs(fuzz(i));
          return {
            fill: mixColor(C.surface, mixColor(C.grey, C.accentSoft, f * 0.5), seen),
            opacity: 1 - seen * (0.15 + 0.45 * (1 - f)) + 0.08 * Math.sin(frame / 3 + i) * seen,
            scale: 1 - 0.08 * seen * (1 - f),
          };
        }}
      />
      {/* a soft, low-resolution scan line: the simpler first-pass model */}
      <div
        style={{
          position: "absolute",
          left: g.area.x + ease(frame, 0.4, scanEnd, 0, g.area.w),
          top: g.area.y,
          width: 40,
          height: g.area.h,
          background: `linear-gradient(90deg, transparent, ${C.muted}55, transparent)`,
          opacity: frame / 30 < scanEnd ? 1 : 0,
        }}
      />
      <div
        style={{
          ...rectStyle(g.side),
          display: "flex",
          alignItems: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: Math.min(46, g.side.w / 6.5),
          lineHeight: 1.15,
          color: C.muted,
          opacity: pop(frame, 1.6),
          transform: `translateY(${drift(frame, 4, 2)}px)`,
        }}
      >
        {S.note}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 4. now
const NOW_NUMBER_AT = 1.6;

export const ANow: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const S = SCENES.now;
  const g = poolGeometry(L);
  const gpu = 0.5 + 0.5 * Math.sin(frame / 4);
  return (
    <AbsoluteFill>
      <TextZone>
        <Kicker text={S.kicker} color={C.teal} />
        <Swap
          at={NOW_NUMBER_AT}
          a={<Words words={S.line1.split(" ")} at={0.05} stagger={0.08} size={L.head} />}
          b={
            <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
              <BigCount value={S.value} suffix={S.suffix} at={NOW_NUMBER_AT} dur={1.3} size={L.big * 0.62} maxW={L.text.w} />
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: L.caption, color: C.text, opacity: pop(frame, NOW_NUMBER_AT + 0.3) }}>
                {S.caption}
              </div>
            </div>
          }
        />
      </TextZone>

      {/* every ad lights up as the scan passes */}
      <AdPool
        L={L}
        style={(i, col) => {
          const lit = ease(frame, 0.2 + col * 0.12, 0.5 + col * 0.12);
          return {
            fill: mixColor(C.grey, gradientAt(col / (g.cols - 1)), lit),
            opacity: 0.45 + 0.55 * lit,
            scale: 1 + 0.08 * Math.sin(frame / 5 + i) * lit,
          };
        }}
      />
      <div
        style={{
          position: "absolute",
          left: poolGeometry(L).area.x + ease(frame, 0.2, 0.2 + g.cols * 0.12, 0, g.area.w),
          top: g.area.y,
          width: 6,
          height: g.area.h,
          background: C.text,
          boxShadow: `0 0 30px ${C.teal}`,
          opacity: frame / 30 < 0.2 + g.cols * 0.12 ? 0.9 : 0,
        }}
      />
      <div style={{ ...rectStyle(g.side), display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `scale(${pop(frame, 0.1) * (1 + 0.04 * gpu)})` }}>
          <GpuIcon size={Math.min(g.side.w, 260)} glow={gpu} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 5. matches
const LINKED = [0, 9, 13, 18, 22, 26, 31, 36, 41, 47];
const MATCH_NUMBER_AT = 1.9;

export const AMatches: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const S = SCENES.matches;
  const g = poolGeometry(L);
  const px = g.side.x + g.side.w / 2;
  const py = g.side.y + g.side.h / 2;
  const ps = Math.min(g.side.w * 0.8, 180);
  const words = S.line1.split(" ");
  return (
    <AbsoluteFill>
      <TextZone>
        <Swap
          at={MATCH_NUMBER_AT}
          a={
            <Words
              words={words.map((t, i) => ({ t, color: i >= 4 ? (t === "matches." ? C.pink : C.accentSoft) : C.text }))}
              at={0}
              stagger={0.2}
              size={L.head}
            />
          }
          b={
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <CountUp value={S.value} decimals={S.decimals} at={MATCH_NUMBER_AT} dur={1.0} size={L.big} />
              <Caption text={S.caption} at={MATCH_NUMBER_AT + 0.3} size={L.caption} />
            </div>
          }
        />
      </TextZone>

      <AdPool
        L={L}
        style={(i, col) => {
          const linked = LINKED.includes(i);
          return {
            fill: gradientAt(col / (g.cols - 1)),
            opacity: linked ? 1 : 0.35,
            scale: linked ? 1 + 0.06 * Math.sin(frame / 4 + i) : 1,
          };
        }}
      />
      <svg style={{ position: "absolute", left: 0, top: 0, width: L.width, height: L.height }}>
        {LINKED.filter((i) => i < g.count).map((i, k) => {
          const c = g.cell(i);
          const x1 = c.x + g.cw / 2;
          const y1 = c.y + g.ch / 2;
          const len = Math.hypot(px - x1, py - y1) + 50;
          const p = ease(frame, 0.6 + k * 0.08, 1.2 + k * 0.08);
          return (
            <path
              key={i}
              d={`M${x1},${y1} C${(x1 + px) / 2},${y1} ${(x1 + px) / 2},${py} ${px - ps / 2},${py}`}
              stroke={gradientAt(c.col / (g.cols - 1))}
              strokeWidth={3.5}
              fill="none"
              strokeDasharray={len}
              strokeDashoffset={len * (1 - p)}
              opacity={0.85}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          left: px - ps / 2,
          top: py - ps / 2 + drift(frame, 4, 2),
          width: ps,
          height: ps,
          borderRadius: 999,
          background: mixColor(C.surface, C.accent, ease(frame, 1.2, 1.8)),
          boxShadow: `0 0 ${50 * ease(frame, 1.2, 1.8)}px ${C.accent}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${pop(frame, 0.3)})`,
        }}
      >
        <PersonIcon size={ps * 0.6} color={C.text} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 6. creative = targeting
const KINDS = ["VIDEO", "IMAGE", "UGC", "CREATOR"];
const KIND_FILL = [C.accent, C.teal, C.purple, C.pink];
const KIND_INK = [C.text, C.bg, C.text, C.text];

export const ACreative: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const S = SCENES.creative;
  const v = L.visual;
  const cx = v.x + v.w / 2;
  const cy = v.y + v.h / 2;
  const r = Math.min(v.h * 0.36, 200);
  const split = ease(frame, 1.3, 1.9, 0, 1, easeInOut);
  const cw = Math.min((v.w - 3 * 24) / 4, 200);
  const ch = cw * 1.3;
  return (
    <AbsoluteFill>
      <TextZone>
        <Kicker text={S.kicker} />
        <Swap
          a={
            <Words
              words={S.line1.split(" ").map((t) => ({ t, color: t === "creative" ? C.teal : t === "targeting." ? C.pink : C.text }))}
              at={0.1}
              stagger={0.09}
              size={L.head}
            />
          }
        />
      </TextZone>

      {/* crosshair: the old idea of "targeting" */}
      <svg
        width={r * 2 + 40}
        height={r * 2 + 40}
        style={{
          position: "absolute",
          left: cx - r - 20,
          top: cy - r - 20,
          opacity: pop(frame, 0) * (1 - split),
          transform: `rotate(${frame * 2}deg) scale(${1 - 0.6 * split})`,
        }}
      >
        <circle cx={r + 20} cy={r + 20} r={r} stroke={C.muted} strokeWidth={6} fill="none" />
        <circle cx={r + 20} cy={r + 20} r={r * 0.5} stroke={C.muted} strokeWidth={5} fill="none" />
        {[0, 90, 180, 270].map((a) => (
          <line
            key={a}
            x1={r + 20 + Math.cos((a * Math.PI) / 180) * r * 0.65}
            y1={r + 20 + Math.sin((a * Math.PI) / 180) * r * 0.65}
            x2={r + 20 + Math.cos((a * Math.PI) / 180) * (r + 18)}
            y2={r + 20 + Math.sin((a * Math.PI) / 180) * (r + 18)}
            stroke={C.muted}
            strokeWidth={6}
            strokeLinecap="round"
          />
        ))}
      </svg>

      {/* ...splits into creatives */}
      {KINDS.map((k, i) => {
        const p = pop(frame, 1.45 + i * 0.07, 13);
        const tx = v.x + (v.w - (4 * cw + 3 * 24)) / 2 + i * (cw + 24);
        const x = mix(cx - cw / 2, tx, p);
        const y = cy - ch / 2 + drift(frame, 5, 2, i) * p;
        return (
          <AdCard
            key={k}
            w={cw}
            h={ch}
            kind={k}
            label
            fill={KIND_FILL[i]}
            ink={KIND_INK[i]}
            style={{ left: x, top: y, opacity: Math.min(1, p * 2), transform: `rotate(${(1 - p) * (i - 1.5) * 25}deg) scale(${0.3 + 0.7 * p})` }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 7. variety
export const AVariety: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const S = SCENES.variety;
  const v = L.visual;
  const rowH = v.h / 2;
  const cw = Math.min(rowH * 0.5, 110);
  const ch = cw * 1.25;
  const ps = Math.min(cw * 0.75, 76);
  const merge = ease(frame, 0.7, 1.2, 0, 1, easeInOut);
  const lines = ease(frame, 1.1, 1.7);
  const personX = v.x + v.w - ps - 4;

  const row = (r: number) => {
    const top = v.y + r * rowH;
    const cardsY = top + 50 + (rowH - 50 - ch) / 2;
    const look = r === 0;
    const p = pop(frame, 0.15 + r * 0.2);
    return (
      <React.Fragment key={r}>
        <div style={{ position: "absolute", left: v.x, top, fontFamily: FONT, fontWeight: 800, fontSize: 36, color: look ? C.muted : C.text, opacity: p }}>
          {S.rows[r]}
        </div>
        {[0, 1, 2].map((i) => {
          const baseX = v.x + i * (cw + 18);
          const x = look ? mix(baseX, v.x + 18, merge) : baseX;
          const fill = look ? C.accent : KIND_FILL[i + 1];
          return (
            <AdCard
              key={i}
              w={cw}
              h={ch}
              kind={look ? "VIDEO" : KINDS[i + 1]}
              fill={look ? mixColor(fill, C.grey, merge * 0.6) : fill}
              ink={look ? C.text : KIND_INK[i + 1]}
              style={{
                left: x + (look ? i * 8 * merge : 0),
                top: cardsY + (look ? -i * 8 * merge : drift(frame, 3, 1.8, i)),
                opacity: p,
                zIndex: 3 - i,
              }}
            />
          );
        })}
        {/* connections to people */}
        <svg style={{ position: "absolute", left: 0, top: 0, width: L.width, height: L.height, opacity: p }}>
          {(look ? [1] : [0, 1, 2]).map((j) => {
            const x1 = look ? v.x + 18 + cw + 16 : v.x + j * (cw + 18) + cw;
            const y1 = cardsY + ch / 2;
            const yP = top + 50 + (rowH - 50) * ((j + 0.5) / 3);
            const len = Math.hypot(personX - x1, yP - y1) + 40;
            return (
              <path
                key={j}
                d={`M${x1},${y1} C${(x1 + personX) / 2},${y1} ${(x1 + personX) / 2},${yP} ${personX - 6},${yP}`}
                stroke={look ? C.muted : gradientAt(j / 2)}
                strokeWidth={4}
                fill="none"
                strokeDasharray={len}
                strokeDashoffset={len * (1 - lines)}
              />
            );
          })}
        </svg>
        {[0, 1, 2].map((j) => {
          const yP = top + 50 + (rowH - 50) * ((j + 0.5) / 3);
          const on = look ? (j === 1 ? lines : 0) : lines;
          return (
            <div
              key={j}
              style={{
                position: "absolute",
                left: personX,
                top: yP - ps / 2,
                width: ps,
                height: ps,
                borderRadius: 999,
                background: mixColor(C.surface, look ? C.grey : gradientAt(j / 2), on),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: p * (0.5 + 0.5 * on),
              }}
            >
              <PersonIcon size={ps * 0.6} color={C.text} />
            </div>
          );
        })}
      </React.Fragment>
    );
  };

  return (
    <AbsoluteFill>
      <TextZone>
        <Swap
          a={
            <Words
              words={S.line1.split(" ").map((t) => ({ t, color: t === "Different" ? C.teal : t === "doors." ? C.pink : C.text }))}
              at={0}
              stagger={0.08}
              size={L.head}
            />
          }
        />
      </TextZone>
      {row(0)}
      {row(1)}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- 8. checklist
export const AChecklist: React.FC = () => {
  const frame = useCurrentFrame();
  const L = useLayout();
  const S = SCENES.checklist;
  const v = L.visual;
  return (
    <AbsoluteFill>
      <TextZone>
        <Swap a={<Words words={[{ t: "Your", color: C.text }, { t: "move:", color: C.teal }]} at={0} stagger={0.1} size={Math.round(L.head * 1.2)} />} />
      </TextZone>
      <div style={{ ...rectStyle(v), display: "flex", flexDirection: "column", justifyContent: "center", gap: 26 }}>
        {S.items.map((item, i) => {
          const p = pop(frame, 0.3 + i * 0.3);
          const lit = 0.5 + 0.5 * Math.max(0, Math.sin((frame / 30 - 1.3 - i * 0.3) * Math.PI));
          return (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
                padding: "24px 28px",
                borderRadius: 24,
                background: mixColor(C.surface, C.line, lit * 0.6),
                border: `3px solid ${mixColor(C.line, gradientAt(i / 2), p)}`,
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: Math.min(46, v.w / 17),
                color: C.text,
                opacity: p,
                transform: `translateX(${(1 - p) * 80}px)`,
              }}
            >
              <CheckIcon size={56} color={gradientAt(i / 2)} />
              {item}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
