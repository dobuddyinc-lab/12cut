from __future__ import annotations

import argparse
import math
import re
import subprocess
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
IMAGE_ROOT = ROOT / "assets" / "images" / "generated"
OUT_DIR = ROOT / "assets" / "videos" / "exhibition"

WIDTH = 1080
HEIGHT = 1920
FPS = 24
DEFAULT_DURATION = 60

BLACK = (26, 26, 26)
CREAM = (245, 240, 232)
CREAM_DARK = (237, 230, 216)
WHITE = (253, 251, 247)
RED = (246, 50, 55)
WARM_GRAY = (138, 133, 120)

OUTPUT_MP4 = OUT_DIR / "12cut-home-reel-jp-exhibition-no-qr.mp4"
CONTACT_SHEET = OUT_DIR / "12cut-home-reel-jp-exhibition-contact-sheet.jpg"

FONT_REGULAR_CANDIDATES = [
    "/System/Library/Fonts/ヒラギノ角ゴシック W3.ttc",
    "/System/Library/Fonts/Helvetica.ttc",
]
FONT_BOLD_CANDIDATES = [
    "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc",
    "/System/Library/Fonts/Helvetica.ttc",
]


@dataclass(frozen=True)
class Theme:
    slug: str
    label: str
    caption: str
    accent: tuple[int, int, int]


THEMES = [
    Theme("lover", "LOVER", "ふたりの一日を、12の場面に。", (246, 108, 116)),
    Theme("friends", "FRIENDS", "一緒に笑った時間を、12カットに。", (255, 178, 88)),
    Theme("travel", "TRAVEL", "旅の記憶を、順番に並べる。", (116, 184, 224)),
    Theme("pets", "PETS", "小さな毎日を、そっと残す。", (153, 196, 133)),
    Theme("wedding", "WEDDING", "特別な日を、光の中に。", (218, 170, 170)),
    Theme("idol", "FAN MEMORY", "好きな瞬間を、12カットに。", (190, 166, 230)),
]


def load_font(candidates: list[str], size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for candidate in candidates:
        if Path(candidate).exists():
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


FONT_LOGO = load_font(FONT_BOLD_CANDIDATES, 62)
FONT_LABEL = load_font(FONT_BOLD_CANDIDATES, 24)
FONT_TITLE = load_font(FONT_BOLD_CANDIDATES, 46)
FONT_CAPTION = load_font(FONT_BOLD_CANDIDATES, 54)
FONT_SMALL = load_font(FONT_REGULAR_CANDIDATES, 27)


def ease_in_out(x: float) -> float:
    x = max(0.0, min(1.0, x))
    return x * x * (3 - 2 * x)


def text_size(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.ImageFont) -> tuple[int, int]:
    box = draw.textbbox((0, 0), text, font=font)
    return box[2] - box[0], box[3] - box[1]


def draw_centered_text(
    draw: ImageDraw.ImageDraw,
    xy: tuple[float, float],
    text: str,
    font: ImageFont.ImageFont,
    fill: tuple[int, int, int] | tuple[int, int, int, int],
) -> None:
    w, h = text_size(draw, text, font)
    draw.text((xy[0] - w / 2, xy[1] - h / 2), text, font=font, fill=fill)


def find_theme_images(theme: Theme) -> list[Path]:
    pattern = re.compile(rf"^{re.escape(theme.slug)}-\d{{2}}-\d{{2}}-2k-medium\.png$")
    files = sorted(p for p in (IMAGE_ROOT / theme.slug).glob("*.png") if pattern.match(p.name))
    if len(files) < 12:
        raise FileNotFoundError(f"{theme.slug} needs at least 12 generated images, found {len(files)}")
    return files


class ReelRenderer:
    def __init__(self, duration: int, fps: int) -> None:
        self.duration = duration
        self.fps = fps
        self.segment = duration / len(THEMES)
        self.center_size = (500, 374)
        self.side_size = (360, 269)
        self.image_cache: dict[str, list[Image.Image]] = {}
        self.side_cache: dict[str, list[Image.Image]] = {}
        self.mask_cache: dict[tuple[int, int, int], Image.Image] = {}
        self.background_image = self.make_background()

    def mask(self, size: tuple[int, int], radius: int) -> Image.Image:
        key = (size[0], size[1], radius)
        if key not in self.mask_cache:
            mask = Image.new("L", size, 0)
            ImageDraw.Draw(mask).rounded_rectangle((0, 0, size[0], size[1]), radius=radius, fill=255)
            self.mask_cache[key] = mask
        return self.mask_cache[key]

    def theme_images(self, theme: Theme, side: bool = False) -> list[Image.Image]:
        cache = self.side_cache if side else self.image_cache
        if theme.slug in cache:
            return cache[theme.slug]

        size = self.side_size if side else self.center_size
        images: list[Image.Image] = []
        for file in find_theme_images(theme):
            with Image.open(file) as img:
                thumb = ImageOps.fit_safe(img.convert("RGB"), size)
            images.append(thumb)
        cache[theme.slug] = images
        return images

    def make_background(self) -> Image.Image:
        canvas = Image.new("RGB", (WIDTH, HEIGHT), BLACK)
        draw = ImageDraw.Draw(canvas)
        for y in range(HEIGHT):
            ratio = y / HEIGHT
            warm = 0.5 + 0.5 * math.sin(ratio * math.pi)
            r = int(24 + 12 * ratio + 10 * warm)
            g = int(22 + 10 * ratio + 6 * warm)
            b = int(20 + 8 * ratio + 4 * warm)
            draw.line((0, y, WIDTH, y), fill=(r, g, b))
        return canvas

    def background(self) -> Image.Image:
        return self.background_image.copy()

    def draw_card(
        self,
        base: Image.Image,
        img: Image.Image,
        x: int,
        y: int,
        radius: int,
        opacity: float,
        border: tuple[int, int, int],
        shadow: bool = True,
    ) -> None:
        w, h = img.size
        layer = Image.new("RGBA", (w + 34, h + 34), (0, 0, 0, 0))
        draw = ImageDraw.Draw(layer)
        if shadow:
            shadow_layer = Image.new("RGBA", layer.size, (0, 0, 0, 0))
            sd = ImageDraw.Draw(shadow_layer)
            sd.rounded_rectangle((14, 18, w + 20, h + 24), radius=radius + 8, fill=(0, 0, 0, int(80 * opacity)))
            shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(10))
            layer.alpha_composite(shadow_layer)

        draw.rounded_rectangle((8, 8, w + 26, h + 26), radius=radius + 10, fill=(255, 255, 255, int(235 * opacity)))
        draw.rounded_rectangle((11, 11, w + 23, h + 23), radius=radius + 7, outline=border + (int(210 * opacity),), width=3)

        card = Image.new("RGBA", img.size, (0, 0, 0, 0))
        card.paste(img.convert("RGBA"), (0, 0), self.mask(img.size, radius))
        if opacity < 0.99:
            alpha = card.getchannel("A").point(lambda value: int(value * opacity))
            card.putalpha(alpha)
        layer.alpha_composite(card, (17, 17))
        base.paste(layer, (x - 17, y - 17), layer)

    def draw_reel(self, base: Image.Image, theme: Theme, t: float, alpha: float = 1.0) -> None:
        overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
        center_images = self.theme_images(theme)
        side_images = self.theme_images(theme, side=True)
        local_t = t % self.segment
        phase = t / self.segment

        # Side reels establish the "always rolling" home film-reel impression.
        for col, x in enumerate((-118, 838)):
            tile_h = self.side_size[1] + 30
            speed = 62 + col * 12
            offset = (local_t * speed + col * tile_h * 0.45) % tile_h
            first_row = -2
            for row in range(first_row, 9):
                y = int(row * tile_h - offset)
                idx = int((row + math.floor((local_t * speed) / tile_h) + col * 9 + phase * 7)) % len(side_images)
                drift = int(10 * math.sin((local_t + row) * 0.8 + col))
                self.draw_card(
                    overlay,
                    side_images[idx],
                    x + drift,
                    y,
                    radius=26,
                    opacity=0.48 * alpha,
                    border=CREAM_DARK,
                    shadow=False,
                )

        # Center reel is intentionally large, so the generated images are readable on a monitor.
        tile_h = self.center_size[1] + 38
        speed = 88
        offset = (local_t * speed) % tile_h
        base_index = math.floor((local_t * speed) / tile_h)
        x = 290
        for row in range(-2, 7):
            y = int(row * tile_h - offset)
            idx = int((base_index + row + phase * 11)) % len(center_images)
            selected = row == 2
            self.draw_card(
                overlay,
                center_images[idx],
                x,
                y,
                radius=34,
                opacity=(0.96 if selected else 0.84) * alpha,
                border=theme.accent if selected else CREAM_DARK,
                shadow=True,
            )

        if alpha < 0.99:
            overlay.putalpha(overlay.getchannel("A").point(lambda value: int(value * alpha)))
        base.paste(overlay.convert("RGB"), (0, 0), overlay)

    def draw_caption(self, base: Image.Image, theme: Theme, segment_progress: float, t: float) -> None:
        draw = ImageDraw.Draw(base, "RGBA")
        intro_alpha = 1.0 - ease_in_out(max(0.0, min(1.0, (segment_progress - 0.28) / 0.22)))
        end_alpha = ease_in_out(max(0.0, min(1.0, (segment_progress - 0.78) / 0.18)))
        alpha = max(intro_alpha, end_alpha * 0.75)
        if alpha <= 0.02:
            return

        box_alpha = int(218 * alpha)
        text_alpha = int(255 * alpha)
        panel_y = 1348
        draw.rounded_rectangle((76, panel_y, WIDTH - 76, panel_y + 258), radius=46, fill=(253, 251, 247, box_alpha))
        draw.rounded_rectangle((76, panel_y, WIDTH - 76, panel_y + 258), radius=46, outline=theme.accent + (int(175 * alpha),), width=2)
        draw.text((126, panel_y + 50), theme.label, font=FONT_LABEL, fill=theme.accent + (text_alpha,))
        draw.text((126, panel_y + 91), theme.caption, font=FONT_CAPTION, fill=(26, 26, 26, text_alpha))
        draw.text((126, panel_y + 172), "12の思い出が、ひとつの物語になる。", font=FONT_SMALL, fill=(92, 86, 80, int(230 * alpha)))

        dot_x = WIDTH - 168
        dot_y = panel_y + 86
        for i in range(12):
            angle = -math.pi / 2 + (math.pi * 2 * i / 12) + t * 0.2
            r = 44
            fill = theme.accent if i == int((segment_progress * 12) % 12) else WARM_GRAY
            draw.ellipse(
                (
                    dot_x + math.cos(angle) * r - 5,
                    dot_y + math.sin(angle) * r - 5,
                    dot_x + math.cos(angle) * r + 5,
                    dot_y + math.sin(angle) * r + 5,
                ),
                fill=fill + (text_alpha,),
            )

    def draw_brand(self, base: Image.Image, t: float, frame: int) -> None:
        draw = ImageDraw.Draw(base, "RGBA")
        draw.text((70, 70), "12CUT", font=FONT_LOGO, fill=WHITE + (245,))
        draw.rounded_rectangle((70, 151, 238, 158), radius=4, fill=RED + (235,))
        draw.text((70, 183), "MEMORIES IN 12 CUTS", font=FONT_LABEL, fill=(245, 240, 232, 210))

    def render_frame(self, frame: int) -> Image.Image:
        t = frame / self.fps
        segment_pos = (t % self.duration) / self.segment
        theme_index = int(segment_pos) % len(THEMES)
        theme_progress = segment_pos - int(segment_pos)
        theme = THEMES[theme_index]
        next_theme = THEMES[(theme_index + 1) % len(THEMES)]

        base = self.background()
        self.draw_reel(base, theme, t, alpha=1.0)

        transition_alpha = ease_in_out(max(0.0, min(1.0, (theme_progress - 0.88) / 0.12)))
        if transition_alpha > 0.01:
            self.draw_reel(base, next_theme, t + self.segment, alpha=transition_alpha)

        self.draw_caption(base, theme if transition_alpha < 0.5 else next_theme, theme_progress, t)
        self.draw_brand(base, t, frame)
        return base


class ImageOps:
    @staticmethod
    def fit_safe(img: Image.Image, size: tuple[int, int]) -> Image.Image:
        src_ratio = img.width / img.height
        dst_ratio = size[0] / size[1]
        if src_ratio > dst_ratio:
            new_h = size[1]
            new_w = int(new_h * src_ratio)
        else:
            new_w = size[0]
            new_h = int(new_w / src_ratio)
        resized = img.resize((new_w, new_h), Image.Resampling.LANCZOS)
        left = (new_w - size[0]) // 2
        top = (new_h - size[1]) // 2
        return resized.crop((left, top, left + size[0], top + size[1]))


def write_video(renderer: ReelRenderer, output: Path) -> None:
    total_frames = renderer.duration * renderer.fps
    cmd = [
        "ffmpeg",
        "-y",
        "-f",
        "rawvideo",
        "-vcodec",
        "rawvideo",
        "-pix_fmt",
        "rgb24",
        "-s",
        f"{WIDTH}x{HEIGHT}",
        "-r",
        str(renderer.fps),
        "-i",
        "-",
        "-an",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-crf",
        "18",
        "-preset",
        "medium",
        "-movflags",
        "+faststart",
        str(output),
    ]
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    assert process.stdin is not None
    for frame in range(total_frames):
        img = renderer.render_frame(frame)
        process.stdin.write(img.tobytes())
        if frame % (renderer.fps * 5) == 0:
            print(f"rendered {frame}/{total_frames}", flush=True)
    process.stdin.close()
    if process.wait() != 0:
        raise RuntimeError("ffmpeg failed while writing exhibition reel video")


def write_contact_sheet(renderer: ReelRenderer, output: Path) -> None:
    cols = 4
    rows = 3
    thumb = (270, 480)
    sheet = Image.new("RGB", (cols * thumb[0], rows * thumb[1]), (20, 20, 20))
    total = cols * rows
    for i in range(total):
        frame = int((renderer.duration * renderer.fps - 1) * i / (total - 1))
        img = renderer.render_frame(frame).resize(thumb, Image.Resampling.LANCZOS)
        sheet.paste(img, ((i % cols) * thumb[0], (i // cols) * thumb[1]))
    sheet.save(output, quality=92)


def main() -> None:
    parser = argparse.ArgumentParser(description="Render 12CUT Japanese exhibition home reel video.")
    parser.add_argument("--duration", type=int, default=DEFAULT_DURATION)
    parser.add_argument("--fps", type=int, default=FPS)
    parser.add_argument("--output", type=Path, default=OUTPUT_MP4)
    parser.add_argument("--contact-sheet", type=Path, default=CONTACT_SHEET)
    args = parser.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    renderer = ReelRenderer(duration=args.duration, fps=args.fps)

    # Eagerly validate inputs before ffmpeg starts.
    for theme in THEMES:
        count = len(find_theme_images(theme))
        print(f"{theme.slug}: {count} images", flush=True)

    write_video(renderer, args.output)
    write_contact_sheet(renderer, args.contact_sheet)
    print(f"wrote {args.output}")
    print(f"wrote {args.contact_sheet}")


if __name__ == "__main__":
    main()
