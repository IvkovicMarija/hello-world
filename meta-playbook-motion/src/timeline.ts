// Single source of truth for timing and copy. Retime a scene by editing its
// `start`/`end` (seconds); later scenes do not shift automatically, so keep
// them contiguous and keep the last `end` equal to TOTAL_SECONDS.

export const FPS = 30;
export const TOTAL_SECONDS = 25;

// Royalty-free track placed in public/, e.g. "music.mp3". null = render silent.
export const AUDIO_TRACK: string | null = null;
export const AUDIO_VOLUME = 0.8;

// Draws the Reels/Feed safe zone on top of the video. Keep false for final renders
// (it can also be switched per render with --props='{"showSafeZone":true}').
export const DEBUG_SAFE_ZONE = false;

export const SCENES = {
  hook: {
    start: 0,
    end: 2,
    line1: ["Your", "ads", "aren't", "failing."],
    line2: ["Your", "ad", "set", "is."],
    shakeWord: "set",
  },
  problem: {
    start: 2,
    end: 6,
    line1: "One ad. One audience.",
    line2: "Same creative on repeat.",
  },
  idea: {
    start: 6,
    end: 10,
    kicker: "Meta's AI",
    line1: "Right ad. Right person.",
    line2: "Feed it variety.",
    cards: ["VIDEO", "IMAGE", "UGC", "CREATOR", "VIDEO", "IMAGE", "UGC", "CREATOR"],
  },
  stat1: {
    start: 10,
    end: 14,
    setup: "9:16 video + audio + safe zone",
    chips: ["9:16", "Audio", "Safe zone"],
    value: 34.5,
    decimals: 1,
    caption: "lower CPA than image ads in Reels",
  },
  stat2: {
    start: 14,
    end: 18,
    setup: "Image + 4:5 video + 9:16 video with audio",
    tiles: ["Image", "4:5 video", "9:16 + audio"],
    value: 9.1,
    decimals: 1,
    caption: "lower CPA with all three",
  },
  stat3: {
    start: 18,
    end: 21,
    setup: "≥20% of the ad set: 9:16 video + audio",
    markPercent: 20,
    value: 7,
    decimals: 0,
    caption: "lower cost per action",
  },
  takeaway: {
    start: 21,
    end: 23,
    line1Pre: "Stop making",
    line1Struck: "single ads.",
    line2Pre: "Build a creative",
    tileWord: "system.",
  },
  endCard: {
    start: 23,
    end: 25,
    // Logo files live in public/brand/ (Advantage brand kit).
    logoMark: "brand/advantage-mark.png",
    logoWordmark: "brand/advantage-wordmark.png",
    tagline: "Meta creative that converts",
    url: "hunchads.com",
    source: "Source: Meta Creative Shop, Creative on Meta playbook",
  },
} as const;

export type SceneKey = keyof typeof SCENES;

export const sec = (s: number) => Math.round(s * FPS);
export const TOTAL_FRAMES = sec(TOTAL_SECONDS);
