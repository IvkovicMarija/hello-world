import math, struct, wave, random
SR, DUR, BPM = 48000, 25.0, 122
n = int(SR * DUR); buf = [0.0] * n
def add(t, freq, length, amp, noise=False):
    s = int(t * SR)
    for i in range(int(length * SR)):
        if s + i >= n: break
        env = math.exp(-i / (SR * length / 5))
        v = (random.uniform(-1, 1) if noise else math.sin(2 * math.pi * freq * i / SR))
        buf[s + i] += amp * env * v
beat = 60 / BPM
k = 0
while k * beat < 24.5:
    add(k * beat, 1500 if k % 4 == 0 else 1000, 0.05, 0.25); k += 1
for t in [1.8, 4.4, 5.6, 6.8, 11.3, 11.6, 13.8, 14.2]:
    add(t, 0, 0.12, 0.35, noise=True)          # whoosh / slap / snap cues
add(17.0, 80, 0.6, 0.6); add(24.5, 110, 0.5, 0.6)  # drop + final hit
with wave.open("click.wav", "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes(b"".join(struct.pack("<h", int(max(-1, min(1, x)) * 32000)) for x in buf))
