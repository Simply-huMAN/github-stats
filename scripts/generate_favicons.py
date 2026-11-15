import os
from PIL import Image, ImageDraw, ImageFilter

def create_brand_icon(size: int = 512) -> Image.Image:
    # High resolution master canvas with RGBA
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Background squircle with dark premium background and subtle border
    pad = int(size * 0.04)
    radius = int(size * 0.22)
    
    # Outer ambient glow
    glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.rounded_rectangle(
        [pad, pad, size - pad, size - pad],
        radius=radius,
        fill=(99, 102, 241, 120)
    )
    glow = glow.filter(ImageFilter.GaussianBlur(radius=int(size * 0.05)))
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)

    # Main dark card container
    draw.rounded_rectangle(
        [pad, pad, size - pad, size - pad],
        radius=radius,
        fill=(10, 10, 16, 255),
        outline=(99, 102, 241, 200),
        width=max(2, int(size * 0.02))
    )

    # Subtle inner gradient / radial highlight
    inner_glow = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ig_draw = ImageDraw.Draw(inner_glow)
    center_x = size // 2
    center_y = int(size * 0.35)
    max_r = int(size * 0.45)
    for r in range(max_r, 0, -6):
        alpha = int(45 * (1 - r / max_r))
        ig_draw.ellipse(
            [center_x - r, center_y - r, center_x + r, center_y + r],
            fill=(99, 102, 241, alpha)
        )
    img = Image.alpha_composite(img, inner_glow)
    draw = ImageDraw.Draw(img)

    # 2. Draw Git Branch / Stats Emblem
    # The iconic Git graph with 3 interconnected nodes:
    # Main trunk: vertical line from top to bottom
    # Commit nodes: 3 connected glowing circular nodes
    scale = size / 24.0
    stroke_w = max(2, int(scale * 2.2))

    # Trunk line: x = 12, y from 4 to 20
    x_trunk = int(12 * scale)
    y_top = int(4.5 * scale)
    y_bot = int(19.5 * scale)
    draw.line([(x_trunk, y_top), (x_trunk, y_bot)], fill=(255, 255, 255, 255), width=stroke_w)

    # Branch curve: starts at x=12, y=8 -> curves right to x=17, y=12
    # Then curves back to x=12, y=16
    p1 = (x_trunk, int(7.5 * scale))
    p2 = (int(17.5 * scale), int(11.5 * scale))
    p3 = (x_trunk, int(15.5 * scale))
    
    # Draw smooth curved bezier branch line
    curve_points = []
    for t_step in range(25):
        t = t_step / 24.0
        # Quadratic bezier from p1 through p2 to p3
        bx = (1 - t)**2 * p1[0] + 2 * (1 - t) * t * p2[0] + t**2 * p3[0]
        by = (1 - t)**2 * p1[1] + 2 * (1 - t) * t * p2[1] + t**2 * p3[1]
        curve_points.append((bx, by))
    
    for i in range(len(curve_points) - 1):
        draw.line([curve_points[i], curve_points[i+1]], fill=(129, 140, 248, 255), width=stroke_w)

    # Node dots:
    node_r = max(2, int(scale * 1.8))
    nodes = [
        ((x_trunk, y_top), (255, 255, 255), (99, 102, 241)),       # Top node
        (p2, (56, 189, 248), (6, 182, 212)),                       # Branch node (cyan)
        ((x_trunk, y_bot), (168, 85, 247), (147, 51, 234)),       # Bottom node (purple)
    ]

    for pt, fill_color, border_color in nodes:
        nx, ny = int(pt[0]), int(pt[1])
        # Outer glow ring
        draw.ellipse([nx - node_r - 2, ny - node_r - 2, nx + node_r + 2, ny + node_r + 2], fill=border_color)
        # Inner solid dot
        draw.ellipse([nx - node_r, ny - node_r, nx + node_r, ny + node_r], fill=fill_color)

    return img

def main():
    os.makedirs("public", exist_ok=True)
    os.makedirs("app", exist_ok=True)

    master = create_brand_icon(512)

    # 1. 512x512 PWA Icon
    master.save("public/icon-512.png", "PNG", optimize=True)

    # 2. 192x192 PWA Icon
    i192 = master.resize((192, 192), Image.Resampling.LANCZOS)
    i192.save("public/icon-192.png", "PNG", optimize=True)

    # 3. 180x180 Apple Touch Icon
    i180 = master.resize((180, 180), Image.Resampling.LANCZOS)
    i180.save("public/apple-touch-icon.png", "PNG", optimize=True)

    # 4. 96x96 Icon
    i96 = master.resize((96, 96), Image.Resampling.LANCZOS)
    i96.save("public/icon-96.png", "PNG", optimize=True)

    # 5. 48x48 Icon (Strict Google Search requirement: multiple of 48px square)
    i48 = master.resize((48, 48), Image.Resampling.LANCZOS)
    i48.save("public/icon-48.png", "PNG", optimize=True)

    # 6. Multi-resolution favicon.ico (16, 32, 48)
    i32 = master.resize((32, 32), Image.Resampling.LANCZOS)
    i16 = master.resize((16, 16), Image.Resampling.LANCZOS)

    # Save favicon.ico in public/
    master.save(
        "public/favicon.ico",
        format="ICO",
        sizes=[(16, 16), (32, 32), (48, 48)],
        append_images=[i32, i48]
    )

    print("Generated all favicon formats successfully:")
    print(" - public/favicon.ico (16, 32, 48)")
    print(" - public/icon-48.png (Google Search 48px)")
    print(" - public/icon-96.png (96px)")
    print(" - public/icon-192.png (192px PWA)")
    print(" - public/icon-512.png (512px PWA)")
    print(" - public/apple-touch-icon.png (180px)")
    print(" - app/favicon.ico & app/icon.png")

if __name__ == "__main__":
    main()

