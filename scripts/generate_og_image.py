from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from generate_favicons import BACKGROUND, PUBLIC, draw_mark


def generate_og_image() -> None:
    image = Image.new("RGB", (1200, 630), BACKGROUND)
    draw = ImageDraw.Draw(image)
    fonts = Path("C:/Windows/Fonts")
    title = ImageFont.truetype(str(fonts / "segoeuib.ttf"), 76)
    text = ImageFont.truetype(str(fonts / "segoeui.ttf"), 28)
    mono = ImageFont.truetype(str(fonts / "consola.ttf"), 27)

    mark = draw_mark(108, show_grid=True)
    image.paste(mark, (54, 52), mark)
    draw.text((155, 83), "mygitstats.dev", font=mono, fill="#e9eef4")

    draw.line((80, 176, 1120, 176), fill="#252e37", width=2)
    draw.multiline_text(
        (80, 223), "Create a GitHub\nstats card", font=title, fill="#e9eef4", spacing=2
    )
    draw.text(
        (82, 452), "City themes, contribution heatmaps, and PNG export.", font=text, fill="#929eac"
    )
    draw.line((80, 544, 1120, 544), fill="#252e37", width=2)
    image.save(PUBLIC / "og-image.png", "PNG", optimize=True)


if __name__ == "__main__":
    generate_og_image()
