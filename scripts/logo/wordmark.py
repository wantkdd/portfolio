"""wantkdd 워드마크: Pretendard(OFL) 800 굵기 글리프를 외곽선으로 바꾸고 자간을 좁힌 뒤 파란 점을 붙인다."""
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

font = TTFont("tmp/source/fonts/PretendardVariable.woff2")
font = instantiateVariableFont(font, {"wght": 760})
gs = font.getGlyphSet(); cmap = font.getBestCmap(); upm = font["head"].unitsPerEm
TRACK = -0.035 * upm
x = 0; paths = []
for ch in "wantkdd":
    g = cmap[ord(ch)]
    pen = SVGPathPen(gs)
    gs[g].draw(TransformPen(pen, (1, 0, 0, -1, x, 0)))
    paths.append(pen.getCommands())
    x += gs[g].width + TRACK
# 파란 점: 원형, 베이스라인에 앉힘
r = 0.085 * upm
dot_cx = x + r + 0.02 * upm
bp = BoundsPen(gs)
for ch in "wantkdd":
    pass
ascender = 0.75 * upm  # d 높이 근사
top = -ascender - 10
width = dot_cx + r + 10
d = " ".join(paths)
svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="-10 {top:.0f} {width+10:.0f} {ascender+20:.0f}" role="img" aria-label="wantkdd">
  <path fill="currentColor" d="{d}"/>
  <circle fill="#276da3" cx="{dot_cx:.1f}" cy="{-r:.1f}" r="{r:.1f}"/>
</svg>
'''
open("tmp/logo/wantkdd.svg", "w").write(svg)
print(width, ascender)
