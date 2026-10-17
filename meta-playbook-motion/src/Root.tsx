import React from "react";
import { Composition } from "remotion";
import { LAYOUTS } from "./layout";
import { Main, MainProps } from "./Main";
import { DEBUG_SAFE_ZONE, FPS, TOTAL_FRAMES } from "./timeline";

const Reels: React.FC<MainProps> = (p) => <Main {...p} layout={LAYOUTS["9x16"]} />;
const Feed: React.FC<MainProps> = (p) => <Main {...p} layout={LAYOUTS["4x5"]} />;

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="MetaPlaybook9x16"
      component={Reels}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={LAYOUTS["9x16"].width}
      height={LAYOUTS["9x16"].height}
      defaultProps={{ showSafeZone: DEBUG_SAFE_ZONE }}
    />
    <Composition
      id="MetaPlaybook4x5"
      component={Feed}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={LAYOUTS["4x5"].width}
      height={LAYOUTS["4x5"].height}
      defaultProps={{ showSafeZone: DEBUG_SAFE_ZONE }}
    />
  </>
);
