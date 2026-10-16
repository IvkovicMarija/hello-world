# Reels video: "The 3-asset ad set"

**Target generator:** Google **Veo 3 / 3.1** (native audio and lip-synced dialogue; clips of 4, 6 or 8 s). The video is 25 s, which is longer than one clip, so there is **one prompt per shot**. Every prompt repeats the same character, wardrobe, set, lighting and camera blocks.
**Format:** 9:16 vertical, 1080×1920, 25.0 s, made for sound-on and burned-in captions so it also works muted.
**Language:** English. **Voice:** sharp, confident, martech expert, no fluff. The presenter is Marija.
**Stats used:** 2 (see `extract.md`, p.10 and p.11).

---

## 1. Concept

**One line:** Marija tells you, like a friend would, to stop launching one-ad ad sets. She shows Meta's 3-format mix (image + 4:5 video + 9:16 video with audio) and the two CPA stats behind it.

**Motivator:** *"Show me proof. I only change what the data backs."* (evidence / expert-backed; playbook p.22–23)
**Hook style:** "a text from a friend" (p.33), a short, blunt telling-off rather than a slogan.

---

## 2. Storyboard

Canvas is 1080×1920. **Text safe zone: x 64–920 px, y 270–1248 px.** That keeps text out of the top 14%, the bottom 35% and the right-edge UI rail. Captions go at y 1060–1240. Headline cards go at y 300–760.

| # | Timecode | Visual | Camera / motion | On-screen text (edit) | VO / dialogue | SFX / music |
|---|---|---|---|---|---|---|
| 1 | **0.0–2.0** | **HOOK.** Close-up of Marija looking straight into the lens with a "seriously?" look. She holds up one finger, then pushes a flat "stop" palm at the lens until it **covers the frame**. | Locked-off close-up with a fast 5% push-in. The palm wipes the lens at 1.8 s. | `One ad. One format? 🛑` (frame 1, pops on the beat) | "One ad. One format? Stop." | Music starts on frame 1 with a hard kick on the first word. A whoosh on the palm. |
| 2 | **2.0–4.0** | **MATCH CUT** on the palm: it pulls back from the lens to show Marija in a medium shot, walking toward camera in the studio. | Handheld-steady walk-back dolly. | `Meta's AI needs options.` | "Meta's AI needs options." | Beat continues. A soft riser starts. |
| 3 | **4.0–8.0** | Medium-wide. Marija slaps three **blank signal-orange cards** onto the off-white wall, one per beat: a square, a portrait 4:5, and a tall 9:16. | Slow lateral truck left to right. Each card lands on a beat (≈4.4 / 5.6 / 6.8 s). | One label pops on each card: `Image` · `4:5 video` · `9:16 + sound 🔊` | "Give it three: image, feed video, vertical with sound." | Three "paper slap" hits synced to the beat. |
| 4 | **8.0–11.0** | Close-up. Marija turns from the wall to the lens with a small knowing smile and one raised eyebrow. | Slow push-in, 35 mm to 50 mm feel. | Big number: `9.1% lower CPA` / small line: `ad sets with all three · Meta` | "That mix? Nine point one percent lower CPA." | Short tape-stop, then the beat comes back. |
| 5 | **11.0–14.0** | Over-the-shoulder insert. Marija's hand holds a phone vertically with a blurred, colourful vertical video on it. Her thumb presses the side volume button and her other hand brushes into frame. *(Human presence + audio cue.)* | Handheld macro with a small tilt down. A quick whip-pan out at the end. | `≥20% of ad set: 9:16 + audio` | "Then make at least twenty percent vertical, with audio." | A "volume-up" tick, three rising blips. |
| 6 | **14.0–17.0** | **WHIP-PAN IN** to a medium close-up. Marija snaps her fingers and gives a firm nod. | Whip-pan entry, then locked. | Big number: `7% lower cost per action` / small line: `Meta` | "Seven percent lower cost per action." | Finger snap on the beat, bass hit. |
| 7 | **17.0–21.0** | Wide. Marija steps back from a wall now covered in a **neat grid of many orange cards** in all three shapes. One card has become a system. | Slow dolly-out pull-back revealing the grid. | `Stop thinking in singles.` → (19.0 s) `Build a system.` | "Stop thinking in singles. Build a system." | Music opens up (full drop). |
| 8 | **21.0–25.0** | Medium close-up. Marija faces camera, warm and direct, and taps two fingers to her temple as in "remember this". **21.0–23.5:** talking. **23.5–25.0:** hard cut to the logo end card. | Locked-off. The end card is a static brand frame with a 6-frame scale-in. | `Save this for your next launch 📌` → End card: **MARIJA** wordmark + `@handle` | "Save this for your next launch." | Music resolves on a clean final hit at 24.5 s. |

**Runtime:** 25.0 s · **Shots:** 8 · Cut every 2–4 s · **Match cut:** palm-over-lens 1→2 · **Whip-pan:** 5→6 · **Human presence:** every shot except the end card.

---

## 3. Voiceover script (timed)

| Time | Line | Words |
|---|---|---|
| 0.0–2.0 | One ad. One format? Stop. | 5 |
| 2.0–4.0 | Meta's AI needs options. | 4 |
| 4.0–8.0 | Give it three: image, feed video, vertical with sound. | 9 |
| 8.0–11.0 | That mix? Nine point one percent lower CPA. | 8 |
| 11.0–14.0 | Then make at least twenty percent vertical, with audio. | 9 |
| 14.0–17.0 | Seven percent lower cost per action. | 6 |
| 17.0–21.0 | Stop thinking in singles. Build a system. | 7 |
| 21.0–23.5 | Save this for your next launch. | 6 |
| **Total** | | **54 words / 25 s ≈ 2.2 wps** ✅ (cap was ~65) |

Delivery: low, clear and a little dry, like an expert friend telling you off. Pause half a beat after each "?". Say "CPA" as letters: "C-P-A".

---

## 4. Veo 3 generator prompts

### Before you start
- **Use Marija's real face.** Text-to-video will make up a stranger. Generate each shot as **image-to-video** from a well-lit photo of Marija in the wardrobe below, or use Flow's "Ingredients to video" with that photo. Use the same reference image in every shot. Rewrite the CHARACTER block to match her actual look.
- Veo garbles text, so **no prompt asks for text, numbers, logos or UI**. All of those go in during the edit (section 5).
- Set the aspect ratio to **9:16** in the Veo UI/API. Use the shortest duration that covers each shot and trim in the edit. If your tier only offers 8 s, generate 8 s and trim.
- Spoken lines are in the shots where she talks to camera, so Veo can lip-sync them. Shots 3, 5 and 7 have ambient sound only, and the VO is laid over them.

### Shared blocks (already pasted into every prompt below)

> **CHARACTER:** Marija, a confident woman in her early 30s with straight shoulder-length dark brown hair parted in the centre, light olive skin, natural minimal makeup, small gold hoop earrings, wearing a tailored black blazer over a crisp white crew-neck t-shirt and slim black trousers. Sharp, warm, expert energy.
> **SET:** a minimalist creative studio with a matte warm off-white wall, a light-oak desk edge, and one green plant softly out of focus. Brand accent: signal-orange (#FF5A1F) paper cards are the only saturated colour.
> **LIGHT:** soft key light from camera-left through a large diffusion panel, gentle fill, subtle warm rim light from behind-right, daylight-balanced 5600K, natural skin tones.
> **LOOK:** modern premium social-ad look, shot on a cinema camera, 35 mm lens look, shallow depth of field around f/2.8, warm neutral grade with deep clean blacks, very light film grain. Composition leaves clear negative space in the upper-middle of frame. Subject kept centre-left, away from the right edge.
> **AVOID:** distorted or extra fingers, warped hands, morphing face, changing wardrobe, garbled or any visible text, letters, numbers, subtitles, captions, logos, watermarks, UI overlays, brand names, extra people, jump in lighting, oversaturated colours, cartoon look.

---

**Prompt — Shot 1 (Hook, 0.0–2.0 → generate 4 s)**
```
Vertical 9:16 video, 4 seconds. Close-up of Marija, a confident woman in her early 30s with straight shoulder-length dark brown hair parted in the centre, light olive skin, natural minimal makeup, small gold hoop earrings, wearing a tailored black blazer over a crisp white crew-neck t-shirt. She looks straight into the lens with a "seriously?" expression, speaking from the very first frame. She raises one index finger, then pushes a flat open palm straight toward the camera until her palm fully covers the lens at the end of the clip.
Setting: minimalist creative studio, matte warm off-white wall, one green plant softly out of focus.
Camera: locked-off close-up on a 35 mm lens look, fast subtle push-in, shallow depth of field around f/2.8, face framed centre-left with clear space above her head, nothing important near the right edge.
Lighting: soft key light from camera-left through large diffusion, gentle fill, subtle warm rim light, 5600K, natural skin tones.
Style: modern premium social-ad look, warm neutral grade, deep clean blacks, very light film grain.
Audio: she says, crisp and dry, half-amused: "One ad. One format? Stop." Quiet room tone, a soft whoosh as the palm reaches the lens. No music.
Avoid: distorted or extra fingers, warped hands, morphing face, any visible text, letters, numbers, subtitles, captions, logos, watermarks, UI overlays, extra people.
```

**Prompt — Shot 2 (Match-cut reveal, 2.0–4.0 → generate 4 s)**
```
Vertical 9:16 video, 4 seconds. The clip opens with an open palm completely covering the camera lens; the palm pulls away from the lens to reveal Marija in a medium shot, walking slowly toward camera with confident posture, and she speaks to the lens. Marija is a confident woman in her early 30s with straight shoulder-length dark brown hair parted in the centre, light olive skin, natural minimal makeup, small gold hoop earrings, wearing a tailored black blazer over a crisp white crew-neck t-shirt and slim black trousers.
Setting: minimalist creative studio, matte warm off-white wall, light-oak desk edge, one green plant softly out of focus.
Camera: handheld-steady backward dolly matching her walk, 35 mm lens look, shallow depth of field around f/2.8, subject centre-left, clear negative space in the upper-middle of frame, right edge kept clean.
Lighting: soft key light from camera-left through large diffusion, gentle fill, subtle warm rim light, 5600K, natural skin tones.
Style: modern premium social-ad look, warm neutral grade, deep clean blacks, very light film grain.
Audio: she says, matter-of-fact: "Meta's AI needs options." Soft footsteps, quiet room tone. No music.
Avoid: distorted or extra fingers, warped hands, morphing face, changing wardrobe, any visible text, letters, numbers, subtitles, captions, logos, watermarks, UI overlays, extra people.
```

**Prompt — Shot 3 (Three cards, 4.0–8.0 → generate 6 s)**
```
Vertical 9:16 video, 6 seconds. Medium-wide shot of Marija pressing three blank, solid signal-orange (#FF5A1F) matte paper cards onto a matte warm off-white wall, one after another at a steady rhythm about every 1.2 seconds: first a square card, then a portrait 4:5 card, then a tall narrow 9:16 card. The cards are completely blank, side by side at chest-to-eye height in the middle of the frame. Marija is a confident woman in her early 30s with straight shoulder-length dark brown hair parted in the centre, light olive skin, small gold hoop earrings, wearing a tailored black blazer over a crisp white crew-neck t-shirt and slim black trousers.
Setting: minimalist creative studio, matte warm off-white wall, one green plant softly out of focus at frame edge.
Camera: slow lateral truck from left to right, 35 mm lens look, depth of field around f/4 so cards and face are sharp, cards kept centre and centre-left, right edge clean.
Lighting: soft key light from camera-left through large diffusion, gentle fill, subtle warm rim light, 5600K.
Style: modern premium social-ad look, warm neutral grade, the orange cards are the only saturated colour, very light film grain.
Audio: a crisp paper slap each time a card hits the wall, quiet room tone. No dialogue, no music.
Avoid: any text, letters, numbers or icons on the cards or wall, distorted or extra fingers, warped hands, morphing face, changing wardrobe, subtitles, captions, logos, watermarks, extra people.
```

**Prompt — Shot 4 (Knowing look, 8.0–11.0 → generate 4 s)**
```
Vertical 9:16 video, 4 seconds. Close-up of Marija turning her head from a wall of blank orange paper cards toward the camera, landing on a small knowing smile with one eyebrow slightly raised, then speaking to the lens. Marija is a confident woman in her early 30s with straight shoulder-length dark brown hair parted in the centre, light olive skin, natural minimal makeup, small gold hoop earrings, wearing a tailored black blazer over a crisp white crew-neck t-shirt.
Setting: minimalist creative studio, matte warm off-white wall with blank signal-orange (#FF5A1F) paper cards softly out of focus behind her.
Camera: slow push-in from a 35 mm to 50 mm feel, shallow depth of field around f/2.8, face lower-centre-left of frame leaving clean negative space in the upper half of the frame, right edge clean.
Lighting: soft key light from camera-left through large diffusion, gentle fill, subtle warm rim light, 5600K, natural skin tones.
Style: modern premium social-ad look, warm neutral grade, deep clean blacks, very light film grain.
Audio: she says, quietly confident: "That mix? Nine point one percent lower C-P-A." Quiet room tone. No music.
Avoid: distorted face, morphing features, any visible text, letters, numbers, subtitles, captions, logos, watermarks, UI overlays, extra people.
```

**Prompt — Shot 5 (Phone + audio insert, 11.0–14.0 → generate 4 s)**
```
Vertical 9:16 video, 4 seconds. Over-the-shoulder close-up of Marija's hands holding a modern black smartphone upright in portrait orientation; the phone screen shows a softly blurred, colourful abstract vertical video with warm orange tones and no readable content. Her thumb presses the side volume-up button twice, then the camera does a fast whip-pan to the right at the very end. Marija is a woman with straight shoulder-length dark brown hair, small gold hoop earrings, a tailored black blazer sleeve and white t-shirt cuff visible, natural short neutral nails.
Setting: minimalist creative studio, matte warm off-white wall and light-oak desk softly out of focus.
Camera: handheld macro-style close-up, 50 mm lens look, shallow depth of field around f/2, slight tilt down, phone centred in frame, ending in a fast horizontal whip-pan with motion blur.
Lighting: soft key light from camera-left through large diffusion, gentle fill, subtle warm rim light, 5600K.
Style: modern premium social-ad look, warm neutral grade, deep clean blacks, very light film grain.
Audio: two soft clicks of a phone volume button, a muffled upbeat track getting louder from the phone speaker, a whoosh on the whip-pan. No dialogue.
Avoid: readable text, app interface, icons, numbers or logos on the phone screen, distorted or extra fingers, six fingers, warped hands, brand logos on the phone, subtitles, captions, watermarks, extra people.
```

**Prompt — Shot 6 (Snap + nod, 14.0–17.0 → generate 4 s)**
```
Vertical 9:16 video, 4 seconds. Opens on a fast horizontal whip-pan with motion blur that settles into a medium close-up of Marija facing the camera; she snaps her fingers once beside her face, gives one firm nod and speaks to the lens. Marija is a confident woman in her early 30s with straight shoulder-length dark brown hair parted in the centre, light olive skin, natural minimal makeup, small gold hoop earrings, wearing a tailored black blazer over a crisp white crew-neck t-shirt.
Setting: minimalist creative studio, matte warm off-white wall, blank signal-orange (#FF5A1F) paper cards softly out of focus behind her.
Camera: whip-pan entry then locked-off, 35 mm lens look, shallow depth of field around f/2.8, face lower-centre-left leaving clean negative space in the upper half, right edge clean.
Lighting: soft key light from camera-left through large diffusion, gentle fill, subtle warm rim light, 5600K, natural skin tones.
Style: modern premium social-ad look, warm neutral grade, deep clean blacks, very light film grain.
Audio: one crisp finger snap, then she says, firm and clear: "Seven percent lower cost per action." Quiet room tone. No music.
Avoid: distorted or extra fingers, warped hands, morphing face, any visible text, letters, numbers, subtitles, captions, logos, watermarks, extra people.
```

**Prompt — Shot 7 (The system, 17.0–21.0 → generate 4 s)**
```
Vertical 9:16 video, 4 seconds. Wide shot: Marija takes two calm steps backward away from a matte warm off-white wall that is now covered in a neat, orderly grid of many blank signal-orange (#FF5A1F) paper cards in three shapes — squares, portrait rectangles and tall narrow rectangles — arranged in tidy rows. She stops and looks at the grid with quiet satisfaction, then glances back over her shoulder toward the camera. Marija is a confident woman in her early 30s with straight shoulder-length dark brown hair parted in the centre, small gold hoop earrings, wearing a tailored black blazer over a crisp white crew-neck t-shirt and slim black trousers.
Setting: minimalist creative studio, light-oak floor, one green plant at frame edge.
Camera: slow smooth dolly-out pull-back revealing the full grid, 28 mm lens look, depth of field around f/5.6, grid filling the middle of the frame, subject centre-left, right edge clean.
Lighting: soft key light from camera-left through large diffusion, gentle fill, subtle warm rim light, 5600K.
Style: modern premium social-ad look, symmetrical and satisfying, warm neutral grade, the orange cards are the only saturated colour, very light film grain.
Audio: two soft footsteps, quiet room tone with a slight airy reverb. No dialogue, no music.
Avoid: any text, letters, numbers or icons on the cards or wall, messy or overlapping cards, distorted hands, morphing face, changing wardrobe, subtitles, captions, logos, watermarks, extra people.
```

**Prompt — Shot 8 (CTA, 21.0–23.5 → generate 4 s)**
```
Vertical 9:16 video, 4 seconds. Medium close-up of Marija facing the camera, warm and direct, with a small confident smile; while speaking she taps two fingers lightly against her temple in a "remember this" gesture, then lowers her hand and holds eye contact. Marija is a confident woman in her early 30s with straight shoulder-length dark brown hair parted in the centre, light olive skin, natural minimal makeup, small gold hoop earrings, wearing a tailored black blazer over a crisp white crew-neck t-shirt.
Setting: minimalist creative studio, matte warm off-white wall with a grid of blank signal-orange (#FF5A1F) paper cards softly out of focus behind her.
Camera: locked-off, 35 mm lens look, shallow depth of field around f/2.8, face lower-centre-left leaving clean negative space in the upper half, right edge clean.
Lighting: soft key light from camera-left through large diffusion, gentle fill, subtle warm rim light, 5600K, natural skin tones.
Style: modern premium social-ad look, warm neutral grade, deep clean blacks, very light film grain.
Audio: she says, warm and decisive: "Save this for your next launch." Quiet room tone. No music.
Avoid: distorted or extra fingers, warped hands, morphing face, any visible text, letters, numbers, subtitles, captions, logos, watermarks, UI overlays, extra people.
```

*(The end card at 23.5–25.0 is made in the edit, not in Veo.)*

---

## 5. Edit and assembly notes

**Timeline:** 1080×1920, 30 fps, 25.0 s. Trim each clip to its storyboard window. Use the strongest 2–3 s of each take.

**Music:** confident minimal electronic / tech-house, **122 BPM**. One beat is ≈0.49 s and one bar is ≈1.97 s, so cuts at 2.0 / 4.0 / 8.0 s land roughly on bar lines. Nudge them to the nearest downbeat. The track starts on **frame 1** (no fade-in), drops at 17.0 s and ends cleanly at 24.5 s. Duck it to about −14 dB under VO and dialogue, and bring it to full level on the end card. Use a licensed track (Meta Sound Collection or your own library). If the Veo dialogue doesn't match her real voice, either keep the Veo audio or re-record the same lines in **Marija's own voice** at the same timing (shots 1, 2, 4, 6, 8 are lip-synced, so re-record line by line).

**Transitions:**
- 1→2 **match cut** on the palm covering the lens. Cut on the frame where the palm fills the screen and start shot 2 on its palm-covered frame. Add a 2-frame whoosh.
- 2→3, 3→4, 6→7, 7→8: hard cuts on the downbeat.
- 4→5: hard cut with a small tape-stop SFX.
- 5→6 **whip-pan**: join the outgoing pan blur to the incoming one, 4–6 frames, with a directional blur.

**Text overlays (all in the safe zone x 64–920, y 270–1248):**
- Font: one bold grotesk (Inter Tight ExtraBold / Neue Haas Grotesk Display Bold). Headline cards 84–110 px, labels 54 px, small source line 30 px.
- Colours: ink #111111 text on signal-orange #FF5A1F pill boxes for labels and stats. Off-white #F4F1EC text on dark backgrounds. These colours and fonts are the branding all the way through, and there's **no logo until 23.5 s**.
- Stat cards (shots 4 and 6): big number at y ≈ 380–620, left-aligned at x 64, and small source line `Source: Meta, "Creative on Meta" playbook` under it.
- Shot 3 labels: track each label onto its card with a 1-point tracker. Check that the tall 9:16 card's label stays below y 270.
- Each card animates in over 4 frames with a scale-pop from 90% to 100% on the beat.
- Hard cap of 7 words per card. Every card in the storyboard is within that.

**Captions:** burned-in word-by-word (CapCut "Auto captions" → edit for accuracy). White #FFFFFF with a black 70% backdrop box, 52 px, centred at x ≈ 490, **y 1060–1240**, two lines max. Spell the numbers as digits ("9.1%", "20%", "7%") so they match the cards exactly. Don't let captions sit under a headline card at the same time. Shot 4 and 6 headlines sit at the top of the band and captions at the bottom.

**End card (23.5–25.0):** off-white #F4F1EC background, **MARIJA** wordmark in ink centred at y ≈ 760, `@handle` and the one-line tagline `Meta ads, without the fluff.` under it in orange. Final music hit at 24.5 s.

**Export:** H.264 or HEVC, 1080×1920, 30 fps, 10–16 Mbps, AAC 48 kHz stereo, loudness about −14 LUFS.

### CapCut / Premiere checklist
- [ ] Project is 9:16 1080×1920 at 30 fps. Safe-zone guide overlay is on (or the Meta Reels safe-zone template is imported).
- [ ] Clips are trimmed to the storyboard timecodes and the total is 25.0 s.
- [ ] Match cut 1→2 is frame-accurate and the whip-pan 5→6 is joined.
- [ ] Music is at 122 BPM, starts on frame 1 and is ducked under VO.
- [ ] Every overlay is ≤7 words and inside x 64–920 / y 270–1248.
- [ ] Captions are burned in, proofed, and the digits match the cards.
- [ ] Stats read exactly `9.1% lower CPA` and `7% lower cost per action` (see `extract.md`).
- [ ] No logo before 23.5 s.
- [ ] Watched the whole thing muted: the story still makes sense from text and captions alone.
- [ ] Watched it with sound: the hook lands within 2 s.
- [ ] Exported, then previewed in the Reels placement preview in Ads Manager.

---

## 6. Three alternative hooks (0.0–2.0 s only, for A/B)

Swap these in for shot 1. Shots 2–8 stay the same. As the playbook says (p.34), each hook is built on a different motivator.

| | Motivator | Visual | On-screen text | VO |
|---|---|---|---|---|
| **H2** | **Confession / relatability** ("I've been there too") — "a quiet confession" (p.33) | Marija leans in close to the lens, half-whispering, and covers one side of her mouth with her hand. Ends with the palm wiping the lens (keeps the match cut). | `Confession: one ad per ad set 🙈` | "Confession: I used to run one ad." |
| **H3** | **Loss aversion / wasted budget** ("I'm overpaying and don't know why") — "a truth they didn't want to say out loud" (p.33) | Marija looks at a phone, winces, then flips her eyes up to the lens. Palm wipe at the end. | `It's not your CPA. It's your ad set.` | "It's not your CPA. It's your ad set." |
| **H4** | **Insider shortcut / FOMO** ("I want what the experts know") — "like it came from the comment section" (p.33) | Marija raises an eyebrow and holds up three fingers, then pushes her palm to the lens. | `The 3-asset rule nobody told you 👇` | "The three-asset rule nobody told you." |

For each Veo hook prompt, copy the Shot 1 prompt and change only the action sentence and the `Audio:` line. Keep the CHARACTER / SET / LIGHT / LOOK / AVOID text word for word so the hook cuts cleanly into shot 2.

---

## 7. Format adaptations

**4:5 video (1080×1350):** don't letterbox. Crop from the 9:16 master with the window at **y 220–1570**. This keeps the whole text band (270–1248) and the faces. Then move the captions up to y ≈ 1150–1320 relative to the original frame, so they stay inside the crop. Feed has less UI cover, so the headline cards can grow 10%. In shot 7, check the wide grid still reads, and scale to 105% if the edges of the grid feel empty. Use the same audio and captions. (Playbook p.36: "shoot in 9:16 video, then adapt your aspect ratio.")

**Static 4:5 image ad:** take the **last frame of shot 3** (≈7.9 s), where Marija stands beside the three orange cards (square, 4:5, 9:16). Crop to 4:5, centre the subject, and keep it single-minded (p.16).
- Headline (as a hook): `Still running one ad per ad set?`
- Labels on the cards: `Image` · `4:5 video` · `9:16 + sound`
- Sub-line: `Ad sets with all three: 9.1% lower CPA`
- Small source line plus the brand colour and font. The logo can be small in the bottom corner, as it is on the end card.

**Thumbnail / cover frame:** use **shot 4 at ≈9.5 s**, the close-up knowing smile with the `9.1% lower CPA` card already on screen. It has a face and a number, and the important parts sit in the centre band, so it still works in the 1:1 grid crop on the profile.

**Advantage+ creative:** after upload, turn on the Advantage+ placements and only the enhancements you're comfortable with (p.44–48). Test hooks H2–H4 as separate ads in the same ad set, next to the 4:5 video and the static image. That way the ad set has all three formats (p.8).

---

## 8. Final check

| Check | Result |
|---|---|
| Stats match `extract.md` and the PDF | ✅ `9.1% lower CPA` (p.10) · `7% lower cost per action` with "at least 20%… 9:16 video with audio" (p.11). There are no other numbers in the video. |
| Runtime 20–30 s | ✅ 25.0 s across 8 shots plus the end card |
| VO fits the timing | ✅ 54 words ≈ 2.2 wps. The longest line is 9 words in a 3 s shot (3.0 wps). |
| Hook within 0–2 s (audio + visual + text) | ✅ Dialogue starts on frame 1, the finger/palm action happens in shot 1, and the text card is up on frame 1. |
| New shot every 2–3 s, at least one match cut | ✅ Cuts at 2/4/8/11/14/17/21/23.5. There's a palm match cut and a whip-pan. Shot 3 has beats every ~1.2 s inside its 4 s. Shot 7 runs 4 s, with a text change at 19 s. |
| Text in the safe zone | ✅ Every overlay and caption is set inside x 64–920 / y 270–1248, and the prompts keep the subject centre-left with headroom. |
| Human presence | ✅ Marija appears in shots 1–8. |
| Branding light, logo only at end | ✅ Orange and ink colours plus one typeface throughout. The wordmark appears only at 23.5 s. |
| One clear CTA | ✅ "Save this for your next launch." |
| No text or numbers asked from the generator | ✅ Every prompt bans text, numbers, captions, logos and UI. |
| Each prompt works pasted alone | ✅ Every prompt repeats the full subject, set, camera, lens, light, style, 9:16, duration, audio and avoid list. |
