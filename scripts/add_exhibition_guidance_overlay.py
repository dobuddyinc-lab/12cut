from __future__ import annotations

import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
VIDEO_DIR = ROOT / "assets" / "videos" / "exhibition"
INPUT = VIDEO_DIR / "12cut-exhibition-actual-service-5theme-rolling.mp4"
OUTPUT = VIDEO_DIR / "12cut-exhibition-actual-service-5theme-guided.mp4"
CONTACT = VIDEO_DIR / "12cut-exhibition-actual-service-5theme-guided-contact-sheet.jpg"

WIDTH = 1080
HEIGHT = 1920
FPS = 24
SEGMENT_SECONDS = 43.0
TOTAL_SECONDS = 215.0
TOTAL_FRAMES = int(TOTAL_SECONDS * FPS)
PAUSE_SECONDS = 2.0
PAUSE_FRAMES = int(PAUSE_SECONDS * FPS)
FONT_BOLD = "/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc"

font_stage_label = ImageFont.truetype(FONT_BOLD, 94)
font_stage_hint = ImageFont.truetype(FONT_BOLD, 46)


STAGES = [
    {
        "start": 0.0,
        "end": 4.3,
        "label": "ガイドを見る",
        "hint": "流れを確認",
    },
    {
        "start": 4.3,
        "end": 13.5,
        "label": "写真を選ぶ",
        "hint": "12枚を選択",
    },
    {
        "start": 13.5,
        "end": 28.6,
        "label": "整える",
        "hint": "順番と切り抜き",
    },
    {
        "start": 28.6,
        "end": 38.4,
        "label": "プレビュー",
        "hint": "完成イメージを確認",
    },
    {
        "start": 38.4,
        "end": 43.0,
        "label": "注文へ",
        "hint": "そのまま購入",
    },
]


# Cursor waypoints measured from the actual recording (1080x1920 space).
# Each tuple is (time_in_segment, tip_x, tip_y) and the tip rests on the
# real trigger: buttons, photo-select circles, or the trimming rectangle.
CURSOR_WAYPOINTS = [
    # G: STORY GUIDE sheet -> close X button.
    (0.6, 928, 1158),
    (3.9, 928, 1158),
    # S: first empty slide thumbnail (tooltip target), tap opens picker.
    (4.6, 268, 538),
    (6.9, 268, 538),
    # S: photo picker, selection circle of each photo in order.
    (7.4, 345, 285),
    (7.85, 641, 285),
    (8.3, 936, 285),
    (8.75, 345, 579),
    (9.2, 641, 579),
    (9.65, 936, 579),
    (10.1, 345, 872),
    (10.55, 641, 872),
    (11.0, 936, 872),
    (11.45, 345, 1166),
    (11.9, 641, 1166),
    (12.35, 936, 1166),
    # S: confirm with the 追加 button (top right) before the picker closes.
    (12.6, 883, 188),
    (12.95, 883, 188),
    # C: 順番を選択 button, then the same slot becomes トリミング button.
    (14.2, 750, 1817),
    (20.9, 750, 1817),
    # C: trimming line rectangle (bottom-right red handle, follows zoom).
    (21.7, 834, 1088),
    (26.6, 857, 1119),
    # C: ストーリーをプレビュー button.
    (27.5, 744, 1817),
    (28.5, 744, 1817),
    # P: preview wheel (touch-rotate area on the wheel itself).
    (29.5, 870, 770),
    (32.6, 870, 770),
    # P: fullscreen view -> 閉じる button.
    (33.6, 538, 1817),
    (37.4, 538, 1817),
    # P: ストーリーを保存 button.
    (37.9, 750, 1817),
    (38.3, 750, 1817),
    # O: completion screen -> 今すぐ決済する CTA.
    (39.2, 538, 1817),
    (42.9, 538, 1817),
]


def ease(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3 - 2 * value)


def lerp(a: float, b: float, p: float) -> float:
    return a + (b - a) * ease(p)


def active_stage(local_t: float) -> dict:
    for stage in STAGES:
        if stage["start"] <= local_t < stage["end"]:
            return stage
    return STAGES[-1]


def draw_text_center(draw: ImageDraw.ImageDraw, xy: tuple[float, float], text: str, font: ImageFont.FreeTypeFont, fill) -> None:
    bbox = draw.textbbox((0, 0), text, font=font)
    draw.text((xy[0] - (bbox[2] - bbox[0]) / 2, xy[1] - (bbox[3] - bbox[1]) / 2), text, font=font, fill=fill)


def draw_stage_transition(frame: Image.Image, stage: dict, pause_index: int) -> Image.Image:
    progress = pause_index / max(1, PAUSE_FRAMES - 1)
    fade = min(1.0, progress / 0.22, (1.0 - progress) / 0.22)
    dim = int(154 * fade)

    img = frame.convert("RGBA")
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, dim))
    draw = ImageDraw.Draw(layer)

    cx = WIDTH / 2
    cy = HEIGHT / 2 - 40
    draw_text_center(draw, (cx, cy + 10), stage["label"], font_stage_label, (255, 255, 255, int(255 * fade)))
    draw_text_center(draw, (cx, cy + 104), stage["hint"], font_stage_hint, (255, 255, 255, int(224 * fade)))
    img.alpha_composite(layer)
    return img.convert("RGB")


def cursor_position(local_t: float) -> tuple[float, float, bool]:
    first = CURSOR_WAYPOINTS[0]
    if local_t < first[0]:
        return first[1], first[2], False

    for (t0, x0, y0), (t1, x1, y1) in zip(CURSOR_WAYPOINTS, CURSOR_WAYPOINTS[1:]):
        if t0 <= local_t < t1:
            p = (local_t - t0) / (t1 - t0)
            return lerp(x0, x1, p), lerp(y0, y1, p), True

    last = CURSOR_WAYPOINTS[-1]
    return last[1], last[2], True


def draw_cursor(draw: ImageDraw.ImageDraw, x: float, y: float) -> None:
    scale = 1.0
    pts = [
        (x, y),
        (x + 34 * scale, y + 95 * scale),
        (x + 51 * scale, y + 63 * scale),
        (x + 91 * scale, y + 101 * scale),
        (x + 112 * scale, y + 79 * scale),
        (x + 72 * scale, y + 42 * scale),
        (x + 108 * scale, y + 29 * scale),
    ]
    shadow = [(px + 5, py + 6) for px, py in pts]
    draw.polygon(shadow, fill=(0, 0, 0, 95))
    draw.polygon(pts, fill=(255, 255, 255, 255), outline=(26, 26, 26, 255))
    draw.line(pts + [pts[0]], fill=(26, 26, 26, 255), width=3)


def overlay_frame(frame: Image.Image, seconds: float) -> Image.Image:
    local_t = seconds % SEGMENT_SECONDS

    img = frame.convert("RGBA")
    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    x, y, visible = cursor_position(local_t)
    if visible:
        draw_cursor(draw, x, y)

    img.alpha_composite(layer)
    return img.convert("RGB")


def transition_stage_for_frame(index: int) -> dict | None:
    segment_frames = int(SEGMENT_SECONDS * FPS)
    local_index = index % segment_frames
    for stage in STAGES:
        if local_index == round(stage["start"] * FPS):
            return stage
    return None


def run() -> None:
    if not INPUT.exists():
        raise FileNotFoundError(INPUT)

    decode = subprocess.Popen(
        [
            "ffmpeg",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(INPUT),
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "-",
        ],
        stdout=subprocess.PIPE,
    )
    encode = subprocess.Popen(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-f",
            "rawvideo",
            "-pix_fmt",
            "rgb24",
            "-s",
            f"{WIDTH}x{HEIGHT}",
            "-r",
            str(FPS),
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
            str(OUTPUT),
        ],
        stdin=subprocess.PIPE,
    )
    assert decode.stdout is not None
    assert encode.stdin is not None

    frame_size = WIDTH * HEIGHT * 3
    written_frames = 0
    for index in range(TOTAL_FRAMES):
        raw = decode.stdout.read(frame_size)
        if len(raw) < frame_size:
            break
        frame = Image.frombytes("RGB", (WIDTH, HEIGHT), raw)
        transition_stage = transition_stage_for_frame(index)
        if transition_stage is not None:
            for pause_index in range(PAUSE_FRAMES):
                transition = draw_stage_transition(frame, transition_stage, pause_index)
                encode.stdin.write(transition.tobytes())
                written_frames += 1
        guided = overlay_frame(frame, index / FPS)
        encode.stdin.write(guided.tobytes())
        written_frames += 1
        if index % (FPS * 10) == 0:
            print(f"guided {index}/{TOTAL_FRAMES} -> {written_frames}", flush=True)

    encode.stdin.close()
    encode_code = encode.wait()
    decode_code = decode.wait()
    if encode_code != 0:
        raise SystemExit(encode_code)
    if decode_code != 0:
        raise SystemExit(decode_code)

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(OUTPUT),
            "-vf",
            "fps=1/10,scale=270:-1,tile=5x5",
            "-frames:v",
            "1",
            str(CONTACT),
        ],
        check=True,
    )
    print(f"wrote {OUTPUT}")
    print(f"wrote {CONTACT}")


if __name__ == "__main__":
    run()
