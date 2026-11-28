from pathlib import Path

from PIL import Image, ImageDraw


PUBLIC = Path(__file__).resolve().parents[1] / "public"
G = (".###.", "#....", "#.###", "#...#", ".###.")
GREEN = "#39d353"
BACKGROUND = "#0a0c0e"
EMPTY_CELL = "#1b2430"


def draw_mark(size: int, *, show_grid: bool) -> Image.Image:
    scale = 4
    canvas = size * scale
    icon = Image.new("RGBA", (canvas, canvas), BACKGROUND if show_grid else (0, 0, 0, 0))
    draw = ImageDraw.Draw(icon)
    step = round(canvas * (0.12 if show_grid else 0.18))
    cell = round(step * (0.86 if show_grid else 0.9))
    start = (canvas - (4 * step + cell)) // 2

    for row, cells in enumerate(G):
        for column, value in enumerate(cells):
            if value == "." and not show_grid:
                continue
            x, y = start + column * step, start + row * step
            draw.rounded_rectangle(
                (x, y, x + cell - 1, y + cell - 1),
                radius=max(1, round(cell * 0.18)),
                fill=GREEN if value == "#" else EMPTY_CELL,
            )

    return icon.resize((size, size), Image.Resampling.LANCZOS)


def write_svg() -> None:
    cells = [
        f'    <rect x="{column * 10}" y="{row * 10}" width="9" height="9" rx="1.5"/>'
        for row, line in enumerate(G)
        for column, value in enumerate(line)
        if value == "#"
    ]
    svg = [
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 53 53">',
        '  <style>.mark{fill:#1f883d}@media(prefers-color-scheme:dark){.mark{fill:#39d353}}</style>',
        '  <g class="mark">',
        *cells,
        '  </g>',
        '</svg>',
        '',
    ]
    (PUBLIC / "favicon.svg").write_text("\n".join(svg), encoding="utf-8", newline="\n")


def main() -> None:
    for size in (48, 96, 192, 512):
        draw_mark(size, show_grid=True).save(PUBLIC / f"icon-{size}.png", optimize=True)
    draw_mark(180, show_grid=True).save(PUBLIC / "apple-touch-icon.png", optimize=True)
    draw_mark(48, show_grid=False).save(
        PUBLIC / "favicon.ico",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[draw_mark(size, show_grid=False) for size in (16, 32)],
    )
    write_svg()


if __name__ == "__main__":
    main()
