"""파비콘: 워드마크의 w와 파란 점."""
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
f = instantiateVariableFont(TTFont("tmp/source/fonts/PretendardVariable.woff2"), {"wght": 760})
gs = f.getGlyphSet(); g = gs[f.getBestCmap()[ord("w")]]
b = BoundsPen(gs); g.draw(b); x0, y0, x1, y1 = b.bounds
s = 40 / (x1 - x0)  # w 폭 40px
h = (y1 - y0) * s
tx = 7.2 - x0 * s; ty = 32 + h / 2 + y0 * s  # 세로 중앙
pen = SVGPathPen(gs); g.draw(TransformPen(pen, (s, 0, 0, -s, tx, ty + y0 * s * 0 )))
d = pen.getCommands()
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#193f61"/><path fill="#f7fbfd" d="{d}"/><circle fill="#7fc0ec" cx="53.2" cy="{32 + h/2 - 3.6:.1f}" r="3.6"/></svg>\n'
open("src/app/icon.svg", "w").write(svg)
print(h)
