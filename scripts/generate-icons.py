"""从弦迹图标的几何参数生成三端原生资源。运行前安装 Pillow。"""
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
GREEN = "#153b37"
GOLD = "#f1cf91"


def artwork(size, background, scale=1):
    image = Image.new("RGBA", (size, size), background)
    draw = ImageDraw.Draw(image)
    unit = size / 256 * scale

    def point(x, y):
        return ((x - 128) * unit + size / 2, (y - 128) * unit + size / 2)

    width = round(7 * unit)
    draw.ellipse([point(54, 54), point(202, 202)], outline=GOLD, width=width)
    for x1, x2, y, peak in [(65, 191, 149, 44), (66, 190, 166, 73), (74, 182, 182, 104)]:
        draw.line([
            point(x1 + (x2 - x1) * (n / 80), y - 2 * (n / 80) * (1 - n / 80) * (y - peak))
            for n in range(81)
        ], fill=GOLD, width=width)
    return image


def icon(path, background=GREEN, scale=1):
    size = Image.open(path).width if path.exists() else 512
    result = artwork(max(1024, size * 2), background, scale).resize((size, size), Image.Resampling.LANCZOS)
    if background == GREEN:
        result = result.convert("RGB")
    result.save(path, optimize=True)


icon(ROOT / "public/icon.png")
assets = ROOT / "ios/App/App/Assets.xcassets"
icon(assets / "AppIcon.appiconset/AppIcon-512@2x.png")
splash_logo = artwork(480, GREEN).convert("RGB")
for splash in (assets / "Splash.imageset").glob("*.png"):
    width, height = Image.open(splash).size
    image = Image.new("RGB", (width, height), GREEN)
    image.paste(splash_logo, ((width - 480) // 2, (height - 480) // 2))
    image.save(splash, optimize=True)
res = ROOT / "android/app/src/main/res"
for path in res.glob("mipmap-*/*.png"):
    icon(path, (0, 0, 0, 0) if "foreground" in path.name else GREEN, .64 if "foreground" in path.name else 1)
for path in res.glob("drawable*/splash.png"):
    width, height = Image.open(path).size
    image = Image.new("RGB", (width, height), GREEN)
    side = min(width, height) // 4
    image.paste(splash_logo.resize((side, side), Image.Resampling.LANCZOS), ((width - side) // 2, (height - side) // 2))
    image.save(path, optimize=True)
