"""프로필 사진에서 배경을 지우고(누끼) 얼굴 부분만 잘라 종이비행기 탑승자 이미지를 만든다.

사진을 바꿀 때: tmp/source/images/portrait.png 를 새 사진으로 바꾸고 `npm run portrait` 를 실행한다.
결과: public/images/rider.webp (배경 투명, 높이 240px)

처음 실행할 때 rembg가 배경 제거 모델(birefnet-portrait, 약 1GB)을 ~/.rembg 에 내려받는다.
"""

import sys

import numpy as np
from PIL import Image
from rembg import new_session, remove

source = sys.argv[1] if len(sys.argv) > 1 else "tmp/source/images/portrait.png"
cutout = remove(Image.open(source).convert("RGB"), session=new_session("birefnet-portrait"))
alpha = np.asarray(cutout)[:, :, 3] > 128

rows = np.where(alpha.any(axis=1))[0]
top = rows[0]
widths = alpha.sum(axis=1)
# 머리 윗부분 폭의 중앙값을 기준으로, 폭이 크게 넓어지는 줄(어깨 시작) 위까지를 머리로 본다.
head_width = np.median(widths[top : top + max(1, (rows[-1] - top) // 4)])
shoulder = next(
    (y for y in range(top + 1, rows[-1]) if widths[y] > head_width * 1.6),
    rows[-1],
)
head = alpha[top:shoulder]
cols = np.where(head.any(axis=0))[0]
box = (int(cols[0]), int(top), int(cols[-1]) + 1, int(shoulder))
rider = cutout.crop(box)
rider = rider.resize((round(rider.width * 240 / rider.height), 240), Image.LANCZOS)
rider.save("public/images/rider.webp", quality=88)
print(f"rider.webp {rider.width}x{rider.height} (crop {box})")
