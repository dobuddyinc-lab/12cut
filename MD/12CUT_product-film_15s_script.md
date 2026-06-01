# 12CUT — Branded Product Film (15s) · Generation Script

> **Use**: B안 "12개의 장면" 제품 필름 (사운드 디자인 有 → `prod.mp4` 계열, 무음 히어로 루프와 별개)
> **Format**: 16:9 landscape · 24fps · 15s total · Sound design only (NO music, NO VO)
> **Color**: Kodak Portra 400 emulation · 3200–3800K warm · ISO400 grain
> **Generation strategy**: 단일 15초 원샷이 아니라 **4 세그먼트 분할 생성 → 하드컷 편집 결합**
> (모델 1회 생성 5~8초 안정 구간 고려. 인물·제품 일관성 확보 위해 reference image conditioning 필수)

---

## IMAGE REFERENCES

| Tag | File | Description |
|---|---|---|
| `@HeroStill` | `hero-still.webp` | OPENING frame (= live hero section image). Two hands holding the matte-white 12CUT toward a sunlit classroom window, cherry-blossom + school-building bokeh, golden hour |
| `@ProductFront` | `12CUT ele.front.png` | FRONT face — matte white body, red dome shutter top-right, red heart strap tab left, circular lens hole center-right, "12cut" embossed bottom-center |
| `@ProductBack` | `12CUT ele.back.png` | BACK face — small circular viewfinder window, dark bezel, heart strap tab right-mirrored |
| `@ProductTop` | `12CUT ele.top.png` | top-down — red dome shutter button, strap loop, body parting line |
| `@ProductPer` | `12CUT per1.4001.png` | 3/4 front-right perspective — hero product angle, all key elements visible |
| `@ProductExploded` | `12CUT.3990.png` | internal structure — 12-slot black film disc, shutter mechanism, front/back shell separation |
| `@CharA` | `character-mother.png` | Korean woman, late 20s, new mother. Cream knit cardigan, soft natural makeup, warm exhausted joy. 3-panel: front / back / face close-up |
| `@CharB` | `character-teens.png` | Two Korean middle-school girls, 14–15. Matching uniforms, ponytails, best-friend energy. 3-panel: front / back / face close-up |
| `@CharC` | `character-lover.png` | Korean woman, mid-20s. Oversized beige coat, shy sparkling eyes, understated beauty. 3-panel: front / back / face close-up |
| `@Slide1` | `viewfinder-slide-01.png` | 4:3 LANDSCAPE. Baby's tiny hand gripping an adult index finger. Warm skin tones, shallow DOF, soft golden backlight. Portra 400 tonality |
| `@Slide2` | `viewfinder-slide-02.png` | 4:3 LANDSCAPE. Two teenage girls making peace signs, laughing mid-frame. School uniform, convenience store / hallway BG. Casual flash-lit warmth |
| `@Slide3` | `viewfinder-slide-03.png` | 4:3 LANDSCAPE. Couple holding hands walking away on autumn street. From behind, golden ginkgo leaves, late afternoon backlight. Hands + lower bodies only — no faces |

---

## PRODUCT

12CUT slide viewer (`@ProductPer` for overall form). Matte-white rounded-square body, red dome shutter button at top-right corner (`@ProductTop`), red heart strap loop on left side, small circular lens hole center-front, "12cut" engraved at bottom-front (`@ProductFront`). Back face: 4:3 landscape rounded-rectangle viewfinder window with thin black bezel (`@ProductBack`). Internal mechanism: 12-slot black film disc (`@ProductExploded`) advances one position per shutter press.

## CHARACTERS

- **Person A** (`@CharA`): Young Korean mother (late 20s), soft natural makeup, cream knit cardigan, cradling newborn.
- **Person B** (`@CharB`): Two Korean middle-school girls (14–15), matching uniforms, arms linked, cheeks pressed together laughing.
- **Person C** (`@CharC`): Korean woman (mid-20s) in love, oversized beige coat, eyes sparkling, shy smile.

---

## SHOT TIMELINE (4 segments)

Camera OPENS on the live hero-section image (`@HeroStill`), pushes in INTO the viewfinder window of the matte-white device (`@ProductFront`), then pulls out to reveal the human story. Fluid single-axis Z-move only.

### ▸ SEGMENT 1 — Hero-still open → Viewfinder → Mother reveal  ([0–6s])

**[0–3s]** **OPENS EXACTLY on `@HeroStill`** (= the live hero section image): two hands holding the matte-white 12CUT toward a sunlit classroom window, cherry-blossom + school-building bokeh, golden hour. Camera **PUSHES IN** along Z-axis toward the device and travels **INTO** the 4:3 viewfinder window. Warm golden light reveals `@Slide1` (baby's tiny hand gripping a finger). Slide **CLICKS** and mechanically rotates **LEFT** (stepped) to `@Slide2` (two girls, peace signs). Another **CLICK** to `@Slide3` (couple, autumn street). Internal disc (`@ProductExploded`) visible as silhouette. Each click = metallic shutter sound.

**[3–6s]** Camera smoothly **PULLS BACK** through the viewfinder (`@ProductBack` → `@ProductPer` as angle widens), revealing the device held in two hands. Continue back to **Person A** (`@CharA`) — she lowers the 12CUT from her eye, face breaks into a tearful-happy smile, eyes glistening, chin trembling slightly. Warm afternoon window light wraps her face. Newborn sleeps on her chest.

### ▸ SEGMENT 2 — Teens montage  ([6–8s])

**HARD CUT** — Inside viewfinder: slide **CLICKS**, rotates LEFT.
**HARD CUT** — **Person B** (`@CharB`) pressing the 12CUT (`@ProductPer`) between their faces, both peering into the viewfinder from opposite sides, **BURST** into uncontrollable giggles, shoulders shaking, one girl playfully shoving the other.

### ▸ SEGMENT 3 — Lover montage + Front reveal  ([8–10s])

**HARD CUT** — Inside viewfinder: slide **CLICKS**, rotates LEFT.
**HARD CUT** — **Person C** (`@CharC`) holds 12CUT to her eye with one hand, other hand pressed to her chest. She pulls it away slowly, bites her lower lip, eyes welling with happy nostalgia, a single tear catches the light. Product FRONT face (`@ProductFront`) briefly visible as she lowers it — lens hole, red heart strap tab, "12cut" text.

### ▸ SEGMENT 4 — Light bloom + Endcard  ([10–15s])

**[10–12s]** Camera **PUSHES FORWARD** back into the viewfinder. Two final slides rotate with deliberate, slow **CLICKS**. Photographs glow with intensifying warm golden light — overexposing gently until the frame fills with soft amber warmth.

**[12–15s]** Warm light resolves into a clean cream / warm-white background. The 12CUT device (`@ProductFront`, matched exactly) sits centered at 25–30% frame, FRONT face to camera — lens hole, red dome shutter, red heart strap tab, "12cut" text all accurate to reference. Perfectly still. Below it, text fades in softly:

> **따뜻한 빛으로 보는 12장의 행복한 기억**

— then **"12CUT"** logo appears beneath. ZERO motion. Hold.

---

## CAMERA
Fluid single-axis movement only. Push-in / pull-out along Z-axis. NO pan, NO tilt, NO handheld shake during viewfinder interiors. Slight organic micro-drift during human close-ups only. Montage cuts are HARD (no dissolve).

## LIGHTING
Warm golden-hour tone throughout (3200–3800K). Viewfinder interiors: warm amber backlight bleeding through slides. Human close-ups: soft diffused window light from camera-left, subtle rim light camera-right. Endcard: clean even soft light, no harsh shadows.

## AUDIO
ASMR-intimate sound design. Mechanical film slide **CLICK** (metallic, satisfying, precise) on each rotation. Soft fabric rustle. Baby breathing. Girls' muffled giggle (distant, not dialogue). Woman's gentle exhale. NO music. NO voiceover. NO background noise. Pure intimate silence between clicks.

## STYLE
Cinematic film emulation. Kodak Portra 400 color science: lifted shadows, warm midtones, soft highlight rolloff. Subtle film grain (ISO 400 equivalent). Shallow DOF on human close-ups (f/1.8 equivalent). Sharp focus on product endcard. 16:9 · 24fps.

---

## STRICT CONSTRAINTS
- Viewfinder window: **4:3 LANDSCAPE rounded-rectangle** only (NO square, NO circle)
- Product body: **matte white only**, rounded-square — match `@ProductFront` exactly
- Shutter button: **red dome, top-right corner** — match `@ProductTop` exactly
- Heart strap tab: **red with white heart cutout** — match `@ProductFront` left side exactly
- Lens hole: **circular, center-right of FRONT face** — match `@ProductFront` exactly
- "12cut" text: **embossed, bottom-center of FRONT face** — match `@ProductFront` exactly
- Internal disc: **12-slot black film disc** — match `@ProductExploded`
- Slides rotate **LEFT** (mechanical, stepped, NOT smooth)
- Slide photos: **4:3 LANDSCAPE**, match `@Slide1/@Slide2/@Slide3` color and tone
- **NO text** overlaid on footage until endcard `[12–15s]`
- Endcard product: **FRONT face** (`@ProductFront`), centered, ZERO motion
- **NO music track.** Sound design only
- **LEFT INDEX FINGER** presses shutter in any visible press — NEVER right hand
- Person A/B/C must match `@CharA/@CharB/@CharC` references for face and build consistency

---

## GENERATION NOTES (분할 생성·결합 가이드)
1. **세그먼트별 생성**: S1(6s, `@HeroStill`에서 출발) / S2(2s) / S3(2s) / S4(5s). 각 세그먼트 첫 프레임에 reference image conditioning(`@HeroStill`, `@Char*`, `@Product*`)을 강하게 걸어 인물·제품 동일성 확보.
2. **하드컷 결합**: S1→S2→S3→S4는 디졸브 없이 컷 편집. 클릭 사운드를 컷 지점에 정렬하면 몽타주가 리듬으로 묶임.
3. **루프 아님**: 본 필름은 12–15s 엔드카드로 종료(루프 X). 무음 히어로 배경(A안)과 혼동 금지.
4. **엔드카드 정합성**: 12–15s 제품은 모션·생성 변형 리스크가 가장 크므로, AI 영상 대신 `@ProductFront` 실 에셋을 **컴포지팅(After Effects/편집)으로 합성** 권장 — 제품 정확도 100% 보장.
5. **납품 시**: 캐시 30일 정책상 파일명 버전 부여(`prod-v2.mp4` 등) 후 `main/index.html` `<source src>` 교체.
