"""Google Meet / Zoom virtual backgrounds (1920x1080) in the Advantage brand kit.

Brand elements sit in the upper corners, where the speaker's head and shoulders don't cover them.
Usage: python3 scripts/meet_background.py
"""
import math

from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1920, 1080
NAVY = (12, 27, 53)
GLOW_BLUE = (22, 50, 106)
GLOW_PURPLE = (59, 50, 89)
STOPS = [(0, (30, 206, 166)), (0.5, (42, 106, 255)), (0.75, (148, 101, 209)), (1, (242, 95, 167))]
FONT = "public/fonts/Inter-{}.otf"


def grad(t):
    t = max(0.0, min(1.0, t))
    for (p0, c0), (p1, c1) in zip(STOPS, STOPS[1:]):
        if t <= p1:
            k = (t - p0) / (p1 - p0)
            return tuple(round(a + (b - a) * k) for a, b in zip(c0, c1))
    return STOPS[-1][1]


def glow(img, cx, cy, r, col, strength=255):
    m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(m).ellipse([cx - r, cy - r, cx + r, cy + r], fill=strength)
    m = m.filter(ImageFilter.GaussianBlur(r / 2.2))
    return Image.composite(Image.new("RGB", (W, H), col), img, m)


def base():
    img = Image.new("RGB", (W, H), NAVY)
    img = glow(img, 1650, -120, 700, GLOW_BLUE)
    img = glow(img, 1750, 1150, 600, GLOW_PURPLE)
    img = glow(img, 150, 1100, 450, (16, 38, 80), 200)
    d = ImageDraw.Draw(img)
    for y in range(30, H, 60):  # dot grid, as in the videos
        for x in range(30, W, 60):
            d.ellipse([x - 2, y - 2, x + 2, y + 2], fill=(36, 58, 99))
    return img


def ribbon(img, y0, amp, width, alpha):
    """A thin gradient wave across the lower third, the logo's gradient as a line."""
    S = 2
    layer = Image.new("RGBA", (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    pts = [(x, y0 + amp * math.sin(x / W * math.pi * 1.6 + 0.6)) for x in range(-20, W + 21, 4)]
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        c = grad(x1 / W)
        d.line([x1 * S, y1 * S, x2 * S, y2 * S], fill=c + (alpha,), width=width * S)
    layer = layer.resize((W, H), Image.LANCZOS)
    out = img.convert("RGBA")
    out.alpha_composite(layer)
    return out.convert("RGB")


def paste_scaled(img, path, width, xy):
    im = Image.open(path).convert("RGBA")
    im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
    out = img.convert("RGBA")
    out.alpha_composite(im, xy)
    return out.convert("RGB"), im.size


def branded():
    img = base()
    img = ribbon(img, 930, 40, 3, 150)
    img = ribbon(img, 965, 34, 2, 90)
    # top-left: Advantage mark + wordmark
    img, (mw, mh) = paste_scaled(img, "public/brand/advantage-mark.png", 120, (90, 80))
    img, (ww, wh) = paste_scaled(img, "public/brand/advantage-wordmark.png", 330, (90 + mw + 28, 80 + (mh - 40) // 2))
    d = ImageDraw.Draw(img)
    # top-right: name + tagline (right-aligned)
    name_f = ImageFont.truetype(FONT.format("Black"), 46)
    tag_f = ImageFont.truetype(FONT.format("Bold"), 28)
    name, tag = "Marija Ivković", "Meta creative that converts"
    nx = W - 90 - d.textlength(name, font=name_f)
    d.text((nx, 92), name, font=name_f, fill=(255, 255, 255))
    # tagline in the brand gradient, letter by letter
    tx = W - 90 - d.textlength(tag, font=tag_f)
    total = d.textlength(tag, font=tag_f)
    x = tx
    for ch in tag:
        d.text((x, 152), ch, font=tag_f, fill=grad((x - tx) / total))
        x += d.textlength(ch, font=tag_f)
    return img


def minimal():
    img = base()
    img = ribbon(img, 940, 36, 3, 120)
    img, _ = paste_scaled(img, "public/brand/advantage-mark.png", 110, (W - 90 - 110, 80))
    return img


branded().save("out/meet/advantage-meet-background.png", optimize=True)
minimal().save("out/meet/advantage-meet-background-minimal.png", optimize=True)
print("wrote out/meet/advantage-meet-background.png, out/meet/advantage-meet-background-minimal.png")
