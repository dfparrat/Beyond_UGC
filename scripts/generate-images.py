"""Generate course, Academy area and passport WebP images. Requires Pillow."""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
IMAGES = ROOT / "IMG"
AREAS = (
    "ugc-niches",
    "content-social",
    "income-ecommerce",
    "skills-foundations",
)
PASSPORTS = (
    "beyond_ugc_passport_diana_enhanced.png",
    "beyond_ugc_passport_vale_enhanced.png",
    "beyond_ugc_passport_amelie_monroy_enhanced.png",
)


def generate(source):
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        for width in (400, 800):
            height = max(1, round(image.height * width / image.width))
            resized = image.resize((width, height), Image.Resampling.LANCZOS)
            target = source.with_name(f"{source.stem}-{width}w.webp")
            resized.save(target, "WEBP", quality=85)
            print(f"Generated {target.relative_to(ROOT)}")


if __name__ == "__main__":
    for course in sorted(IMAGES.glob("[0-9][0-9]-*.jpg")):
        generate(course)

    for name in AREAS:
        area = IMAGES / "areas" / f"{name}.jpg"
        if area.is_file():
            generate(area)
        else:
            print(f"Missing optional area image: {area.relative_to(ROOT)}")

    for name in PASSPORTS:
        generate(IMAGES / name)
