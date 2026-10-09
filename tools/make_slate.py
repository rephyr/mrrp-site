"""Generates img/slate-dust.webp: a transparent chalk-dust layer (eraser wipes + settled dust)
laid over the board's flat slate colour. Procedural, no AI. Run: python3 tools/make_slate.py"""
import math, random
from PIL import Image, ImageDraw, ImageFilter

W, H = 1600, 1600
random.seed(400)
CHALK = (242, 232, 220)
img = Image.new("RGBA", (W, H), (0, 0, 0, 0))

# Eraser wipes: broad arcs made of many thin, slightly misaligned felt streaks
for _ in range(11):
    cx, cy = random.uniform(-200, W + 200), random.uniform(0, H)
    r = random.uniform(380, 900)
    a0 = random.uniform(0, math.tau)
    span = random.uniform(.5, 1.1)
    width = random.uniform(150, 280)
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer)
    for k in range(int(width / 3)):
        off = k * 3 - width / 2
        alpha = int(random.uniform(8, 22))
        pts = []
        for i in range(90):
            t = a0 + span * i / 89
            rr = r + off + random.uniform(-1.5, 1.5)
            pts.append((cx + rr * math.cos(t), cy + rr * math.sin(t)))
        d.line(pts, fill=CHALK + (alpha,), width=2)
    img = Image.alpha_composite(img, layer.filter(ImageFilter.GaussianBlur(1.2)))

# Settled dust: fine specks, denser toward the bottom of each tile
d = ImageDraw.Draw(img)
for _ in range(5000):
    y = H * (1 - random.random() ** 1.8)
    x = random.uniform(0, W)
    s = random.choice((1, 1, 1, 2))
    d.rectangle([x, y, x + s, y + s], fill=CHALK + (int(random.uniform(10, 34)),))

# Fade top and bottom edges so the tile repeats vertically without a seam
px = img.load()
fade = 120
for y in list(range(fade)) + list(range(H - fade, H)):
    f = min(y, H - 1 - y) / fade
    for x in range(W):
        r, g, b, a = px[x, y]
        px[x, y] = (r, g, b, int(a * f))

img.save("img/slate-dust.webp", quality=80, method=6)
print("wrote img/slate-dust.webp")

# Settled dust band for the top edge of the ledge rail: dense at the bottom, fading upward
band = Image.new("RGBA", (W, 140), (0, 0, 0, 0))
bd = ImageDraw.Draw(band)
for _ in range(14000):
    y = 140 * (1 - random.random() ** 3.2)
    x = random.uniform(0, W)
    s = random.choice((1, 1, 2, 2, 3))
    bd.ellipse([x, y, x + s, y + s * .7], fill=CHALK + (int(random.uniform(14, 60)),))
for _ in range(6):
    x0 = random.uniform(0, W - 300)
    bd.ellipse([x0, 104, x0 + random.uniform(160, 380), 150], fill=CHALK + (22,))
band = band.filter(ImageFilter.GaussianBlur(.6))
band.save("img/ledge-dust.webp", quality=82, method=6)
print("wrote img/ledge-dust.webp")
