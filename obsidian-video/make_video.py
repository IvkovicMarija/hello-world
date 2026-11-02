#!/usr/bin/env python3
"""
"The Marketer vs. Obsidian" — a ~75 second funny vertical (9:16) video
about a marketer's first month with Obsidian.

Everything is generated from code: frames are drawn with Pillow, the music
and sound effects are synthesized with numpy, and ffmpeg muxes the result.

Usage:
    python3 make_video.py                 # writes marketer_vs_obsidian.mp4
    python3 make_video.py out.mp4
    python3 make_video.py --preview DIR   # writes one PNG per scene to DIR
"""
import math
import os
import random
import subprocess
import sys
import wave
from functools import lru_cache

import numpy as np
from PIL import Image, ImageDraw, ImageFont

W, H, FPS = 1080, 1920, 30
SR = 44100

# ---------------------------------------------------------------- palette ---
BG = (22, 20, 32)
PURPLE = (139, 108, 247)
LILAC = (196, 181, 253)
WHITE = (242, 240, 250)
GRAY = (150, 146, 172)
DARK = (40, 36, 58)
RED = (255, 99, 99)
GREEN = (110, 231, 160)
TAG_COLORS = [(139, 108, 247), (236, 112, 175), (98, 182, 255),
              (255, 176, 82), (110, 231, 160), (255, 99, 99)]

FONTS = {
    "reg": "/usr/share/fonts/opentype/inter/Inter-Regular.otf",
    "bold": "/usr/share/fonts/opentype/inter/Inter-Bold.otf",
    "xbold": "/usr/share/fonts/opentype/inter/Inter-ExtraBold.otf",
    "black": "/usr/share/fonts/opentype/inter/Inter-Black.otf",
    "mono": "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    "monob": "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
}


@lru_cache(maxsize=None)
def F(kind, size):
    return ImageFont.truetype(FONTS[kind], max(1, int(size)))


# ---------------------------------------------------------------- helpers ---
def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def prog(t, start, dur):
    return clamp((t - start) / dur)


def ease_out(x):
    x = clamp(x)
    return 1 - (1 - x) ** 3


def ease_back(x):
    x = clamp(x)
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2


def mix(c1, c2, t):
    t = clamp(t)
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def wrap(text, font, maxw):
    words, lines, cur = text.split(" "), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if font.getlength(trial) <= maxw or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def fit(text, font, maxw):
    if font.getlength(text) <= maxw:
        return text
    while text and font.getlength(text + "…") > maxw:
        text = text[:-1]
    return text + "…"


def text(d, xy, s, font, fill, a=1.0, bg=BG, anchor="mm"):
    if a <= 0:
        return
    d.text(xy, s, font=font, fill=mix(bg, fill, a), anchor=anchor)


def pop_text(d, t, t0, s, cx, cy, kind, size, fill, bg=BG):
    p = prog(t, t0, 0.35)
    if p <= 0:
        return
    text(d, (cx, cy), s, F(kind, size * ease_back(p)), fill, min(1, p * 2), bg)


def fade_text(d, t, t0, s, cx, cy, kind, size, fill, dur=0.45):
    p = ease_out(prog(t, t0, dur))
    if p > 0:
        text(d, (cx, cy + (1 - p) * 30), s, F(kind, size), fill, p)


def day_label(d, t, day, sub):
    p = ease_out(prog(t, 0.05, 0.4))
    f = F("monob", 40)
    tw = f.getlength(day)
    y = 210 - (1 - p) * 30
    d.rounded_rectangle([W / 2 - tw / 2 - 34, y - 38, W / 2 + tw / 2 + 34, y + 38],
                        38, fill=mix(BG, PURPLE, p))
    text(d, (W / 2, y), day, f, WHITE, p, PURPLE)
    p2 = ease_out(prog(t, 0.2, 0.4))
    text(d, (W / 2, 330 + (1 - p2) * 30), sub, F("xbold", 66), WHITE, p2)


def caption(d, t, t0, s, y, size=54, box=PURPLE, fg=WHITE, kind="bold"):
    p = ease_out(prog(t, t0, 0.4))
    if p <= 0:
        return
    f = F(kind, size)
    lines = wrap(s, f, 860)
    lh = size * 1.3
    bw = max(f.getlength(l) for l in lines) + 80
    bh = lh * len(lines) + 46
    yy = y + (1 - p) * 50
    d.rounded_rectangle([W / 2 - bw / 2, yy, W / 2 + bw / 2, yy + bh], 26,
                        fill=mix(BG, box, p))
    for i, l in enumerate(lines):
        text(d, (W / 2, yy + 23 + lh * i + lh / 2), l, f, fg, p, box)


def bubble(d, t, t0, s, side, y, name, color):
    f = F("reg", 48)
    lines = wrap(s, f, 660)
    pad, lh = 34, 62
    bw = max(f.getlength(l) for l in lines) + pad * 2
    bh = lh * len(lines) + pad * 2 - 14
    p = prog(t, t0, 0.32)
    if p > 0:
        e = ease_back(p)
        a = min(1, p * 1.8)
        off = (1 - e) * 90 * (-1 if side == "left" else 1)
        x = (80 if side == "left" else W - 80 - bw) + off
        nx = x if side == "left" else x + bw
        text(d, (nx, y), name, F("bold", 30), GRAY, a,
             anchor="lt" if side == "left" else "rt")
        d.rounded_rectangle([x, y + 44, x + bw, y + 44 + bh], 34, fill=mix(BG, color, a))
        for i, l in enumerate(lines):
            text(d, (x + pad, y + 44 + pad + lh * i + 22), l, f, WHITE, a, color, anchor="lm")
    return y + 44 + bh + 50


DEFAULT_THEME = dict(name="Default Dark", bg=(32, 30, 44), bar=(24, 22, 34),
                     side=(27, 25, 38), fg=WHITE, muted=GRAY, accent=PURPLE)


def window(d, x, y, w, h, th, title, files, active=0):
    d.rounded_rectangle([x, y, x + w, y + h], 28, fill=th["bg"])
    d.rounded_rectangle([x, y, x + w, y + 80], 28, fill=th["bar"])
    d.rectangle([x, y + 50, x + w, y + 80], fill=th["bar"])
    for i, c in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
        d.ellipse([x + 30 + i * 36, y + 30, x + 50 + i * 36, y + 50], fill=c)
    text(d, (x + w / 2 + 40, y + 40), fit(title, F("bold", 30), w - 260),
         F("bold", 30), th["muted"], bg=th["bar"])
    sw = 300
    d.rectangle([x, y + 80, x + sw, y + h - 28], fill=th["side"])
    d.rounded_rectangle([x, y + h - 60, x + sw, y + h], 28, fill=th["side"])
    d.rectangle([x + 28, y + h - 60, x + sw, y + h], fill=th["side"])
    text(d, (x + 30, y + 120), "MY VAULT", F("monob", 24), th["muted"], bg=th["side"], anchor="lm")
    for i, fn in enumerate(files):
        fy = y + 175 + i * 60
        f = F("reg", 27)
        if i == active:
            d.rounded_rectangle([x + 16, fy - 24, x + sw - 16, fy + 24], 12, fill=th["accent"])
            text(d, (x + 30, fy), fit(fn, f, sw - 60), f, (255, 255, 255), bg=th["accent"], anchor="lm")
        else:
            text(d, (x + 30, fy), fit(fn, f, sw - 60), f, th["muted"], bg=th["side"], anchor="lm")
    return x + sw + 40, y + 130


# ------------------------------------------------------- shared backgrounds ---
def make_bg():
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    img = np.zeros((H, W, 3), np.float32) + np.array(BG, np.float32)
    g1 = np.exp(-(((xx - 150) / 700) ** 2 + ((yy - 200) / 700) ** 2))
    g2 = np.exp(-(((xx - 950) / 700) ** 2 + ((yy - 1750) / 700) ** 2))
    img += (g1 * 0.10 + g2 * 0.08)[..., None] * (np.array(PURPLE) - np.array(BG))
    return Image.fromarray(img.clip(0, 255).astype(np.uint8))


BG_IMG = make_bg()

_rng = random.Random(7)
DOTS = [(_rng.uniform(0, W), _rng.uniform(0, H), _rng.uniform(0, 6.28), _rng.uniform(3, 7))
        for _ in range(55)]


def drift_dots(d, t, a=1.0):
    pts = [(x + 25 * math.sin(t * 0.6 + ph), y + 25 * math.cos(t * 0.5 + ph), r)
           for x, y, ph, r in DOTS]
    for i in range(len(pts)):
        for j in range(i + 1, len(pts)):
            dx, dy = pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]
            if dx * dx + dy * dy < 230 ** 2:
                d.line([pts[i][:2], pts[j][:2]], fill=mix(BG, DARK, a), width=2)
    for x, y, r in pts:
        d.ellipse([x - r, y - r, x + r, y + r], fill=mix(BG, (80, 70, 120), a))


# Graph-view layout (preferential attachment = a few hubs, lots of leaves)
N_NODES = 412
GCX, GCY, GR = W / 2, 1010, 420
_g = random.Random(42)
NODES = [(0.0, 0.0)]
EDGES = []
ends = [0]
for i in range(1, N_NODES):
    parent = _g.choice(ends)
    px, py = NODES[parent]
    ang, r = _g.uniform(0, 2 * math.pi), _g.uniform(70, 170)
    nx, ny = px + r * math.cos(ang), py + r * math.sin(ang)
    dist = math.hypot(nx, ny)
    if dist > GR:
        s = GR * _g.uniform(0.75, 1.0) / dist
        nx, ny = nx * s, ny * s
    NODES.append((nx, ny))
    EDGES.append((parent, i))
    ends += [parent, i]
for _ in range(70):
    a, b = _g.randrange(N_NODES), _g.randrange(N_NODES)
    if a != b and math.dist(NODES[a], NODES[b]) < 260:
        EDGES.append((min(a, b), max(a, b)))
DEGREE = [0] * N_NODES
for a, b in EDGES:
    DEGREE[a] += 1
    DEGREE[b] += 1

G_START, G_DUR = 0.6, 4.8


def node_time(i):
    n = i + 1
    if n <= 3:
        return G_START
    return G_START + G_DUR * math.log(n / 3) / math.log(N_NODES / 3)


NODE_T = [node_time(i) for i in range(N_NODES)]


# ------------------------------------------------------------------ scenes ---
def s_title(img, d, t):
    drift_dots(d, t, ease_out(prog(t, 0, 1)))
    fade_text(d, t, 0.2, "A DOCUMENTARY NOBODY ASKED FOR", W / 2, 600, "monob", 34, LILAC)
    pop_text(d, t, 0.7, "THE MARKETER", W / 2, 780, "black", 112, WHITE)
    pop_text(d, t, 1.2, "vs.", W / 2, 915, "bold", 76, LILAC)
    pop_text(d, t, 1.6, "OBSIDIAN", W / 2, 1060, "black", 160, PURPLE)
    fade_text(d, t, 2.7, "7 days. 1 vault. 0 campaigns shipped.", W / 2, 1260, "reg", 46, GRAY)


def s_recommend(img, d, t):
    day_label(d, t, "DAY 0", "The recommendation")
    y = bubble(d, t, 0.5, "You HAVE to try Obsidian. It's like a second brain!",
               "left", 520, "Coworker who journals", DARK)
    y = bubble(d, t, 2.3, "I can barely run my first one.", "right", y, "Me", PURPLE)
    y = bubble(d, t, 4.1, "...fine. Downloading.", "right", y, "Me", PURPLE)


S3_LINE1 = "# Q4 Campaign Ideas"
S3_T0, S3_CPS = 0.7, 13


def s_first_note(img, d, t):
    day_label(d, t, "DAY 1", "The first note")
    p = ease_out(prog(t, 0.1, 0.5))
    wy = 520 + (1 - p) * 80
    ex, ey = window(d, 60, wy, 960, 860, DEFAULT_THEME, "Q4 Campaign Ideas.md",
                    ["Q4 Campaign Ideas.md"], 0)
    n = int(clamp((t - S3_T0) * S3_CPS, 0, len(S3_LINE1)))
    f = F("monob", 40)
    d.text((ex, ey), S3_LINE1[:n], font=f, fill=WHITE)
    done = n == len(S3_LINE1)
    cy = ey + (80 if done and t > 2.6 else 0)
    if done and t > 2.6:
        d.text((ex, cy), "- ", font=F("mono", 40), fill=GRAY)
        cx = ex + F("mono", 40).getlength("- ")
    else:
        cx = ex + f.getlength(S3_LINE1[:n])
    if int(t * 2.4) % 2 == 0 or not done:
        d.rectangle([cx + 4, cy + 2, cx + 8, cy + 48], fill=PURPLE)
    text(d, (1000, wy + 830), "4 words", F("mono", 24), GRAY, bg=DEFAULT_THEME["bg"], anchor="rm")
    caption(d, t, 3.3, "A blank page. Just like my Q4 strategy.", 1480)


LINKS = ["Brand Voice", "Brand Voice v2", "Brand Voice FINAL",
         "Brand Voice FINAL_final", "Brand Voice FINAL_final_USE_THIS"]


def s_links(img, d, t):
    day_label(d, t, "DAY 2", "Discovers [[links]]")
    f = F("monob", 36)
    boxes = []
    for i, name in enumerate(LINKS):
        s = f"[[{name}]]"
        bw = f.getlength(s) + 70
        cx = W / 2 + (70 if i % 2 else -70) * (1 if i < 4 else 0)
        cy = 540 + i * 220
        boxes.append((cx, cy, bw, s))
    for i, (cx, cy, bw, s) in enumerate(boxes):
        t0 = 0.5 + i * 0.85
        if i > 0:
            pc, pcy = boxes[i - 1][0], boxes[i - 1][1]
            lp = ease_out(prog(t, t0 - 0.25, 0.3))
            if lp > 0:
                y1, y2 = pcy + 45, cy - 45
                d.line([(pc, y1), (pc + (cx - pc) * lp, y1 + (y2 - y1) * lp)],
                       fill=LILAC, width=5)
        p = prog(t, t0, 0.35)
        if p > 0:
            e = ease_back(p)
            hw, hh = bw / 2 * e, 45 * e
            col = PURPLE if i == len(boxes) - 1 else DARK
            d.rounded_rectangle([cx - hw, cy - hh, cx + hw, cy + hh], 22, fill=mix(BG, col, p))
            if e > 0.6:
                text(d, (cx, cy), s, F("monob", 36 * e), WHITE, min(1, p * 2), col)
    caption(d, t, 5.1, "Version control? Never heard of her.", 1660)


def s_graph(img, d, t):
    day_label(d, t, "DAY 3", "Opens Graph View")
    rot = t * 0.06
    cr, sr = math.cos(rot), math.sin(rot)

    def P(i):
        x, y = NODES[i]
        w = 4 * math.sin(t * 1.3 + i)
        return GCX + x * cr - y * sr + w, GCY + x * sr + y * cr + w

    vis = [k for k in range(N_NODES) if NODE_T[k] <= t]
    for a, b in EDGES:
        if NODE_T[a] <= t and NODE_T[b] <= t:
            ap = prog(t, max(NODE_T[a], NODE_T[b]), 0.3)
            d.line([P(a), P(b)], fill=mix(BG, (78, 68, 118), ap), width=2)
    for k in vis:
        sc = ease_back(prog(t, NODE_T[k], 0.3))
        r = (5 + min(DEGREE[k], 14) * 1.1) * sc
        x, y = P(k)
        col = PURPLE if DEGREE[k] >= 6 else (205, 200, 225)
        d.ellipse([x - r, y - r, x + r, y + r], fill=col)
    n = len(vis)
    text(d, (W / 2, 470), f"notes: {n}", F("monob", 44), LILAC, ease_out(prog(t, 0.4, 0.3)))
    caption(d, t, 3.6, "I'm not organizing notes.", 1520, box=DARK)
    caption(d, t, 5.0, "I'm mapping the universe.", 1640)
    p = ease_out(prog(t, 6.3, 0.4))
    text(d, (W / 2, 1810), "Productivity: 0%   ·   Vibes: 100%", F("monob", 36), GREEN, p)


PLUGINS = ["Calendar", "Kanban", "Dataview", "Excalidraw", "Hydration Reminder",
           "Buzzword Bingo", "Make Boss Think I'm Busy", "Auto-Synergy",
           "Gantt Chart (unused)", "Confetti on Save", "Meeting Escape Hatch",
           "Emoji Rain"]
PLUG_T0, PLUG_DT = 0.6, 0.36


def s_plugins(img, d, t):
    day_label(d, t, "DAY 4", "Community plugins")
    v = int(round(47 * ease_out(prog(t, 0.4, 4.6))))
    text(d, (W / 2, 610), str(v), F("black", 250), PURPLE, ease_out(prog(t, 0.3, 0.3)))
    text(d, (W / 2, 790), "PLUGINS INSTALLED", F("monob", 42), LILAC, ease_out(prog(t, 0.3, 0.3)))
    f = F("bold", 32)
    for i, name in enumerate(PLUGINS):
        p = prog(t, PLUG_T0 + i * PLUG_DT, 0.3)
        if p <= 0:
            continue
        e = ease_back(p)
        col, row = i % 2, i // 2
        cx, cy = W / 2 + (-235 if col == 0 else 235), 900 + row * 100
        hw, hh = 220 * e, 38 * e
        c = TAG_COLORS[i % len(TAG_COLORS)]
        d.rounded_rectangle([cx - hw, cy - hh, cx + hw, cy + hh], 38, fill=mix(BG, DARK, p),
                            outline=mix(BG, c, p), width=3)
        if e > 0.6:
            text(d, (cx, cy), fit(name, F("bold", 32 * e), 410), F("bold", 32 * e), WHITE, p, DARK)
    caption(d, t, 5.4, "Plugins actually used: 2.", 1560)


TAGS = ["#idea", "#campaign", "#Q4", "#urgent", "#URGENT", "#urgent-final",
        "#ask-legal", "#ceo-said-so", "#synergy", "#vibes", "#todo", "#todo-later",
        "#todo-never", "#brand", "#rebrand", "#re-rebrand", "#thought-leadership",
        "#who-wrote-this", "#circle-back"]
TAG_T0, TAG_DT = 0.5, 0.2


def tag_layout():
    f = F("monob", 36)
    rows, cur, curw = [], [], 0
    for tg in TAGS:
        w = f.getlength(tg) + 50
        if curw + w > 960 and cur:
            rows.append((cur, curw - 18))
            cur, curw = [], 0
        cur.append((tg, w))
        curw += w + 18
    rows.append((cur, curw - 18))
    out = []
    for r, (items, rw) in enumerate(rows):
        x = W / 2 - rw / 2
        for tg, w in items:
            out.append((tg, x + w / 2, 560 + r * 110, w))
            x += w + 18
    return out


TAG_POS = tag_layout()


def s_tags(img, d, t):
    day_label(d, t, "DAY 5", "Discovers #tags")
    for i, (tg, cx, cy, w) in enumerate(TAG_POS):
        p = prog(t, TAG_T0 + i * TAG_DT, 0.28)
        if p <= 0:
            continue
        e = ease_back(p)
        c = TAG_COLORS[i % len(TAG_COLORS)]
        d.rounded_rectangle([cx - w / 2 * e, cy - 38 * e, cx + w / 2 * e, cy + 38 * e], 38,
                            fill=mix(BG, c, p))
        if e > 0.6:
            text(d, (cx, cy), tg, F("monob", 36 * e), (20, 18, 30), p, c)
    caption(d, t, 4.6, "Taxonomy: pure chaos.", 1480)


THEMES = [
    DEFAULT_THEME,
    dict(name="Solarized Panic", bg=(253, 246, 227), bar=(238, 232, 213), side=(245, 238, 218),
         fg=(88, 110, 117), muted=(120, 130, 135), accent=(38, 139, 210)),
    dict(name="Hot Dog Stand", bg=(255, 0, 0), bar=(255, 255, 0), side=(255, 215, 0),
         fg=(0, 0, 0), muted=(60, 0, 0), accent=(0, 0, 0)),
    dict(name="Matrix Vibes", bg=(0, 0, 0), bar=(10, 20, 10), side=(5, 15, 5),
         fg=(0, 255, 70), muted=(0, 170, 50), accent=(0, 120, 30)),
    dict(name="Barbiecore", bg=(255, 182, 213), bar=(255, 105, 180), side=(255, 160, 200),
         fg=(120, 0, 70), muted=(160, 30, 100), accent=(220, 0, 120)),
    dict(name="Corporate Beige", bg=(222, 210, 190), bar=(200, 188, 168), side=(210, 198, 178),
         fg=(90, 80, 70), muted=(120, 110, 95), accent=(150, 130, 100)),
    dict(DEFAULT_THEME, name="...back to Default Dark"),
]
THEME_T0, THEME_DT = 0.6, 0.8


def theme_at(t):
    return min(len(THEMES) - 1, max(0, int((t - THEME_T0) / THEME_DT) + 1)) if t >= THEME_T0 else 0


def s_themes(img, d, t):
    day_label(d, t, "DAY 6", "Picks a theme")
    th = THEMES[theme_at(t)]
    ex, ey = window(d, 60, 480, 960, 760, th, "Q4 Campaign Ideas.md",
                    ["Q4 Campaign Ideas.md", "Brand Voice FINAL…"], 0)
    d.text((ex, ey), "# Q4 Campaign", font=F("monob", 40), fill=th["fg"])
    d.text((ex, ey + 56), "  Ideas", font=F("monob", 40), fill=th["fg"])
    d.text((ex, ey + 140), "- ", font=F("mono", 40), fill=th["muted"])
    text(d, (ex, ey + 520), "Theme:", F("mono", 28), th["muted"], bg=th["bg"], anchor="lm")
    text(d, (ex, ey + 565), th["name"], F("monob", 32), th["fg"], bg=th["bg"], anchor="lm")
    mins = int(540 + (827 - 540) * ease_out(prog(t, 0.5, 5.2)))
    hh, mm = divmod(mins, 60)
    ampm = "AM" if hh < 12 else "PM"
    hh12 = hh if hh <= 12 else hh - 12
    text(d, (W / 2, 1360), f"{hh12}:{mm:02d} {ampm}", F("monob", 96), LILAC)
    caption(d, t, 5.7, "Campaigns launched: 0. Font: perfect.", 1490)


SEARCH_T0, SEARCH_Q = 3.3, "campaign brief"


def s_deadline(img, d, t):
    day_label(d, t, "DAY 7", "The deadline")
    y = bubble(d, t, 0.4, "Hey, where's the campaign brief? It's due today.",
               "left", 470, "Boss", (90, 50, 60))
    y = bubble(d, t, 1.9, "It's... um... linked to everything.", "right", y, "Me", PURPLE)
    p = ease_out(prog(t, 3.0, 0.35))
    if p > 0:
        by = 1240 + (1 - p) * 40
        d.rounded_rectangle([80, by, W - 80, by + 110], 55, fill=mix(BG, DARK, p))
        d.ellipse([125, by + 32, 165, by + 72], outline=mix(BG, GRAY, p), width=5)
        d.line([(160, by + 67), (178, by + 85)], fill=mix(BG, GRAY, p), width=6)
        n = int(clamp((t - SEARCH_T0) * 14, 0, len(SEARCH_Q)))
        text(d, (205, by + 55), SEARCH_Q[:n] if n else "Search vault…", F("reg", 44),
             WHITE if n else GRAY, p, DARK, anchor="lm")
    q = ease_back(prog(t, 4.6, 0.35))
    if q > 0:
        text(d, (W / 2, 1480), "No results found.", F("black", 84 * q), RED, min(1, q))
    fade_text(d, t, 5.5, "(you never actually wrote it)", W / 2, 1600, "mono", 36, GRAY)


WINS = [("Content calendar", "one note, every channel"),
        ("Competitor research", "linked, never lost"),
        ("Meeting notes", "finally searchable"),
        ("Campaign ideas", "captured at 2 AM"),
        ("The brief", "actually written. Hooray.")]
WIN_T0, WIN_DT = 0.7, 0.95


def s_clicks(img, d, t):
    day_label(d, t, "DAY 30", "It finally clicks")
    for i, (a, b) in enumerate(WINS):
        t0 = WIN_T0 + i * WIN_DT
        p = ease_out(prog(t, t0 - 0.25, 0.3))
        if p <= 0:
            continue
        y = 530 + i * 170 + (1 - p) * 30
        x = 120
        chk = prog(t, t0, 0.2)
        d.rounded_rectangle([x, y, x + 80, y + 80], 18, outline=mix(BG, GREEN, p), width=5,
                            fill=mix(BG, GREEN, chk) if chk > 0 else None)
        if chk > 0:
            pts = [(x + 18, y + 42), (x + 34, y + 60), (x + 64, y + 22)]
            d.line(pts[:2] if chk < 0.5 else pts, fill=BG, width=9, joint="curve")
        text(d, (x + 120, y + 22), a, F("bold", 48), WHITE, p, anchor="lm")
        text(d, (x + 120, y + 66), "→ " + b, F("reg", 34), GRAY, p, anchor="lm")
    caption(d, t, 6.0, "Okay, fine. It's actually amazing.", 1420, size=58)


def s_outro(img, d, t):
    drift_dots(d, t + 10, 1)
    pop_text(d, t, 0.2, "OBSIDIAN", W / 2, 640, "black", 160, PURPLE)
    pop_text(d, t, 0.6, "FOR MARKETERS", W / 2, 790, "xbold", 74, WHITE)
    fade_text(d, t, 1.4, "Come for the productivity.", W / 2, 1000, "reg", 54, WHITE)
    fade_text(d, t, 2.2, "Stay for the graph view.", W / 2, 1090, "bold", 58, LILAC)
    fade_text(d, t, 3.4, "(Now go write that brief.)", W / 2, 1300, "mono", 38, GRAY)


# (draw fn, duration, sfx [(offset, kind)])
SCENES = [
    (s_title, 5.0, [(0.7, "pop"), (1.2, "pop"), (1.6, "boom"), (2.7, "tick")]),
    (s_recommend, 6.0, [(0.5, "pop"), (2.3, "pop"), (4.1, "pop")]),
    (s_first_note, 6.0, [(S3_T0 + i / S3_CPS, "type") for i in range(len(S3_LINE1))]
     + [(2.6, "type"), (3.3, "pop")]),
    (s_links, 7.0, [(0.5 + i * 0.85, "pop") for i in range(len(LINKS))] + [(5.1, "ding")]),
    (s_graph, 8.0, [(node_time(n - 1), "pop") for n in (3, 6, 12, 24, 48, 96, 192, 384)]
     + [(3.6, "tick"), (5.0, "tick"), (6.3, "ding")]),
    (s_plugins, 7.0, [(PLUG_T0 + i * PLUG_DT, "pop") for i in range(len(PLUGINS))]
     + [(5.4, "tick")]),
    (s_tags, 6.0, [(TAG_T0 + i * TAG_DT, "pop") for i in range(len(TAGS))] + [(4.6, "tick")]),
    (s_themes, 7.0, [(THEME_T0 + i * THEME_DT, "tick") for i in range(len(THEMES) - 1)]
     + [(5.7, "pop")]),
    (s_deadline, 7.0, [(0.4, "pop"), (1.9, "pop")]
     + [(SEARCH_T0 + i / 14, "type") for i in range(len(SEARCH_Q))] + [(4.6, "sad")]),
    (s_clicks, 9.0, [(WIN_T0 + i * WIN_DT, "ding") for i in range(len(WINS))] + [(6.0, "pop")]),
    (s_outro, 6.0, [(0.2, "boom"), (0.6, "pop"), (2.2, "ding")]),
]
STARTS = np.cumsum([0] + [s[1] for s in SCENES]).tolist()
TOTAL = STARTS[-1]
DEADLINE_IDX = 8


def render_frame(gt):
    idx = max(i for i in range(len(SCENES)) if STARTS[i] <= gt) if gt < TOTAL else len(SCENES) - 1
    fn, dur, _ = SCENES[idx]
    t = gt - STARTS[idx]
    img = BG_IMG.copy()
    d = ImageDraw.Draw(img)
    fn(img, d, t)
    if t < 0.2:
        img = Image.blend(BG_IMG, img, t / 0.2)
    if idx == len(SCENES) - 1 and t > dur - 0.7:
        img = Image.blend(img, Image.new("RGB", (W, H), (0, 0, 0)), (t - (dur - 0.7)) / 0.7)
    return img


# ------------------------------------------------------------------- audio ---
def env_decay(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def add(buf, start, sig):
    i = int(start * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    buf[i:i + len(sig)] += sig


def tone(freq, dur, tau, harm=(1.0, 0.35, 0.15)):
    n = int(dur * SR)
    ts = np.arange(n) / SR
    s = sum(a * np.sin(2 * np.pi * freq * (k + 1) * ts) for k, a in enumerate(harm))
    att = np.minimum(1, np.arange(n) / (0.004 * SR))
    return s * env_decay(n, tau) * att


def sfx(kind, rng):
    if kind == "pop":
        n = int(0.09 * SR)
        f = np.linspace(420, 980, n)
        return 0.45 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env_decay(n, 0.025)
    if kind == "boom":
        n = int(0.5 * SR)
        f = np.linspace(140, 40, n)
        return 0.8 * np.sin(2 * np.pi * np.cumsum(f) / SR) * env_decay(n, 0.15)
    if kind == "type":
        n = int(0.03 * SR)
        x = rng.standard_normal(n)
        x = np.diff(x, prepend=0)
        return 0.18 * x * env_decay(n, 0.006)
    if kind == "tick":
        return 0.3 * tone(2200, 0.05, 0.01, (1.0,))
    if kind == "ding":
        return 0.28 * (tone(1318.5, 0.8, 0.25, (1.0,)) + 0.5 * tone(1975.5, 0.8, 0.18, (1.0,)))
    if kind == "sad":
        out = np.zeros(int(2.6 * SR))
        notes = [(293.66, 0.0, 0.42), (277.18, 0.45, 0.42), (261.63, 0.9, 0.42), (246.94, 1.35, 1.2)]
        for fr, st, du in notes:
            n = int(du * SR)
            ts = np.arange(n) / SR
            vib = 1 + (0.012 * np.sin(2 * np.pi * 6 * ts) if du > 1 else 0)
            ph = 2 * np.pi * np.cumsum(fr * vib) / SR
            s = sum(np.sin(ph * k) / k for k in range(1, 9))
            e = np.minimum(1, ts / 0.05) * np.minimum(1, (du - ts) / 0.12)
            add(out, st, 0.22 * s * e)
        return out
    raise ValueError(kind)


def music(total):
    buf = np.zeros(int(total * SR))
    beat = 0.5  # 120 BPM
    chords = [[261.63, 329.63, 392.00], [196.00, 246.94, 293.66],
              [220.00, 261.63, 329.63], [174.61, 220.00, 261.63]]
    rng = np.random.default_rng(1)
    hat = np.diff(rng.standard_normal(int(0.04 * SR)), prepend=0) * env_decay(int(0.04 * SR), 0.008)
    nk = int(0.25 * SR)
    kick = np.sin(2 * np.pi * np.cumsum(np.linspace(130, 45, nk)) / SR) * env_decay(nk, 0.07)
    nbeats = int(total / beat)
    for b in range(nbeats):
        tb = b * beat
        ch = chords[(b // 4) % 4]
        add(buf, tb, 0.55 * kick)
        add(buf, tb + beat / 2, 0.08 * hat)
        add(buf, tb, 0.22 * tone(ch[0] / 2, 0.45, 0.18, (1.0, 0.5, 0.2)))
        for k in range(2):
            fr = [ch[0] * 2, ch[1] * 2, ch[2] * 2, ch[1] * 2][(b * 2 + k) % 4]
            add(buf, tb + k * beat / 2, 0.07 * tone(fr, 0.3, 0.09, (1.0, 0.4, 0.25, 0.1)))
    # Comedic silence after "No results found." until Day 30 starts.
    duck = np.ones_like(buf)
    a = int((STARTS[DEADLINE_IDX] + 4.55) * SR)
    b_ = int(STARTS[DEADLINE_IDX + 1] * SR)
    duck[a:b_] = 0.0
    ramp = int(0.05 * SR)
    duck[a - ramp:a] = np.linspace(1, 0, ramp)
    # fade out at end
    fo = int(1.0 * SR)
    duck[-fo:] *= np.linspace(1, 0, fo)
    return buf * duck


def build_audio(path):
    buf = music(TOTAL)
    rng = np.random.default_rng(3)
    for i, (_, _, events) in enumerate(SCENES):
        add(buf, STARTS[i], 0.12 * np.diff(rng.standard_normal(int(0.25 * SR)), prepend=0)
            * np.hanning(int(0.25 * SR)) * 0.6)  # soft whoosh on cut
        for off, kind in events:
            add(buf, STARTS[i] + off, sfx(kind, rng))
    buf = np.tanh(buf * 1.1) * 0.9
    pcm = (buf * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


# -------------------------------------------------------------------- main ---
def main():
    here = os.path.dirname(os.path.abspath(__file__))
    if len(sys.argv) > 2 and sys.argv[1] == "--preview":
        out = sys.argv[2]
        os.makedirs(out, exist_ok=True)
        for i, (fn, dur, _) in enumerate(SCENES):
            render_frame(STARTS[i] + dur * 0.85).save(os.path.join(out, f"scene_{i:02d}.png"))
        return
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(here, "marketer_vs_obsidian.mp4")
    wav = out + ".wav"
    build_audio(wav)
    ff = subprocess.Popen(
        ["ffmpeg", "-y", "-loglevel", "error", "-f", "rawvideo", "-pix_fmt", "rgb24",
         "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-i", wav,
         "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p",
         "-c:a", "aac", "-b:a", "160k", "-shortest", "-movflags", "+faststart", out],
        stdin=subprocess.PIPE)
    nframes = int(TOTAL * FPS)
    for f in range(nframes):
        ff.stdin.write(render_frame(f / FPS).tobytes())
        if f % 150 == 0:
            print(f"frame {f}/{nframes}", flush=True)
    ff.stdin.close()
    ff.wait()
    os.remove(wav)
    print("wrote", out)


if __name__ == "__main__":
    main()
