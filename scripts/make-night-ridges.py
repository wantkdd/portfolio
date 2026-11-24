from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

# Hero night ridgeline: uv run --with numpy --with pillow python scripts/make-night-ridges.py
OUT = Path(__file__).resolve().parents[1] / 'public/images/night-ridges.webp'
W, H, D = 2200, 300, 880
rng = np.random.default_rng(91)

def noise2(h, w, gh, gw):
    a = rng.random((gh, gw)).astype(np.float32)
    return np.asarray(Image.fromarray(a).resize((w, h), Image.Resampling.BICUBIC))

def noise1(n, grid):
    a = rng.random((1, grid)).astype(np.float32)
    return np.asarray(Image.fromarray(a).resize((n, 1), Image.Resampling.BICUBIC))[0]

x = np.linspace(0, 1, W)
z = np.linspace(0, 1, D)
X, Z = np.meshgrid(x, z)
height = np.zeros((D, W), dtype=np.float32)

# Separate geologic chains recede through a long, oblique valley.
for i, (center, width, amp, phase) in enumerate([
    (.10, .065, 48, .3), (.245, .077, 74, 2.0),
    (.42, .092, 99, 4.6), (.625, .105, 121, 1.3),
    (.86, .145, 136, 3.5),
]):
    broad = .57 + .25 * np.sin(x * (10.5 + i) + phase)
    broad += .13 * np.sin(x * (25 + i * 2) + phase * .8)
    # A fractured skyline rather than a smoothed sinusoidal silhouette.
    profile = broad + .25 * noise1(W, 24 + i * 6)
    profile += .17 * noise1(W, 72 + i * 11)
    profile += .035 * noise1(W, 210 + i * 27)
    profile += .009 * noise1(W, 550)
    # Adjacent watersheds have irregularly staggered crests.
    meander = .017 * np.sin(x * 16 + phase) + .012 * noise1(W, 19)
    cross = np.exp(-((Z - center - meander) / width) ** 2)
    shift = (Z - center) * (.40 * np.sin(X * 9 + phase) + .23)
    shifted_profile = np.interp(np.clip(X + shift, 0, 1), x, profile)
    height += amp * cross * np.maximum(shifted_profile, .16)

# Fractal erosion supplies long slopes, sharp spurs, and fine broken rock.
macro = noise2(D, W, 23, 44)
height += 23 * (macro - .45)
for grid_y, grid_x, amp in [(48, 95, 8), (95, 186, 4.8), (210, 420, 2.0), (480, 980, .65)]:
    n = noise2(D, W, grid_y, grid_x)
    height += amp * (1 - np.abs(2 * n - 1) - .5)
height = np.maximum(height, 0)

dhz, dhx = np.gradient(height)
dhx *= 2.5
dhz *= 2.3
normal_z = 1 / np.sqrt(1 + dhx * dhx + dhz * dhz)
shade = (-.5 * dhx - .42 * dhz + .55) * normal_z
shade = np.clip(shade, -.65, .85)

yy = np.arange(H)[:, None]
rgba = np.zeros((H, W, 4), dtype=np.uint8)
owner = np.full((H, W), -1, dtype=np.int16)
rose = np.exp(-((x - .745) / .195) ** 2)
grain = rng.normal(0, .48, (D, W)).astype(np.float32)

for j in range(D):
    depth = z[j]
    line = 83 + depth * 300 - height[j]
    ytop = np.rint(line).astype(int)
    mask = yy >= ytop[None, :]
    # Atmospheric extinction makes every successive chain distinct.
    t = depth ** .67
    base = np.array([43, 42, 65]) * (1 - t) + np.array([10, 12, 23]) * t
    contrast = 1.2 + 3.0 * depth
    color = base[None, :] + shade[j, :, None] * contrast
    color += grain[j, :, None] * (.3 + .4 * depth)
    warm = rose * (1 - depth) ** 2 * 5.7
    color += warm[:, None] * np.array([1.0, .21, .14])[None, :]
    rgba[:, :, :3] = np.where(mask[:, :, None], np.clip(color, 0, 255).astype(np.uint8)[None, :, :], rgba[:, :, :3])
    rgba[:, :, 3] = np.where(mask, 255, rgba[:, :, 3])
    owner = np.where(mask, j, owner)

# Thin scattered reflected dusk on the very first distant crests.
alpha = rgba[:, :, 3]
top = np.argmax(alpha > 0, axis=0)
for ix in range(W):
    iy = top[ix]
    if iy > 0 and owner[iy, ix] < D * .39:
        strength = (.7 + 1.5 * rose[ix]) * (.3 + .7 * rng.random())
        rgba[iy, ix, :3] = np.minimum(255, rgba[iy, ix, :3].astype(float) + strength * np.array([2.5, 1.45, 1.9]))

# Very small settlements wind along the distant right-hand valley.
light = np.zeros((H, W, 3), dtype=np.float32)
for i in range(230):
    u = rng.uniform(.55, .99)
    v = 133 + (u - .55) * 65 + 7 * np.sin(u * 39)
    v += rng.normal(0, 2.5 if i < 170 else 6)
    ix, iy = int(u * W), int(v)
    if 0 <= iy < H and rgba[iy, ix, 3] and .22 * D < owner[iy, ix] < .96 * D:
        strength = rng.uniform(4, 15)
        light[iy, ix] += np.array([1, .66, .38]) * strength
        if rng.random() < .10:
            light[iy, ix] += np.array([1, .75, .49]) * 15

glow = np.asarray(Image.fromarray(np.clip(light * 2, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(.8))).astype(float)
rgb = rgba[:, :, :3].astype(float) + light + glow * .4
# End exactly at the hero's solid night color, so no image seam remains.
fade = np.clip((np.arange(H) - 222) / 76, 0, 1)[:, None, None]
rgb = rgb * (1 - fade) + np.array([10, 12, 23])[None, None, :] * fade
rgba[:, :, :3] = np.clip(rgb, 0, 255).astype(np.uint8)
rgba[rgba[:, :, 3] == 0, :3] = 0
im = Image.fromarray(rgba, 'RGBA')
im.save(OUT, 'WEBP', quality=88, method=6, exact=True)
print(f'{OUT}: {W} × {H}, {OUT.stat().st_size:,} bytes')
