from __future__ import annotations

from io import BytesIO
from pathlib import Path
from urllib.request import Request, urlopen

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets"
SOURCE_URL = "https://freesvg.org/img/gauge.png"

LEVELS = {
    "low": {"title": "Low", "color": (42, 176, 116), "angle": 158},
    "medium": {"title": "Medium", "color": (226, 164, 50), "angle": 92},
    "high": {"title": "High", "color": (224, 74, 74), "angle": 28},
}


def download_source() -> Image.Image:
    request = Request(SOURCE_URL, headers={"User-Agent": "cortisol-meter-raycast-extension/1.0"})
    with urlopen(request, timeout=30) as response:
        data = response.read()
    return Image.open(BytesIO(data)).convert("RGBA")


def trim_transparency(image: Image.Image) -> Image.Image:
    bbox = image.getchannel("A").getbbox()
    if bbox is None:
        return image
    return image.crop(bbox)


def fit(image: Image.Image, size: tuple[int, int]) -> Image.Image:
    copy = image.copy()
    copy.thumbnail(size, Image.Resampling.LANCZOS)
    return copy


def paste_centered(canvas: Image.Image, image: Image.Image, y_offset: int = 0) -> None:
    x = (canvas.width - image.width) // 2
    y = (canvas.height - image.height) // 2 + y_offset
    canvas.alpha_composite(image, (x, y))


def rounded_rect_mask(size: tuple[int, int], radius: int) -> Image.Image:
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle((0, 0, size[0] - 1, size[1] - 1), radius=radius, fill=255)
    return mask


def gradient_background(size: int, top: tuple[int, int, int], bottom: tuple[int, int, int]) -> Image.Image:
    image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    pixels = image.load()
    for y in range(size):
        t = y / max(1, size - 1)
        color = tuple(round(top[i] * (1 - t) + bottom[i] * t) for i in range(3))
        for x in range(size):
            pixels[x, y] = (*color, 255)
    image.putalpha(rounded_rect_mask((size, size), 116))
    return image


def draw_needle(draw: ImageDraw.ImageDraw, center: tuple[int, int], radius: int, angle: int, color: tuple[int, int, int]) -> None:
    import math

    radians = math.radians(angle)
    end = (round(center[0] + math.cos(radians) * radius), round(center[1] - math.sin(radians) * radius))
    shadow_end = (end[0] + 2, end[1] + 3)
    draw.line((center, shadow_end), fill=(0, 0, 0, 92), width=12)
    draw.line((center, end), fill=(*color, 255), width=9)
    draw.ellipse((center[0] - 15, center[1] - 15, center[0] + 15, center[1] + 15), fill=(32, 34, 38, 255))
    draw.ellipse((center[0] - 7, center[1] - 7, center[0] + 7, center[1] + 7), fill=(*color, 255))


def create_extension_icon(source: Image.Image) -> None:
    canvas = gradient_background(512, (38, 42, 50), (13, 16, 20))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle((34, 34, 478, 478), radius=96, outline=(255, 255, 255, 34), width=3)
    draw.arc((78, 114, 434, 470), start=198, end=342, fill=(255, 255, 255, 42), width=22)

    meter = fit(source, (440, 284))
    meter = ImageEnhance.Contrast(meter).enhance(1.06)
    paste_centered(canvas, meter, y_offset=-10)
    draw_needle(draw, (256, 336), 142, 50, (224, 74, 74))

    canvas.save(ASSETS / "icon.png")


def create_ui_asset(level: str, source: Image.Image) -> None:
    spec = LEVELS[level]
    color = spec["color"]
    canvas = Image.new("RGBA", (640, 460), (0, 0, 0, 0))

    card = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    card_draw = ImageDraw.Draw(card)
    card_draw.rounded_rectangle((24, 26, 616, 430), radius=36, fill=(22, 24, 28, 238))
    card_draw.rounded_rectangle((26, 28, 614, 428), radius=34, outline=(*color, 86), width=3)
    glow = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((150, 18, 490, 358), fill=(*color, 44))
    glow = glow.filter(ImageFilter.GaussianBlur(48))
    card.alpha_composite(glow)
    canvas.alpha_composite(card)

    meter = fit(source, (558, 326))
    meter = ImageEnhance.Color(meter).enhance(0.82)
    meter = ImageEnhance.Contrast(meter).enhance(1.08)
    canvas.alpha_composite(meter, ((canvas.width - meter.width) // 2, 58))

    draw = ImageDraw.Draw(canvas)
    draw.arc((82, 112, 558, 588), start=198, end=342, fill=(*color, 230), width=14)
    draw_needle(draw, (320, 338), 188, spec["angle"], color)
    draw.rounded_rectangle((236, 377, 404, 416), radius=20, fill=(*color, 235))
    draw.text((320, 397), spec["title"].upper(), fill=(255, 255, 255, 255), anchor="mm")

    canvas.save(ASSETS / f"cortisol-ui-{level}.png")


def create_menu_bar_icon(level: str) -> None:
    import math

    angle = LEVELS[level]["angle"]
    image = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.arc((8, 14, 56, 62), start=202, end=338, fill=(0, 0, 0, 255), width=7)
    draw.line((12, 52, 52, 52), fill=(0, 0, 0, 255), width=6)

    radians = math.radians(angle)
    center = (32, 51)
    end = (round(center[0] + math.cos(radians) * 21), round(center[1] - math.sin(radians) * 21))
    draw.line((center, end), fill=(0, 0, 0, 255), width=7)
    draw.ellipse((25, 44, 39, 58), fill=(0, 0, 0, 255))

    image = image.resize((32, 32), Image.Resampling.LANCZOS)
    image.save(ASSETS / f"menubar-{level}.png")


def main() -> None:
    ASSETS.mkdir(exist_ok=True)
    source = trim_transparency(download_source())
    create_extension_icon(source)
    for level in LEVELS:
        create_ui_asset(level, source)
        create_menu_bar_icon(level)


if __name__ == "__main__":
    main()
