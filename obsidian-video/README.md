# The Marketer vs. Obsidian 🎬

A 74-second, vertical (1080×1920, 9:16) comedy short about a marketer's first
month with Obsidian. Made for Reels, TikTok, Shorts and LinkedIn.

**Watch:** [`marketer_vs_obsidian.mp4`](marketer_vs_obsidian.mp4)

## Storyline
| Day | Gag |
|-----|-----|
| Title | *The Marketer vs. Obsidian*: "7 days. 1 vault. 0 campaigns shipped." |
| Day 0 | "It's like a second brain!" / "I can barely run my first one." |
| Day 1 | First note: a blank page, "just like my Q4 strategy." |
| Day 2 | `[[Brand Voice]]` → … → `[[Brand Voice FINAL_final_USE_THIS]]` |
| Day 3 | Graph view explodes to 412 notes. Productivity 0%, vibes 100%. |
| Day 4 | 47 plugins installed (incl. "Make Boss Think I'm Busy"). 2 actually used. |
| Day 5 | Tag chaos: `#urgent`, `#URGENT`, `#urgent-final`, `#todo-never`… |
| Day 6 | 4 hours spent on themes ("Hot Dog Stand", "Barbiecore")… back to default. |
| Day 7 | Boss asks for the brief. Search: **No results found.** *(sad trombone)* |
| Day 30 | It clicks: content calendar, research, meeting notes, ideas, the brief. ✅ |
| Outro | "Come for the productivity. Stay for the graph view." |

## Regenerate
Everything (visuals, music, sound effects) is generated in code. Requires
Python 3 with Pillow and numpy, plus ffmpeg.

```bash
python3 make_video.py                  # -> marketer_vs_obsidian.mp4 (~1 min)
python3 make_video.py --preview out/   # one PNG per scene for quick review
```

Edit the text in the scene functions in `make_video.py` to tweak the jokes.
