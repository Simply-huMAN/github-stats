import os
from PIL import Image, ImageDraw, ImageFont

def generate_og_image():
    width, height = 1200, 630
    
    # Base canvas
    img = Image.new("RGBA", (width, height), (7, 7, 9, 255))
    
    # Ambient glows on separate layer
    glow = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    
    # Indigo glow top-center
    for r in range(450, 0, -8):
        alpha = int(45 * (1 - r / 450))
        glow_draw.ellipse([600 - r, 80 - r, 600 + r, 80 + r], fill=(99, 102, 241, alpha))
        
    # Purple glow bottom-right
    for r in range(350, 0, -8):
        alpha = int(35 * (1 - r / 350))
        glow_draw.ellipse([1050 - r, 500 - r, 1050 + r, 500 + r], fill=(168, 85, 247, alpha))

    # Cyan glow bottom-left
    for r in range(300, 0, -8):
        alpha = int(30 * (1 - r / 300))
        glow_draw.ellipse([150 - r, 480 - r, 150 + r, 480 + r], fill=(6, 182, 212, alpha))
        
    img = Image.alpha_composite(img, glow)
    draw = ImageDraw.Draw(img)
    
    # Subtle container border
    draw.rounded_rectangle([24, 24, width - 24, height - 24], radius=24, outline=(255, 255, 255, 22), width=1)
    
    # Fonts
    font_bold_path = "C:/Windows/Fonts/segoeuib.ttf"
    font_reg_path = "C:/Windows/Fonts/segoeui.ttf"
    font_mono_path = "C:/Windows/Fonts/consola.ttf"
    
    pill_font = ImageFont.truetype(font_bold_path, 20)
    title_font = ImageFont.truetype(font_bold_path, 56)
    sub_font = ImageFont.truetype(font_reg_path, 24)
    badge_font = ImageFont.truetype(font_bold_path, 18)
    
    # 1. Top Brand Pill
    pill_text = "✦  MYGITSTATS.DEV"
    p_bbox = pill_font.getbbox(pill_text)
    pw = p_bbox[2] - p_bbox[0]
    ph = p_bbox[3] - p_bbox[1]
    
    px = (width - pw) // 2
    py = 75
    pad_x, pad_y = 22, 10
    
    draw.rounded_rectangle(
        [px - pad_x, py - pad_y, px + pw + pad_x, py + ph + pad_y + 4],
        radius=999,
        fill=(99, 102, 241, 35),
        outline=(99, 102, 241, 90),
        width=1
    )
    draw.text((px, py), pill_text, fill=(165, 180, 252), font=pill_font)
    
    # 2. Main Title (Two lines)
    line1 = "Developer Stats Cards"
    line2 = "& GitHub Wrapped"
    
    l1_bbox = title_font.getbbox(line1)
    l1_w = l1_bbox[2] - l1_bbox[0]
    draw.text(((width - l1_w) // 2, 160), line1, fill=(255, 255, 255), font=title_font)
    
    l2_bbox = title_font.getbbox(line2)
    l2_w = l2_bbox[2] - l2_bbox[0]
    draw.text(((width - l2_w) // 2, 235), line2, fill=(196, 181, 253), font=title_font)
    
    # 3. Subtitle
    sub1 = "Turn your code into beautiful city-themed developer cards,"
    sub2 = "performance tier ranks, and shareable annual Wrapped stories."
    
    s1_bbox = sub_font.getbbox(sub1)
    s1_w = s1_bbox[2] - s1_bbox[0]
    draw.text(((width - s1_w) // 2, 335), sub1, fill=(161, 161, 170), font=sub_font)
    
    s2_bbox = sub_font.getbbox(sub2)
    s2_w = s2_bbox[2] - s2_bbox[0]
    draw.text(((width - s2_w) // 2, 375), sub2, fill=(161, 161, 170), font=sub_font)
    
    # 4. Feature Badges at Bottom
    badges = [
        "Mythic • Gold • Bronze",
        "8 City Themes",
        "3x Retina PNG Export",
        "Zero OAuth Needed"
    ]
    
    badge_widths = []
    for b in badges:
        bb = badge_font.getbbox(b)
        badge_widths.append(bb[2] - bb[0] + 36)
        
    gap = 14
    total_w = sum(badge_widths) + gap * (len(badges) - 1)
    start_x = (width - total_w) // 2
    by = 480
    
    cur_x = start_x
    for i, b in enumerate(badges):
        bw = badge_widths[i]
        draw.rounded_rectangle(
            [cur_x, by, cur_x + bw, by + 46],
            radius=12,
            fill=(255, 255, 255, 14),
            outline=(255, 255, 255, 28),
            width=1
        )
        t_bb = badge_font.getbbox(b)
        tw = t_bb[2] - t_bb[0]
        th = t_bb[3] - t_bb[1]
        draw.text((cur_x + (bw - tw) // 2, by + (46 - th) // 2 - 2), b, fill=(228, 228, 231), font=badge_font)
        cur_x += bw + gap

    # Final RGB conversion & optimized save
    final_img = img.convert("RGB")
    out_path = "public/og-image.png"
    final_img.save(out_path, "PNG", optimize=True)
    
    size_kb = os.path.getsize(out_path) / 1024
    print(f"Generated {out_path} ({size_kb:.1f} KB)")

if __name__ == "__main__":
    generate_og_image()

