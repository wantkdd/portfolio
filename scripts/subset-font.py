"""Refresh the local font for text currently present in the site source.

Requires fontTools with Brotli support and the original Pretendard font.
Usage: python3 scripts/subset-font.py [path/to/PretendardVariable.woff2]
"""

from pathlib import Path
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
source = Path(sys.argv[1]) if len(sys.argv) > 1 else root / "tmp/source/fonts/PretendardVariable.woff2"
destination = root / "public/fonts/PretendardSubset.woff2"
text = "".join(
    path.read_text()
    for path in sorted((root / "src").rglob("*"))
    if path.suffix in {".ts", ".tsx", ".css"}
)
text += "".join(chr(code) for code in range(32, 127))
font = TTFont(source)
options = subset.Options()
options.flavor = "woff2"
options.layout_features = ["*"]
subsetter = subset.Subsetter(options=options)
subsetter.populate(text=text)
subsetter.subset(font)
font.flavor = "woff2"
font.save(destination)
cmap = font.getBestCmap()
missing = {char for char in text if "\uac00" <= char <= "\ud7a3" and ord(char) not in cmap}
if missing:
    raise SystemExit(f"Missing Korean glyphs: {''.join(sorted(missing))}")
print(f"{destination.name}: {destination.stat().st_size:,} bytes; all source Hangul glyphs covered")
