"""Build the social-sharing card from the site's original photo.

Generated during GitHub Pages publication so the JPEG is always available
to crawlers even though the source repository does not store binary outputs.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
PHOTO = ROOT / "assets" / "berk-live-bw.jpg"
DEST = ROOT / "assets" / "og-preview.jpg"
W, H = 1200, 630
SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def build():
    canvas = Image.new("RGB", (W, H), (13, 14, 15))
    with Image.open(PHOTO) as photo:
        photo = photo.convert("RGB")
        new_height = round(photo.height * 670 / photo.width)
        photo = photo.resize((670, new_height), Image.Resampling.LANCZOS)
        photo = photo.crop((0, 170, 670, 170 + H))
        canvas.paste(photo, (0, 0))

    # Fade the photo to dark at the right; the subject remains unchanged.
    pixels = canvas.load()
    for x in range(420, 760):
        opacity = min(1.0, (x - 420) / 300)
        for y in range(H):
            r, g, b = pixels[x, y]
            pixels[x, y] = (
                int(r * (1 - opacity) + 13 * opacity),
                int(g * (1 - opacity) + 14 * opacity),
                int(b * (1 - opacity) + 15 * opacity),
            )

    draw = ImageDraw.Draw(canvas)
    white = (244, 243, 240)
    soft = (196, 198, 200)
    title_font = ImageFont.truetype(SERIF, 68)
    line_font = ImageFont.truetype(SANS, 23)
    detail_font = ImageFont.truetype(SANS, 16)
    url_font = ImageFont.truetype(SANS, 18)
    x = 700
    draw.text((x, 145), "Berk Kula", font=title_font, fill=white)
    draw.text((x + 8, 244), "A U D I O   E N G I N E E R", font=detail_font, fill=soft)
    draw.line((x + 7, 300, x + 128, 300), fill=(189, 192, 195), width=2)
    draw.text((x + 5, 335), "Live Sound", font=line_font, fill=white)
    draw.text((x + 5, 373), "Recording / Mixing", font=line_font, fill=white)
    draw.text((x + 5, 503), "berkkula.com   →", font=url_font, fill=white)
    DEST.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(DEST, format="JPEG", quality=87, optimize=True, progressive=True, subsampling=0)
    print(f"Generated {DEST} ({W}x{H})")


if __name__ == "__main__":
    build()
