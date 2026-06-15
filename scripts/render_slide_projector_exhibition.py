from __future__ import annotations

import array
import subprocess
import unicodedata
import wave
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
MOUNT_DIR = ROOT / "assets" / "마운트용"
VIDEO_DIR = ROOT / "assets" / "videos" / "exhibition"
VIDEO_DIR.mkdir(parents=True, exist_ok=True)

REFERENCE_VIDEO = MOUNT_DIR / "KakaoTalk_Video_2026-06-14-14-59-56.mp4"
OUTPUT_SAMPLE = VIDEO_DIR / "12cut-slide-projector-sample-set1.mp4"
OUTPUT_SAMPLE_SILENT = VIDEO_DIR / "12cut-slide-projector-sample-set1-silent.mp4"
CONTACT_SAMPLE = VIDEO_DIR / "12cut-slide-projector-sample-set1-contact-sheet.jpg"
OUTPUT_ROLLING = VIDEO_DIR / "12cut-slide-projector-10set-rolling.mp4"
OUTPUT_ROLLING_SILENT = VIDEO_DIR / "12cut-slide-projector-10set-rolling-silent.mp4"
CONTACT_ROLLING = VIDEO_DIR / "12cut-slide-projector-10set-rolling-contact-sheet.jpg"
SFX_PATH = VIDEO_DIR / "slide-projector-switch-sfx.wav"

WIDTH = 1080
HEIGHT = 1920
FPS = 24
SLIDE_SECONDS = 1.75
FINAL_SECONDS = 3.2
BLINK_SECONDS = 0.16
SELECTED_SLIDES = [1, 2, 3, 5, 7, 10, 12]
SET_NUMBERS = list(range(1, 11))
IMAGE_CACHE: dict[tuple[str, str], Image.Image] = {}


def run(cmd: list[str]) -> None:
    print(" ".join(str(part) for part in cmd), flush=True)
    subprocess.run(cmd, check=True)


def fit_image(path: Path, max_size: tuple[int, int]) -> Image.Image:
    cache_key = (str(path), f"slide-{max_size[0]}x{max_size[1]}")
    if cache_key in IMAGE_CACHE:
        return IMAGE_CACHE[cache_key]
    image = Image.open(path).convert("RGB")
    image.thumbnail(max_size, Image.Resampling.LANCZOS)
    IMAGE_CACHE[cache_key] = image
    return image


def find_slide_path(set_dir: Path, number: int) -> Path:
    for extension in (".png", ".jpg", ".jpeg"):
        path = set_dir / f"{number}{extension}"
        if path.exists():
            return path
    raise FileNotFoundError(f"missing slide {number} in {set_dir}")


def find_reel_path(set_dir: Path) -> Path:
    for path in set_dir.iterdir():
        name = unicodedata.normalize("NFC", path.name)
        if "원형" in name or "12컷" in name:
            return path
    for path in sorted(set_dir.iterdir()):
        if path.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
            continue
        if path.stem.isdigit():
            continue
        return path
    raise FileNotFoundError(f"missing reel image in {set_dir}")


def fit_reel_image(path: Path, max_size: tuple[int, int]) -> Image.Image:
    cache_key = (str(path), f"reel-{max_size[0]}x{max_size[1]}")
    if cache_key in IMAGE_CACHE:
        return IMAGE_CACHE[cache_key]
    image = Image.open(path).convert("RGB")
    width, height = image.size

    # The reel source includes white side margins. Crop them so only the
    # dark reel artwork remains on the black exhibition background.
    pixels = image.load()
    xs = []
    for x in range(width):
        column_has_content = False
        for y in range(height):
            r, g, b = pixels[x, y]
            if not (r > 238 and g > 238 and b > 238):
                column_has_content = True
                break
        if column_has_content:
            xs.append(x)

    if xs:
        left = min(width, max(0, min(xs) + 8))
        right = max(left + 1, min(width, max(xs) - 8))
        image = image.crop((left, 0, right, height))

    # Push near-black source pixels to true black so the artwork sits cleanly
    # on a #000 canvas instead of reading as dark gray.
    image_width, image_height = image.size
    edge_mask_width = min(28, image_width // 12)
    pixels = image.load()
    for x in list(range(edge_mask_width)) + list(range(image_width - edge_mask_width, image_width)):
        for y in range(image_height):
            pixels[x, y] = (0, 0, 0)

    pixels = image.load()
    image_width, image_height = image.size
    for x in range(image_width):
        for y in range(image_height):
            r, g, b = pixels[x, y]
            if r < 38 and g < 38 and b < 38:
                pixels[x, y] = (0, 0, 0)
    image.thumbnail(max_size, Image.Resampling.LANCZOS)
    IMAGE_CACHE[cache_key] = image
    return image


def paste_center(canvas: Image.Image, image: Image.Image, center: tuple[int, int]) -> tuple[int, int, int, int]:
    x = int(center[0] - image.width / 2)
    y = int(center[1] - image.height / 2)
    canvas.paste(image, (x, y), image if image.mode == "RGBA" else None)
    return x, y, x + image.width, y + image.height


def render_frame(set_dir: Path, frame_index: int, blink_at_start: bool = False) -> Image.Image:
    slide_total_frames = int(SLIDE_SECONDS * FPS)
    total_slide_frames = slide_total_frames * len(SELECTED_SLIDES)
    blink_frames = max(1, int(BLINK_SECONDS * FPS))
    canvas = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))

    if frame_index < total_slide_frames:
        slide_index = frame_index // slide_total_frames
        local_frame = frame_index % slide_total_frames
        if blink_at_start and slide_index == 0 and local_frame < blink_frames:
            return canvas
        if slide_index > 0 and local_frame < blink_frames:
            return canvas
        slide_path = find_slide_path(set_dir, SELECTED_SLIDES[slide_index])
        image = fit_image(slide_path, (960, 960))
        paste_center(canvas, image, (WIDTH // 2, HEIGHT // 2))
    else:
        local_frame = frame_index - total_slide_frames
        if local_frame < blink_frames:
            return canvas
        reel_path = find_reel_path(set_dir)
        image = fit_reel_image(reel_path, (1040, 1040))
        paste_center(canvas, image, (WIDTH // 2, HEIGHT // 2))
    return canvas


def render_video(set_numbers: list[int], output_silent: Path, label: str) -> None:
    set_total_frames = int((SLIDE_SECONDS * len(SELECTED_SLIDES) + FINAL_SECONDS) * FPS)
    total_frames = set_total_frames * len(set_numbers)
    cmd = [
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
        str(output_silent),
    ]
    proc = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    assert proc.stdin is not None
    for frame_index in range(total_frames):
        set_index = frame_index // set_total_frames
        local_frame = frame_index % set_total_frames
        set_dir = MOUNT_DIR / str(set_numbers[set_index])
        frame = render_frame(set_dir, local_frame, blink_at_start=set_index > 0)
        proc.stdin.write(frame.tobytes())
        if frame_index % (FPS * 5) == 0:
            print(f"rendered {label} {frame_index}/{total_frames}", flush=True)
    proc.stdin.close()
    code = proc.wait()
    if code:
        raise SystemExit(code)


def render_sample() -> None:
    render_video([1], OUTPUT_SAMPLE_SILENT, "sample")


def extract_sfx() -> None:
    run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-ss",
            "8.05",
            "-t",
            "0.55",
            "-i",
            str(REFERENCE_VIDEO),
            "-vn",
            "-ac",
            "2",
            "-ar",
            "44100",
            "-af",
            "afade=t=in:d=0.015,afade=t=out:st=0.46:d=0.09,volume=1.7",
            str(SFX_PATH),
        ]
    )


def add_audio(output_silent: Path, output: Path, set_count: int) -> None:
    set_duration = SLIDE_SECONDS * len(SELECTED_SLIDES) + FINAL_SECONDS
    total_duration = set_duration * set_count
    sound_times = []
    for set_index in range(set_count):
        set_start = set_duration * set_index
        if set_index > 0:
            sound_times.append(set_start)
        sound_times.extend(set_start + SLIDE_SECONDS * i for i in range(1, len(SELECTED_SLIDES) + 1))

    audio_track = output.with_suffix(".wav")
    build_audio_track(audio_track, total_duration, sound_times)
    run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(output_silent),
            "-i",
            str(audio_track),
            "-map",
            "0:v",
            "-map",
            "1:a",
            "-c:v",
            "copy",
            "-c:a",
            "aac",
            "-shortest",
            "-movflags",
            "+faststart",
            str(output),
        ]
    )


def build_audio_track(output_audio: Path, total_duration: float, sound_times: list[float]) -> None:
    with wave.open(str(SFX_PATH), "rb") as source:
        channels = source.getnchannels()
        sample_width = source.getsampwidth()
        sample_rate = source.getframerate()
        if channels != 2 or sample_width != 2:
            raise ValueError("SFX must be stereo 16-bit PCM")
        sfx = array.array("h")
        sfx.frombytes(source.readframes(source.getnframes()))

    total_frames = int(total_duration * sample_rate)
    timeline = array.array("h", [0]) * (total_frames * channels)

    for second in sound_times:
        start = int(second * sample_rate) * channels
        for index, sample in enumerate(sfx):
            timeline_index = start + index
            if timeline_index >= len(timeline):
                break
            mixed = timeline[timeline_index] + sample
            timeline[timeline_index] = max(-32768, min(32767, mixed))

    with wave.open(str(output_audio), "wb") as target:
        target.setnchannels(channels)
        target.setsampwidth(sample_width)
        target.setframerate(sample_rate)
        target.writeframes(timeline.tobytes())


def make_contact_sheet(output: Path, contact: Path, fps_filter: str, tile: str) -> None:
    run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(output),
            "-vf",
            f"{fps_filter},scale=216:-1,tile={tile}",
            "-frames:v",
            "1",
            str(contact),
        ]
    )


def main() -> None:
    extract_sfx()
    render_sample()
    add_audio(OUTPUT_SAMPLE_SILENT, OUTPUT_SAMPLE, 1)
    make_contact_sheet(OUTPUT_SAMPLE, CONTACT_SAMPLE, "fps=1/1.6", "5x2")
    render_video(SET_NUMBERS, OUTPUT_ROLLING_SILENT, "rolling")
    add_audio(OUTPUT_ROLLING_SILENT, OUTPUT_ROLLING, len(SET_NUMBERS))
    make_contact_sheet(OUTPUT_ROLLING, CONTACT_ROLLING, "fps=1/12", "5x3")
    print(f"wrote {OUTPUT_SAMPLE}")
    print(f"wrote {CONTACT_SAMPLE}")
    print(f"wrote {OUTPUT_ROLLING}")
    print(f"wrote {CONTACT_ROLLING}")


if __name__ == "__main__":
    main()
