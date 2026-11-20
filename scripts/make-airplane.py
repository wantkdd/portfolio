"""히어로를 가로지르는 비행기 이미지를 만든다.

원본: NASA SOFIA 747SP 비행 사진 (퍼블릭 도메인)
https://commons.wikimedia.org/wiki/File:SOFIA_over_clouds.jpg
다운로드: curl -sL -o tmp/plane/sofia.jpg "https://commons.wikimedia.org/wiki/Special:FilePath/SOFIA_over_clouds.jpg?width=1600"

배경을 지운 뒤 기관 로고와 글자(NASA, DLR, SOFIA, 등록번호)를 덮고 꼬리날개를 사이트 하늘색으로 다시 칠한다.
결과: public/images/airplane.webp (배경 투명, 기수가 오른쪽. 왼쪽에서 오른쪽으로 날아간다)
"""

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from rembg import new_session, remove

SRC = "tmp/plane/sofia.jpg"
photo = Image.open(SRC).convert("RGB")
cut = remove(photo, session=new_session("isnet-general-use"))
W, H = cut.size
k = W / 900  # 아래 좌표는 가로 900px 미리보기 기준

def px(points):
    return [(x * k, y * k) for x, y in points]

rgba = np.asarray(cut).copy()
alpha = rgba[:, :, 3]
# 꼬리 뒤 비행운(반투명)과 구름 찌꺼기 제거
alpha[alpha < 200] = 0
alpha[:, int(846 * k):] = 0
img = Image.fromarray(rgba)

body = tuple(int(c) for c in np.asarray(photo)[int(368 * k), int(200 * k)])

# 1) 동체의 글자·로고를 동체색으로 덮는다.
patch = Image.new("RGBA", img.size, (0, 0, 0, 0))
draw = ImageDraw.Draw(patch)
for box in [(183, 374, 258, 398), (108, 391, 124, 403), (632, 405, 668, 418)]:
    draw.rectangle(px([box[:2], box[2:]]), fill=body + (255,))

# 2) 꼬리날개를 하늘색 그라데이션으로 다시 칠한다.
tail = Image.new("L", img.size, 0)
ImageDraw.Draw(tail).polygon(
    px([(628, 380), (812, 212), (853, 212), (803, 352), (799, 380)]), fill=255
)
top, bottom = 212 * k, 380 * k
grad = np.zeros((H, W, 4), dtype=np.uint8)
ys = np.clip((np.arange(H) - top) / (bottom - top), 0, 1)[:, None]
sky_top, sky_bottom = np.array([79, 159, 216]), np.array([156, 210, 240])
grad[:, :, :3] = (sky_top[None, None, :] * (1 - ys[:, :, None]) + sky_bottom[None, None, :] * ys[:, :, None]).astype(np.uint8)
grad[:, :, 3] = 255
paint = Image.fromarray(grad)
img = Image.alpha_composite(img, patch)
painted = Image.composite(paint, img, tail)
painted.putalpha(Image.fromarray(alpha))

box = painted.getbbox()
painted = painted.crop(box).transpose(Image.FLIP_LEFT_RIGHT)

# 3) 뒤집은 뒤 꼬리에 w. 표시 (원본 좌표를 뒤집힌 좌표로 바꾼다)
def flipped(x, y):
    return (box[2] - box[0]) - (x * k - box[0]), y * k - box[1]

mark = ImageDraw.Draw(painted)
font = ImageFont.truetype("/System/Library/Fonts/HelveticaNeue.ttc", int(58 * k), index=1)
mark.text(flipped(770, 318), "w", font=font, fill=(255, 255, 255, 255), anchor="ms")
cx, cy = flipped(746, 312)
r = 6 * k
mark.ellipse([(cx - r, cy - r), (cx + r, cy + r)], fill=(25, 63, 97, 255))
painted = painted.resize((1400, round(painted.height * 1400 / painted.width)), Image.LANCZOS)
painted.save("public/images/airplane.webp", quality=86)
print("airplane.webp", painted.size)
