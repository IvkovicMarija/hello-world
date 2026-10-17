# Meta playbook — 25s motion graphic

A 25-second motion-graphics explainer of Meta's *Creative on Meta* playbook (creative diversification), built with Remotion (React + TypeScript). It has no footage and no AI video: everything is type, shapes, icons and charts.

| Output | Size |
|---|---|
| `out/meta-playbook-25s.mp4` | 9:16, 1080×1920, 30 fps, 25.0 s |
| `out/meta-playbook-25s_4x5.mp4` | 4:5, 1080×1350, 30 fps, 25.0 s (re-laid out, not cropped) |
| `out/thumbnail.png` | 4:5 thumbnail / static image ad (Stat 2 frame) |
| `out/stills/*.png` | one 9:16 still per scene |

## Edit text and timing: `src/timeline.ts`

All copy and scene timing live in `SCENES`:

```ts
stat1: { start: 10, end: 14, setup: "...", value: 34.5, decimals: 1, caption: "..." },
```

- **Retime:** change `start` / `end` (in seconds). Scenes don't push each other along, so keep them back to back. The last `end` must equal `TOTAL_SECONDS`.
- **Change copy:** edit the strings. Keep each on-screen beat to about 8 words.
- **Animation beats inside a scene** (when a number starts counting, etc.) are constants at the top of each `src/scenes/*.tsx` file, such as `NUMBER_AT`. They're in seconds from the start of that scene.
- **Layout per format:** see `src/layout.tsx`. It holds the safe zones, the headline and visual zones, and the font sizes for 9:16 and 4:5.
- **Brand colours:** see `src/brand.ts`. Background `#0B0B0F`, accent `#2F6BFF`, lime `#C8FF3D` (numbers only).

## Add music

1. Put a royalty-free track in `public/`, e.g. `public/music.mp3`.
2. In `src/timeline.ts`, set `AUDIO_TRACK = "music.mp3"`. You can also adjust `AUDIO_VOLUME`.
3. Re-render. With `AUDIO_TRACK = null`, the video renders silent.

## Re-render

```bash
npm install
# If Remotion can't download its own headless Chrome (offline/sandboxed), point it at a local one:
# export REMOTION_BROWSER=/path/to/chrome-headless-shell
npx remotion render MetaPlaybook9x16 out/meta-playbook-25s.mp4
npx remotion render MetaPlaybook4x5  out/meta-playbook-25s_4x5.mp4

# Stills (one per scene) and the thumbnail
node scripts/stills.mjs --out=out/stills
node scripts/stills.mjs --comp=MetaPlaybook4x5 --out=out --frames=525   # writes out/4x5_f525.png → rename to thumbnail.png

# Check duration
ffprobe -v error -show_entries format=duration -of csv=p=0 out/meta-playbook-25s.mp4
```

Preview and scrub in the browser with `npm run dev` (Remotion Studio).

**Safe-zone debug overlay:** add `--props='{"showSafeZone":true}'` to any render or still command, or set `DEBUG_SAFE_ZONE = true` in `timeline.ts`. Red marks the Reels UI areas (top 14%, bottom 35%, right 6%). Yellow and cyan outline the headline and visual zones. Keep it off for final renders.

## Fonts

The project uses Inter (SIL Open Font License), bundled in `public/fonts/` and loaded with `@remotion/fonts`, so renders don't need the network. `@remotion/google-fonts` couldn't reach Google from the render environment, which is why Inter is bundled instead.

## Source

All stats are from *Creative on Meta* (Meta Creative Shop): 34.5% (p.14), 9.1% (p.10), 7% (p.11).
