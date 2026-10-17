"""Synthesises the original 25 s soundtrack (public/music.wav), timed to src/timeline.ts.

Royalty-free by construction: every sound here is generated from scratch with numpy.
120 BPM, so every scene cut (2, 6, 10, 14, 18, 21, 23 s) lands on a beat.
Usage: python3 scripts/make_music.py
"""
import wave

import numpy as np

SR = 48000
DUR = 25.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DUR)
rng = np.random.default_rng(7)

# scene boundaries (seconds) and count-up windows, mirrored from src/timeline.ts + scene constants
CUTS = [2, 6, 10, 14, 18, 21, 23]
COUNTUPS = [(11.6, 12.8), (15.7, 16.9), (19.35, 20.25)]

L = np.zeros(N)
R = np.zeros(N)


def t_arr(dur):
    return np.arange(int(SR * dur)) / SR


def add(sig, at, gain=1.0, pan=0.0):
    s = int(at * SR)
    if s >= N:
        return
    sig = sig[: N - s]
    L[s : s + len(sig)] += sig * gain * (1 - max(pan, 0))
    R[s : s + len(sig)] += sig * gain * (1 + min(pan, 0))


def fft_filter(x, lo=None, hi=None):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.ones_like(f)
    if hi:
        m *= 1 / np.sqrt(1 + (f / hi) ** 4)
    if lo:
        m *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** 4)
    return np.fft.irfft(X * m, len(x))


def note(midi):
    return 440 * 2 ** ((midi - 69) / 12)


def saw(freq, t, harmonics=10):
    out = np.zeros_like(t)
    for k in range(1, harmonics + 1):
        out += np.sin(2 * np.pi * freq * k * t) / k
    return out * 0.6


# ---------- drums ----------
def kick():
    t = t_arr(0.42)
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7.5) + 0.25 * np.sin(ph * 2) * np.exp(-t * 30)


def hat(open_=False):
    t = t_arr(0.18 if open_ else 0.05)
    return fft_filter(rng.standard_normal(len(t)), lo=7000) * np.exp(-t * (18 if open_ else 70))


def clap():
    t = t_arr(0.25)
    env = np.exp(-t * 22) + 0.6 * np.exp(-np.maximum(t - 0.012, 0) * 30) * (t > 0.012)
    return fft_filter(rng.standard_normal(len(t)), lo=900, hi=5000) * env


def impact(size=1.0):
    t = t_arr(1.8 * size)
    boom = np.sin(2 * np.pi * (38 + 60 * np.exp(-t * 6)) * t) * np.exp(-t * 2.2 / size)
    crash = fft_filter(rng.standard_normal(len(t)), lo=2500) * np.exp(-t * 4 / size) * 0.5
    return boom + crash


def riser(dur):
    t = t_arr(dur)
    x = rng.standard_normal(len(t))
    out = np.zeros_like(t)
    seg = int(SR * 0.05)
    for i in range(0, len(t), seg):  # sweep the band upwards in short chunks
        k = i / len(t)
        out[i : i + seg] = fft_filter(x[i : i + seg + 0], lo=300 + 5000 * k, hi=900 + 9000 * k)
    return out * (t / dur) ** 2


def tick():
    t = t_arr(0.03)
    return np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 160)


kick_s, hat_c, hat_o, clap_s = kick(), hat(), hat(True), clap()

# ---------- arrangement ----------
# Am - F - C - G, one chord per bar (4 beats = 2 s)
CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
ROOTS = [33, 29, 36, 31]

beats = int(DUR / BEAT)
side = np.ones(N)  # sidechain envelope from the kick

for b in range(beats):
    at = b * BEAT
    if at >= 23.0:  # end card: beat drops out, chord rings
        break
    add(kick_s, at, 0.95)
    d = t_arr(0.35)
    s = int(at * SR)
    side[s : s + len(d)] = np.minimum(side[s : s + len(d)], 1 - 0.75 * np.exp(-d * 9))
    if at >= 2:
        add(hat_c, at + BEAT / 2, 0.22, pan=0.25)
    if at >= 10:
        add(hat_c, at + BEAT / 4, 0.09, pan=-0.3)
        add(hat_c, at + 3 * BEAT / 4, 0.09, pan=-0.3)
    if at >= 6 and b % 2 == 1:
        add(clap_s, at, 0.42)
    if at >= 14 and b % 4 == 3:
        add(hat_o, at + BEAT / 2, 0.16, pan=0.2)

# snare roll building into the end card
for i, at in enumerate(np.arange(21.5, 23.0, BEAT / 4)):
    add(clap_s, at, 0.12 + 0.25 * i / 12)

bass = np.zeros(N)
pad = np.zeros(N)
arp = np.zeros(N)
for bar in range(13):
    at = bar * 2.0
    ci = bar % 4
    # bass: off-beat eighths
    for e in range(8):
        st = at + e * BEAT / 2
        if st >= 23.0 or e % 2 == 0:
            continue
        t = t_arr(BEAT / 2 * 0.9)
        sig = saw(note(ROOTS[ci]), t, 8) * np.minimum(1, t * 200) * np.exp(-t * 4)
        s = int(st * SR)
        bass[s : s + len(t)] += sig[: max(0, N - s)]
    # pad: whole bar, detuned
    t = t_arr(2.0 if at < 22 else 3.0)
    sig = sum(saw(note(m) * dt, t, 6) for m in CHORDS[ci] for dt in (0.997, 1.003))
    env = np.minimum(1, t * 3) * np.minimum(1, (len(t) / SR - t) * 4)
    s = int(at * SR)
    pad[s : s + len(t)] += (sig * env)[: max(0, N - s)]
    # arp: 16ths from the idea scene on
    if 6 <= at < 22:
        seq = CHORDS[ci] + [CHORDS[ci][0] + 12]
        for k in range(16):
            st = at + k * BEAT / 4
            tt = t_arr(0.2)
            m = seq[k % 4] + 12
            sig = (np.sin(2 * np.pi * note(m) * tt) + 0.3 * np.sin(4 * np.pi * note(m) * tt)) * np.exp(-tt * 18)
            s = int(st * SR)
            arp[s : s + len(tt)] += sig[: max(0, N - s)]

bass = fft_filter(bass, hi=600) * side
pad = fft_filter(pad, hi=2200) * (0.4 + 0.6 * side)
arp = fft_filter(arp, hi=6000) * (0.5 + 0.5 * side)

# problem scene (2-6 s) is darker: duck the pad, no arp yet
dark = np.ones(N)
dark[int(2 * SR) : int(6 * SR)] = 0.55

L += bass * 0.38 + pad * 0.09 * dark + arp * 0.07
R += bass * 0.38 + pad * 0.09 * dark + arp * 0.10

# ---------- hits, risers, ticks ----------
add(impact(1.0), 0.0, 0.55)  # frame-1 hook hit
add(impact(0.5), 0.98, 0.28)  # screen shake on "set"
for c in CUTS:
    add(impact(1.3 if c in (10, 23) else 0.6), c, 0.5 if c in (10, 23) else 0.3)
add(riser(1.5), 8.5, 0.35)  # into the match cut / stat 1
add(riser(2.0), 21.0, 0.3)  # into the end card
for a, b in COUNTUPS:  # count-up ticks, accelerating
    ts = a + (b - a) * (np.linspace(0, 1, 14) ** 0.6)
    for x in ts:
        add(tick(), x, 0.18, pan=0.15)

# final chord tail on the end card
t = t_arr(2.0)
tail = sum(np.sin(2 * np.pi * note(m) * t) for m in [57, 60, 64, 69]) * np.exp(-t * 1.2) * np.minimum(1, t * 30)
add(tail, 23.0, 0.12, pan=-0.1)
add(tail, 23.0, 0.12, pan=0.1)

# ---------- master ----------
fade = np.ones(N)
fs = int(24.4 * SR)
fade[fs:] = np.linspace(1, 0, N - fs) ** 2
fade[: int(0.004 * SR)] = np.linspace(0, 1, int(0.004 * SR))
mix = np.stack([L, R], 1) * fade[:, None]
mix = np.tanh(mix * 1.1) / np.tanh(1.1)  # gentle soft clip
mix /= np.max(np.abs(mix)) / 0.89

with wave.open("public/music.wav", "w") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote public/music.wav", mix.shape[0] / SR, "s")
