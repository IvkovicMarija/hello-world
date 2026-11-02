import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile } from "remotion";
import { Background, SafeZoneOverlay } from "../components";
import { Layout, LayoutProvider } from "../layout";
import { EndCard } from "../scenes/EndCard";
import { ABefore, AChecklist, ACreative, AHook, AMatches, ANow, AVariety, AWhatIs } from "./scenes";
import { AUDIO_TRACK, AUDIO_VOLUME, SCENES, SceneKey, sec } from "./timeline";

const COMPONENTS: Record<SceneKey, React.FC> = {
  hook: AHook,
  whatIs: AWhatIs,
  before: ABefore,
  now: ANow,
  matches: AMatches,
  creative: ACreative,
  variety: AVariety,
  checklist: AChecklist,
  endCard: () => <EndCard source={SCENES.endCard.source} />,
};

export const AndromedaMain: React.FC<{ layout: Layout; showSafeZone: boolean }> = ({ layout, showSafeZone }) => (
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
