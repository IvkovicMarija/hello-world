"""Render a 25 s 9:16 animatic of the Reels storyboard as raw frames to stdout."""
import sys
from PIL import Image, ImageDraw, ImageFont

W, H, FPS, DUR = 1080, 1920, 30, 25.0
INK, ORANGE, BONE, WHITE = (17, 17, 17), (255, 90, 31), (244, 241, 236), (255, 255, 255)
F = "/usr/share/fonts/opentype/inter/"
def font(name, size): return ImageFont.truetype(F + name, size)
F_HEAD = font("InterDisplay-ExtraBold.otf", 92)
F_BIG = font("InterDisplay-Black.otf", 150)
F_LABEL = font("Inter-Bold.otf", 54)
F_SMALL = font("Inter-SemiBold.otf", 30)
F_CAP = font("Inter-Bold.otf", 52)
F_META = font("Inter-SemiBold.otf", 32)
F_META_S = font("Inter-Regular.otf", 26)
F_WORD = font("InterDisplay-Black.otf", 140)

# Safe zone: x 64-920, y 270-1248
SX0, SX1, SY0, SY1 = 64, 920, 270, 1248

SHOTS = [  # start, end, bg, description, framing
    (0.0, 2.0, (58, 52, 48), "1 · HOOK — close-up, finger up, palm covers lens", "cu"),
    (2.0, 4.0, (70, 64, 58), "2 · MATCH CUT — palm pulls away, walks to camera", "ms"),
    (4.0, 8.0, (226, 221, 212), "3 · Three blank orange cards slapped on wall", "cards"),
    (8.0, 11.0, (64, 58, 54), "4 · Close-up, knowing smile, slow push-in", "cu"),
    (11.0, 14.0, (40, 38, 36), "5 · OTS phone insert, thumb presses volume", "phone"),
    (14.0, 17.0, (66, 60, 55), "6 · WHIP-PAN in, finger snap, firm nod", "mcu"),
    (17.0, 21.0, (226, 221, 212), "7 · Dolly out — wall grid of many cards", "grid"),
    (21.0, 23.5, (62, 56, 52), "8 · CTA — direct to camera, taps temple", "mcu"),
    (23.5, 25.0, BONE, "END CARD — logo only here", "end"),
]

# On-screen text cards: start, end, kind, text
CARDS = [
    (0.0, 2.0, "head", "One ad. One format?"),
    (2.0, 4.0, "head", "Meta's AI needs options."),
    (8.0, 11.0, "stat", ("9.1% lower CPA", "ad sets with all three · Meta")),
    (11.0, 14.0, "head", "≥20% of ad set: 9:16 + audio"),
    (14.0, 17.0, "stat", ("7% lower cost per action", "Meta")),
    (17.0, 19.0, "head", "Stop thinking in singles."),
    (19.0, 21.0, "head", "Build a system."),
    (21.0, 23.5, "head", "Save this for your next launch"),
]

VO = [
    (0.0, 2.0, "One ad. One format? Stop."),
    (2.0, 4.0, "Meta's AI needs options."),
    (4.0, 8.0, "Give it three: image, feed video, vertical with sound."),
    (8.0, 11.0, "That mix? 9.1% lower CPA."),
    (11.0, 14.0, "Then make at least 20% vertical, with audio."),
    (14.0, 17.0, "Seven percent lower cost per action."),
    (17.0, 21.0, "Stop thinking in singles. Build a system."),
    (21.0, 23.5, "Save this for your next launch."),
]

CARD_SHAPES = [(4.4, 300, 300, "Image"), (5.6, 300, 375, "4:5 video"), (6.8, 240, 427, "9:16 + sound")]


def ease(t):  # 0..1 pop
    t = max(0.0, min(1.0, t))
    return 1 - (1 - t) ** 3


def wrap(d, text, fnt, maxw):
    lines, cur = [], ""
    for w in text.split():
        trial = (cur + " " + w).strip()
        if d.textlength(trial, font=fnt) <= maxw:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def pill(d, x, y, text, fnt, fill=ORANGE, color=INK, pad=(22, 12)):
    tw = d.textlength(text, font=fnt)
    asc, desc = fnt.getmetrics()
    d.rounded_rectangle([x, y, x + tw + 2 * pad[0], y + asc + desc + 2 * pad[1]], 14, fill=fill)
    d.text((x + pad[0], y + pad[1]), text, font=fnt, fill=color)
    return y + asc + desc + 2 * pad[1]


def figure(d, kind, t, shot_t):
    """Grey placeholder silhouette for Marija, centre-left."""
    g = (150, 142, 134)
    if kind in ("cu",):
        s = 1.0 + 0.05 * shot_t
        cx, cy, r = 470, int(1000 - 40 * s), int(230 * s)
        d.ellipse([cx - r, cy - r, cx + r, cy + int(r * 1.2)], fill=g)
        d.rectangle([cx - int(r * 1.6), cy + int(r * 1.15), cx + int(r * 1.6), H], fill=(120, 112, 105))
    elif kind in ("ms", "mcu"):
        r = 130 if kind == "ms" else 170
        cx, cy = 470, 900
        d.ellipse([cx - r, cy - r, cx + r, cy + int(r * 1.2)], fill=g)
        d.rounded_rectangle([cx - int(r * 2.1), cy + int(r * 1.2), cx + int(r * 2.1), H], 60, fill=(25, 25, 25))
        d.polygon([(cx - 50, cy + int(r * 1.2)), (cx + 50, cy + int(r * 1.2)), (cx, cy + int(r * 1.2) + 160)], fill=WHITE)
    elif kind == "phone":
        d.rounded_rectangle([340, 520, 700, 1240], 40, fill=(10, 10, 10))
        d.rounded_rectangle([360, 545, 680, 1215], 28, fill=(200, 110, 60))
        d.ellipse([250, 1100, 470, 1400], fill=g)
    elif kind in ("cards", "grid"):
        d.ellipse([720, 760, 880, 940], fill=g)
        d.rounded_rectangle([680, 940, 920, H], 50, fill=(25, 25, 25))


def frame(t):
    shot = next(s for s in SHOTS if s[0] <= t < s[1] or (s is SHOTS[-1]))
    s0, s1, bg, desc, kind = shot
    st = t - s0
    im = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(im)

    if kind == "end":
        p = ease(st / 0.2)
        size = int(150 * (0.9 + 0.1 * p))
        f = font("InterDisplay-Black.otf", size)
        tw = d.textlength("MARIJA", font=f)
        d.text((492 - tw / 2, 700), "MARIJA", font=f, fill=INK)
        for i, (txt, fnt, y) in enumerate([("@handle", F_LABEL, 900), ("Meta ads, without the fluff.", font("Inter-Bold.otf", 44), 980)]):
            tw = d.textlength(txt, font=fnt)
            d.text((492 - tw / 2, y), txt, font=fnt, fill=ORANGE)
    else:
        figure(d, kind, t, st)
        if kind == "cards":
            x = SX0 + 10
            for (ts, cw, ch, lab) in CARD_SHAPES:
                if t >= ts:
                    sc = 0.9 + 0.1 * ease((t - ts) / 0.13)
                    w, h = int(cw * 0.6 * sc), int(ch * 0.6 * sc)
                    y = 780 - h
                    d.rectangle([x, y, x + w, y + h], fill=ORANGE)
                    pill(d, x, y - 80, lab, F_SMALL, fill=INK, color=WHITE, pad=(14, 8))
                x += int(cw * 0.6) + 28
        if kind == "grid":
            prog = ease(st / 4.0)
            n = 3 + int(prog * 21)
            k = 0
            for row in range(4):
                for col in range(6):
                    if k >= n:
                        break
                    w, h = [(70, 70), (64, 80), (50, 88)][k % 3]
                    x, y = 90 + col * 95, 660 + row * 110
                    d.rectangle([x, y, x + w, y + h], fill=ORANGE)
                    k += 1
        # match cut / whip cues
        if kind == "cu" and s0 == 0.0 and st > 1.6:
            a = ease((st - 1.6) / 0.4)
            d.ellipse([W / 2 - 900 * a, H / 2 - 1200 * a, W / 2 + 900 * a, H / 2 + 1200 * a], fill=(190, 160, 140))
        if kind == "ms" and st < 0.4:
            a = 1 - ease(st / 0.4)
            d.ellipse([W / 2 - 900 * a, H / 2 - 1200 * a, W / 2 + 900 * a, H / 2 + 1200 * a], fill=(190, 160, 140))

        # text cards
        for (c0, c1, ck, ctext) in CARDS:
            if c0 <= t < c1:
                p = ease((t - c0) / 0.13)
                y = 320 + int((1 - p) * 30)
                if ck == "head":
                    for line in wrap(d, ctext, F_HEAD, SX1 - SX0 - 44):
                        y = pill(d, SX0, y, line, F_HEAD) + 8
                else:
                    big, small = ctext
                    fnt = F_BIG
                    while d.textlength(big, font=fnt) > SX1 - SX0 - 44:
                        fnt = font("InterDisplay-Black.otf", fnt.size - 6)
                    y = pill(d, SX0, y, big, fnt) + 14
                    pill(d, SX0, y, small, F_SMALL, fill=INK, color=WHITE, pad=(14, 8))
                    pill(d, SX0, y + 70, 'Source: Meta, "Creative on Meta" playbook', F_SMALL, fill=INK, color=WHITE, pad=(14, 8))

        # captions: word-by-word reveal, last ~5 words shown
        for (v0, v1, line) in VO:
            if v0 <= t < v1:
                words = line.split()
                speak = (v1 - v0) * 0.9
                i = min(len(words), int((t - v0) / speak * len(words)) + 1)
                shown = words[max(0, i - 5):i]
                txt = " ".join(shown)
                lines = wrap(d, txt, F_CAP, 760)
                y = 1240 - len(lines) * 72
                for ln in lines:
                    tw = d.textlength(ln, font=F_CAP)
                    x = 492 - tw / 2
                    d.rectangle([x - 16, y - 6, x + tw + 16, y + 66], fill=(0, 0, 0))
                    d.text((x, y), ln, font=F_CAP, fill=WHITE)
                    y += 72

    # safe-zone guides (animatic only)
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(ov)
    red = (230, 40, 40, 70)
    od.rectangle([0, 0, W, SY0], fill=red)
    od.rectangle([0, SY1, W, H], fill=red)
    od.rectangle([SX1, SY0, W, SY1], fill=red)
    od.rectangle([SX0, SY0, SX1, SY1], outline=(230, 40, 40, 200), width=3)
    im = Image.alpha_composite(im.convert("RGBA"), ov).convert("RGB")
    d = ImageDraw.Draw(im)
    # meta info lives in the unsafe top band
    d.text((40, 40), "ANIMATIC — placeholder, not final", font=F_META, fill=WHITE, stroke_width=2, stroke_fill=INK)
    d.text((40, 95), desc, font=F_META_S, fill=WHITE, stroke_width=2, stroke_fill=INK)
    d.text((40, 140), f"{t:05.2f}s / 25.00s", font=F_META_S, fill=WHITE, stroke_width=2, stroke_fill=INK)
    d.text((40, 1300), "UI ZONE — keep clear", font=F_META_S, fill=WHITE, stroke_width=2, stroke_fill=INK)
    return im


if __name__ == "__main__":
    out = sys.stdout.buffer
    if len(sys.argv) > 1:  # still frame for preview
        frame(float(sys.argv[1])).save(sys.argv[2])
        sys.exit()
    for i in range(int(DUR * FPS)):
        out.write(frame(i / FPS).tobytes())
