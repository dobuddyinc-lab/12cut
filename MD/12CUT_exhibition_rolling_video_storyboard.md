# 12CUT Exhibition Rolling Video Storyboard

## Purpose

- Use case: Japanese exhibition display on a vertical swing monitor
- Video role: acquisition + activation; make visitors understand what 12CUT is and scan the QR to visit the landing page
- Destination: `https://12cut.co.kr/`
- Landing language: Japanese first. The current 12CUT `custom.js` default-language logic sets `localStorage.$mylang='ja'` when no prior visitor language is stored.
- On-screen language: Japanese only
- Korean text: review notes only, never render in the video

## Core Direction

Use Option C: hybrid product process + emotional completion.

The film should not look like a screen recording tutorial. It should show a clear making flow:

1. Choose a theme on a smartphone.
2. Add 12 memories.
3. Customize the crop/order/story.
4. Complete the 12CUT slide.
5. Keep QR visible so visitors can scan at any point.

## Format

- Aspect ratio: vertical 9:16
- Recommended resolution: 1080 x 1920 or higher
- Loop: seamless 5-theme rolling loop
- Total length: 60-75 seconds
- Theme length: 12-15 seconds each
- Audio: optional; assume exhibition playback may be muted
- Text size: readable from distance; short phrases only
- QR: fixed bottom panel, same position throughout the full loop

## Fixed QR Panel

The QR panel must remain visible during the entire video. Exhibition visitors need time to notice the screen, take out their phone, focus the camera, and scan.

### Recommended Layout

```text
[70-75%] Theme process film
[10-15%] Step or theme caption
[15%] Fixed QR panel
```

### QR Copy

| Screen Japanese | Korean meaning for review |
|---|---|
| 12カットをもっと見る | 12컷 더 보기 / 자세히 보기 |
| スマホで読み取る | 스마트폰으로 스캔하기 |

Do not use `今すぐ作る` for this QR because the destination is the home landing page, not a direct editor start. `12カットをもっと見る` is more honest and better aligned with the landing flow.

### QR Panel Visual Rules

- Use a white or warm-white solid panel behind the QR for scan reliability.
- Keep QR contrast high, black on white.
- Do not place QR directly over moving footage.
- Keep QR size large enough for a swing monitor viewing distance.
- Keep the CTA text and QR fixed to prevent visitors from missing the scan window.

## Common Process Captions

Use these as recurring step captions across all five themes.

| Step | Screen Japanese | Korean meaning for review |
|---|---|---|
| 1. Choose | テーマを選ぶ | 테마를 고르다 |
| 2. Add | 思い出を入れる | 추억을 담다 |
| 3. Customize | 自分らしく整える | 나답게 다듬다 |
| 4. Complete | 12カットで完成 | 12컷으로 완성 |

## Five Theme End Captions

Each theme uses the same process flow, but the final emotional caption changes by theme.

| Theme | Screen Japanese | Korean meaning for review |
|---|---|---|
| Lover | ふたりの一日を、12の場面に。 | 둘의 하루를 12개의 장면으로 |
| Friends | 一緒に笑った時間を、12カットに。 | 함께 웃었던 시간을 12컷으로 |
| Family | 大切な時間を、そっと残す。 | 소중한 시간을 살며시 남기다 |
| Travel | 旅の記憶を、順番に並べる。 | 여행의 기억을 순서대로 배열하다 |
| Self Archive | わたしらしい瞬間を、集める。 | 나다운 순간을 모으다 |

## Master Loop Timeline

### 0-15s: Lover

| Time | Visual | Screen Japanese | Korean meaning for review |
|---|---|---|---|
| 0-3s | Smartphone in hand. User taps a warm couple-themed 12CUT card. | テーマを選ぶ | 테마를 고르다 |
| 3-7s | 12 photo slots fill with date, hand, cafe, street, birthday images. | 思い出を入れる | 추억을 담다 |
| 7-11s | User adjusts crop and order. A selected image gently snaps into place. | 自分らしく整える | 나답게 다듬다 |
| 11-15s | Completed slide expands into a glowing 12CUT result. | ふたりの一日を、12の場面に。 | 둘의 하루를 12개의 장면으로 |

Mood: warm golden light, cream, soft coral, quiet romantic intimacy.

### 15-30s: Friends

| Time | Visual | Screen Japanese | Korean meaning for review |
|---|---|---|---|
| 15-18s | User selects a friends/trip/birthday theme card. | テーマを選ぶ | 테마를 고르다 |
| 18-22s | Multiple fun photos drop into the 12 slots quickly. | 思い出を入れる | 추억을 담다 |
| 22-26s | User rearranges the order; one photo is swapped by drag gesture. | 自分らしく整える | 나답게 다듬다 |
| 26-30s | Final 12CUT slide appears with bright, playful energy. | 一緒に笑った時間を、12カットに。 | 함께 웃었던 시간을 12컷으로 |

Mood: light, playful, quick cuts, pastel accents, laughter.

### 30-45s: Family

| Time | Visual | Screen Japanese | Korean meaning for review |
|---|---|---|---|
| 30-33s | User selects a family/pet memory theme. | テーマを選ぶ | 테마를 고르다 |
| 33-37s | Gentle home photos fill the slots: child, parent, pet, small daily moments. | 思い出を入れる | 추억을 담다 |
| 37-41s | User slowly crops a meaningful close-up; movement is calmer. | 自分らしく整える | 나답게 다듬다 |
| 41-45s | Finished slide appears in soft light, held like a keepsake. | 大切な時間を、そっと残す。 | 소중한 시간을 살며시 남기다 |

Mood: beige, natural light, quiet trust, warm family archive.

### 45-60s: Travel

| Time | Visual | Screen Japanese | Korean meaning for review |
|---|---|---|---|
| 45-48s | User selects a travel theme card. | テーマを選ぶ | 테마를 고르다 |
| 48-52s | Travel photos fill the 12 slots: station, street, sea, ticket, skyline. | 思い出を入れる | 추억을 담다 |
| 52-56s | User rearranges photos to make a route-like sequence. | 自分らしく整える | 나답게 다듬다 |
| 56-60s | Final result becomes a chronological travel memory slide. | 旅の記憶を、順番に並べる。 | 여행의 기억을 순서대로 배열하다 |

Mood: airy, sky blue, film grain, movement, discovery.

### 60-75s: Self Archive

| Time | Visual | Screen Japanese | Korean meaning for review |
|---|---|---|---|
| 60-63s | User selects a personal archive theme. | テーマを選ぶ | 테마를 고르다 |
| 63-67s | Daily photos, room details, objects, selfies, favorite places fill the slots. | 思い出を入れる | 추억을 담다 |
| 67-71s | User adjusts crop, order, and final mood. | 自分らしく整える | 나답게 다듬다 |
| 71-75s | Final 12CUT slide holds on a clean brand end frame and loops back. | わたしらしい瞬間を、集める。 | 나다운 순간을 모으다 |

Mood: minimal, white, black, subtle red accent, personal collection.

## Seamless Loop Rule

The final Self Archive frame should transition back into the first Lover smartphone theme-selection frame.

Recommended loop device:

- End on a close-up of the smartphone showing the completed 12CUT.
- The completed card slides upward.
- The theme-selection grid appears again.
- Lover theme card is already near the same screen position as the first frame.

Avoid a black fade because it makes the exhibition loop feel like it stopped.

## Smartphone UI Direction

The smartphone UI does not need to be fully readable. From a distance, visitors only need to understand the action.

Show large visual actions:

- Theme card selection
- 12 empty slots filling with photos
- One drag-to-reorder gesture
- One crop/zoom adjustment
- Completed 12CUT preview

Avoid:

- Dense editor UI
- Small explanatory labels
- Long Japanese text
- Real system keyboard
- Too many buttons competing with QR

## Product/Brand Motion Direction

- Keep motion soft and precise.
- Use snap, slide, and gentle zoom rather than flashy transitions.
- Use `#F63237` only as a small accent: selected state, active dot, completed state, or 12CUT brand point.
- Make the viewer/result feel physical, not just digital.

## Production Prompt Base

Use this as a base prompt for AI video generation or motion direction. Replace `[THEME]`, `[MOOD]`, and `[FINAL_CAPTION]`.

```text
Vertical 9:16 exhibition video for 12CUT, a warm film slide viewer memory product. A person uses a smartphone to choose a [THEME] 12CUT theme, add 12 memory photos, customize crop and order, and complete a beautiful 12CUT slide. Hybrid product-process and emotional lifestyle film. Large readable Japanese captions only: テーマを選ぶ, 思い出を入れる, 自分らしく整える, and final caption [FINAL_CAPTION]. Keep a fixed clean white QR panel at the bottom throughout the video with Japanese CTA: 12カットをもっと見る / スマホで読み取る. Warm cinematic lighting, Kodak Portra 400 film look, soft highlights, shallow depth of field, modern Japanese exhibition mood, premium but friendly, minimal UI, no Korean text, no English text except the 12CUT brand name, no clutter, no aggressive sales tone. Seamless loop, no black fade.
```

## Theme Prompt Modifiers

### Lover

```text
[THEME] = couple memory
[MOOD] = warm golden-hour couple date, cafe, birthday, soft hands, modest affection, cream and coral tone
[FINAL_CAPTION] = ふたりの一日を、12の場面に。
```

### Friends

```text
[THEME] = friends memory
[MOOD] = playful friends trip and birthday memories, candid laughter, bright pastel tone, quick but clean rhythm
[FINAL_CAPTION] = 一緒に笑った時間を、12カットに。
```

### Family

```text
[THEME] = family memory
[MOOD] = calm family and pet memories at home, natural light, beige tone, trust and tenderness
[FINAL_CAPTION] = 大切な時間を、そっと残す。
```

### Travel

```text
[THEME] = travel memory
[MOOD] = travel route memories, station, sea, city street, ticket, map, airy sky-blue film tone
[FINAL_CAPTION] = 旅の記憶を、順番に並べる。
```

### Self Archive

```text
[THEME] = personal archive memory
[MOOD] = personal daily archive, desk, room, favorite objects, quiet self-recording, minimal white and black with red accent
[FINAL_CAPTION] = わたしらしい瞬間を、集める。
```

## QA Checklist

- Video is vertical 9:16.
- QR panel is visible for the full duration.
- QR points to `https://12cut.co.kr/`.
- QR scan opens the Japanese landing by default.
- No Korean text appears in the exported video.
- Japanese captions are short and readable at exhibition distance.
- The making flow is understandable without audio.
- The loop returns naturally without a black screen.
- The bottom QR area does not cover the core smartphone action.
- The tone is warm, clean, and premium, not instructional or sales-heavy.

## Current Production Record - 2026-06-08

This section supersedes the earlier QR-in-video direction for the current exhibition deliverable.

### Current Decision

- QR is not embedded in the video. A physical QR board will be attached near the swing monitor.
- The video uses actual 12CUT editor UI recording, not AI-generated phone mockups.
- The phone outer frame is removed. The internal editor screen is scaled to fill the 9:16 canvas as much as possible.
- The target device ratio is aligned to an iPhone 17-style viewport: `393 x 852` capture, exported as `1080 x 1920`.
- On-screen UI language is Japanese.
- Audio is omitted.

### Final Flow Used In The Recording

1. First-entry `STORY GUIDE` bottom sheet is shown.
2. Empty story creation screen is shown.
3. iOS-style photo picker overlay appears inside the phone screen.
4. 12 photos are selected in the picker.
5. The editor returns with all 12 thumbnails filled. Empty thumbnail gaps are not shown after upload.
6. Order selection screen is shown.
7. Trimming screen shows a subtle one-way zoom-in only. Rotation is intentionally removed.
8. Story preview wheel is shown.
9. Completion screen is shown.

### Generated Outputs

- Single latest actual-service clip:
  - `assets/videos/exhibition/12cut-exhibition-actual-service-fullscreen-no-qr.mp4`
  - `1080 x 1920`, `24fps`, about `43s`, no audio
- Five theme rolling output:
  - `assets/videos/exhibition/12cut-exhibition-actual-service-5theme-rolling.mp4`
  - `1080 x 1920`, `24fps`, `3m35s`, no audio
- Five theme check sheet:
  - `assets/videos/exhibition/12cut-exhibition-actual-service-5theme-contact-sheet.jpg`

### Included Theme Sets

- `lover-01`
- `friends-01`
- `travel-01`
- `lover-02`
- `friends-02`

`pets-01` is excluded from the current rolling output because only 7 images exist locally, while the 12CUT editor flow requires 12 images.

### Generation Pipeline

- Recorder:
  - `scripts/record_actual_12cut_editor.cjs`
  - Supports `--set=<theme-set>` and `--out-dir=<frame-dir>`
  - Example:
    ```bash
    node scripts/record_actual_12cut_editor.cjs --set=lover-01 --out-dir=assets/videos/exhibition/actual_frames_lover-01
    ```
- MP4 composition:
  - Uses `ffmpeg` to convert captured PNG frames to `1080 x 1920` MP4:
    ```bash
    ffmpeg -y -framerate 24 -i "assets/videos/exhibition/actual_frames_lover-01/frame_%05d.png" \
      -vf "scale=-2:1920,pad=1080:1920:(ow-iw)/2:0:color=0xF8F4EE,setsar=1" \
      -an -c:v libx264 -pix_fmt yuv420p -crf 18 -movflags +faststart \
      "assets/videos/exhibition/12cut-exhibition-actual-service-lover-01.mp4"
    ```
- Rolling concat:
  - Concatenate the five generated MP4 files with `ffmpeg -f concat -safe 0 -c copy`.

### QA Notes

- The current version is good for "how it works" understanding.
- For passersby acquisition, `3m35s` may be long. If the monitor is placed in a high-traffic aisle, compress each theme from `43s` to about `25-30s`.
- The trimming zoom should remain subtle and one-way. Do not reintroduce rotation unless the UI needs to explicitly teach advanced editing.
- The photo picker is an in-video approximation of iOS Photos because native OS file dialogs are not capturable in headless Chrome screenshots.
