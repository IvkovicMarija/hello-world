import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile } from "remotion";
import { Background, SafeZoneOverlay } from "./components";
import { Layout, LayoutProvider } from "./layout";
import { EndCard } from "./scenes/EndCard";
import { Hook } from "./scenes/Hook";
import { Idea } from "./scenes/Idea";
import { Problem } from "./scenes/Problem";
import { Stat1 } from "./scenes/Stat1";
import { Stat2 } from "./scenes/Stat2";
import { Stat3 } from "./scenes/Stat3";
import { Takeaway } from "./scenes/Takeaway";
import { AUDIO_TRACK, AUDIO_VOLUME, SCENES, SceneKey, sec } from "./timeline";

const COMPONENTS: Record<SceneKey, React.FC> = {
  hook: Hook,
  problem: Problem,
  idea: Idea,
  stat1: Stat1,
  stat2: Stat2,
  stat3: Stat3,
  takeaway: Takeaway,
  endCard: EndCard,
};

export type MainProps = { showSafeZone: boolean };

export const Main: React.FC<MainProps & { layout: Layout }> = ({ layout, showSafeZone }) => (
  <LayoutProvider layout={layout}>
    <AbsoluteFill>
      <Background />
      {(Object.keys(SCENES) as SceneKey[]).map((key) => {
        const Scene = COMPONENTS[key];
        const { start, end } = SCENES[key];
        return (
          <Sequence key={key} name={key} from={sec(start)} durationInFrames={sec(end) - sec(start)}>
            <Scene />
          </Sequence>
        );
      })}
      {AUDIO_TRACK ? <Html5Audio src={staticFile(AUDIO_TRACK)} volume={AUDIO_VOLUME} /> : null}
      {showSafeZone ? <SafeZoneOverlay /> : null}
    </AbsoluteFill>
  </LayoutProvider>
);
