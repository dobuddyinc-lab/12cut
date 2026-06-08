# 12CUT Parallel Image Generation Plan

## Handoff

- New-window handoff summary: `MD/HANDOFF_image_generation_20260608.md`
- Current status: all `40` story sets / `480` final images are generated and verified.
- Base generation status: complete.
- Add-on generation status: K-pop Tokyo/Yokohama add-on requested after base completion. See `MD/12CUT_kpop_addon_generation_plan_20260608.md`.
- If continuing the original base scope, proceed with home integration, asset packaging, or exhibition video rerender from `assets/images/generated/`.
- If continuing the new add-on scope, generate `assets/images/generated/kpop/kpop-{setNo}-{sceneNo}-2k-medium.png` from the K-pop plan.

## Global Rules

- Model: Higgsfield `gpt_image_2`
- Resolution: `2k`
- Quality: `medium`
- Aspect ratio: `4:3`
- Output path: `assets/images/generated/{theme}/{theme}-{setNo}-{sceneNo}-2k-medium.png`
- Never show the 12CUT product, slide viewer, toy camera, product package, logos, readable text, or watermarks.
- All outputs must be verified as `2336 x 1744`.

## Theme Rules

### Friends

- Use 2 or 3 friends by default.
- Do not repeat the same AI face.
- Vary faces, hairstyles, expressions, posture, skin texture, and body shape.
- Mix face-visible scenes with hands, objects, table, and atmosphere detail scenes.
- Avoid: twin-like faces, same V-line jaw, same large eyes, porcelain skin, model-catalog beauty, influencer clone feeling.

### Travel

- For solo-traveler sets, keep one protagonist fixed across all 12 slides.
- Do not change face shape, hair length, core hairstyle, age impression, or signature styling.
- Vary only camera angle, weather, outfit layers, accessories, and face visibility.
- Detail scenes should preserve identity through sleeves, bag, scarf, hand, or signature props.
- Avoid: changing the traveler between scenes.

### Idol Fan Memory

- Do not use a single generic fan face across a set.
- Avoid the repeated idol-fan template: long dark hair with bangs, same oval/V-line face, same slim body, same soft smile, same pastel feminine styling.
- For friend scenes, define 2 or 3 clearly different fans before generation:
  - different hair length, parting, texture, and color tone
  - different face shapes, eye shapes, nose/lip proportions, skin tone, and body shape
  - at least one distinguishing everyday trait such as glasses, short hair, freckles, acne marks, braces, round cheeks, sharper jaw, tan skin, bob cut, pixie cut, curly hair, hoodie, denim, sporty jacket, or minimalist styling
- Keep real-human naturalness over model-like prettiness. Fans should look like distinct friends, not sisters, twins, idols, influencers, or catalog models.
- Real idol likeness, readable idol names, readable tickets, readable posters, agency logos, and real brand marks are forbidden.
- Use fictional/abstract fan goods only. Photocards and posters must be blurred, back-facing, illustrated, or too small to identify.

### K-pop Add-on

- Use real K-pop star names only as curation references, never as face-copy targets.
- Generate fictional K-pop-coded stars and fan memories for the Tokyo/Yokohama exhibition context.
- Avoid direct celebrity likeness, agency logos, group logos, readable names, readable slogans, album art, official stage costumes, and trademarked props.
- Prioritize Japanese audience recognition through broad K-pop signals: concert day, dance practice, comeback cafe, abstract fan goods, Tokyo/Yokohama night context, backstage, recording, fan meeting.
- First-batch plan: `K-pop 01` to `K-pop 12` in `MD/12CUT_kpop_addon_generation_plan_20260608.md`.

## Current Completed Scope

- `Lover 01` to `Lover 08`: complete.
- `Friends 01` to `Friends 06`: complete.
- `Travel 01`: complete after continuity remake.
- `Travel 02`: complete after reference-element continuity remake.
- `Travel 04`: complete.
- `Travel 05`: complete after family reference-element continuity generation.
- `Travel 06`: complete after reference-element continuity generation.
- `Travel 07`: complete after reference-element continuity generation.
- `Travel 08`: complete after reference-element continuity generation.
- `Pets 01`: complete.
- `Pets 02`: complete after reference-element continuity generation.
- `Wedding 01` to `Wedding 06`: complete after reference-element continuity generation.

### Wedding 01 to Wedding 06 Completion

- `Wedding 01 — Proposal Day`: complete.
  - Reference element: `wedding-01-proposal-couple`
  - Reference element id: `8567d1db-b745-4b09-b4c6-ac31c29efde3`
  - Final files: `assets/images/generated/wedding/wedding-01-01-2k-medium.png` to `wedding-01-12-2k-medium.png`
- `Wedding 02 — Dress Fitting`: complete.
  - Reference element: `wedding-02-fitting-couple`
  - Reference element id: `70bfbc80-ecb5-413e-a21c-3017f9924578`
  - Final files: `assets/images/generated/wedding/wedding-02-01-2k-medium.png` to `wedding-02-12-2k-medium.png`
- `Wedding 03 — Pre-Wedding Picnic`: complete.
  - Reference element: `wedding-03-picnic-couple`
  - Reference element id: `bb5d973c-6425-4ba9-ac57-8ead05ce3030`
  - Final files: `assets/images/generated/wedding/wedding-03-01-2k-medium.png` to `wedding-03-12-2k-medium.png`
- `Wedding 04 — Wedding Morning`: complete.
  - Reference element: `wedding-04-morning-couple`
  - Reference element id: `5e532620-398f-411f-a1f8-2adba639c3ef`
  - Final files: `assets/images/generated/wedding/wedding-04-01-2k-medium.png` to `wedding-04-12-2k-medium.png`
- `Wedding 05 — Small Ceremony`: complete.
  - Reference element: `wedding-05-ceremony-couple`
  - Reference element id: `1c8b9f18-cf75-4c8d-b270-14bb34f796eb`
  - Final files: `assets/images/generated/wedding/wedding-05-01-2k-medium.png` to `wedding-05-12-2k-medium.png`
- `Wedding 06 — Honeymoon Memory`: complete.
  - Reference element: `wedding-06-honeymoon-couple`
  - Reference element id: `43e36d43-42b1-405f-a432-363f6ade9d30`
  - Final files: `assets/images/generated/wedding/wedding-06-01-2k-medium.png` to `wedding-06-12-2k-medium.png`
- `Pets 03`: complete after reference-element continuity generation.
- `Pets 04`: complete after reference-element continuity generation.
- `Pets 05`: complete after reference-element continuity generation.
- `Pets 06`: complete after reference-element continuity generation.
- `Idol 01` to `Idol 06`: remade and passed diversity QA after prior same-face rejection.

## Current In-Progress Scope

### Window A / Current Chat

- Owns: `Travel 02 — Jeju Island` — complete
- Started jobs:
  - `travel-02-01`: `d5b7a3cc-0598-4178-a764-e661924cf888`
  - `travel-02-02`: `6a6e7d97-fbcb-4fba-b4ad-09ea25039191`
  - `travel-02-03`: `1a6b9ac9-c65c-4579-91b0-f14b0b1f20eb`
  - `travel-02-04`: `1f14c890-d6b0-4896-a41d-9dcf947a0ca7`
- Character continuity:
  - Korean woman, mid-to-late 20s
  - Softly round face
  - Natural double eyelids, not exaggerated
  - Warm brown eyes
  - Small beauty mark near left cheek
  - Medium-length wavy dark brown hair just below shoulders
  - Cream windbreaker, light denim shirt, beige tote bag, simple silver ring, small tan suitcase
  - Reference element: `travel-02-jeju-protagonist`
  - Reference element id: `66f500be-a489-489b-965d-ae5e2ec3c396`
  - Final files: `assets/images/generated/travel/travel-02-01-2k-medium.png` to `travel-02-12-2k-medium.png`

## Parallel Assignment

Use this split if running multiple Cursor chats/windows.

### Window A

- Continue `Travel 02 — Jeju Island`
- Generate scenes `01` to `12`
- Save only files matching `assets/images/generated/travel/travel-02-*.png`

### Window B

- Start `Travel 03 — Tokyo Weekend`
- Generate scenes `01` to `12`
- Save only files matching `assets/images/generated/travel/travel-03-*.png`
- Must define one fixed Tokyo protagonist before scene 01 and keep that protagonist through all 12 slides.

### Window C

- `Travel 04 — First Solo Trip` — complete
- Generated scenes `01` to `12`
- Save only files matching `assets/images/generated/travel/travel-04-*.png`
- Must define one fixed solo-trip protagonist before scene 01 and keep that protagonist through all 12 slides.

### Window E / Current Chat

- `Travel 06 — Winter Snow Trip` — complete
- Generated scenes `01` to `12`
- Save only files matching `assets/images/generated/travel/travel-06-*.png`
- Must define one fixed winter protagonist before scene 01 and keep that protagonist through all 12 slides.
- Reference element: `travel-06-winter-protagonist`
- Reference element id: `e1cda88a-e49d-4491-9f53-20c4cf4cd915`
- Final files: `assets/images/generated/travel/travel-06-01-2k-medium.png` to `travel-06-12-2k-medium.png`

### Window F / Current Chat

- `Travel 07 — Road Trip` — complete
- Generated scenes `01` to `12`
- Save only files matching `assets/images/generated/travel/travel-07-*.png`
- Must keep the same two road-trip friends and the same small car through all 12 slides.
- Reference element: `travel-07-roadtrip-friends`
- Reference element id: `13cc907c-7b68-4961-becb-15e5b85c0738`
- Final files: `assets/images/generated/travel/travel-07-01-2k-medium.png` to `travel-07-12-2k-medium.png`

### Window G / Current Chat

- `Travel 08 — Seaside Healing Trip` — complete
- Generated scenes `01` to `12`
- Save only files matching `assets/images/generated/travel/travel-08-*.png`
- Must define one fixed seaside-healing protagonist before scene 01 and keep that protagonist through all 12 slides.
- Reference element: `travel-08-seaside-protagonist`
- Reference element id: `487e1989-7cf4-4686-ad13-2f50cfe9cf47`
- Final files: `assets/images/generated/travel/travel-08-01-2k-medium.png` to `travel-08-12-2k-medium.png`

### Window H / Current Chat

- `Pets 02 — Cat Morning` — complete
- Generated scenes `01` to `12`
- Save only files matching `assets/images/generated/pets/pets-02-*.png`
- Keep the same cream-and-ginger cat and the same owner through all 12 slides.
- Reference element: `pets-02-cat-morning`
- Reference element id: `24dc2675-bdb5-4e58-986f-7a0b9e35bb24`
- Final files: `assets/images/generated/pets/pets-02-01-2k-medium.png` to `pets-02-12-2k-medium.png`

### Window I / Current Chat

- `Pets 03 — First Walk Together` — complete
- `Pets 04 — Rainy Day at Home` — complete
- `Pets 05 — Park Picnic` — complete
- `Pets 06 — Growing Up` — complete
- Generated scenes `01` to `12` for each set.
- Save only files matching `assets/images/generated/pets/pets-03-*.png` to `assets/images/generated/pets/pets-06-*.png`.
- Keep the same pet and owner within each 12-slide set.
- Reference element: `pets-03-first-walk`
- Reference element id: `10946be7-29fb-4d40-a1d4-bea4c086befe`
- Reference element: `pets-04-rainy-home`
- Reference element id: `2c676ee6-0d7b-4136-ba6f-e42b05d93b7c`
- Reference element: `pets-05-park-picnic`
- Reference element id: `b47e8015-28f8-4589-abf5-15768577401f`
- Reference element: `pets-06-growing-up`
- Reference element id: `fc8dd4f3-9269-486c-8953-40f4d89a1bdf`
- Final files: `assets/images/generated/pets/pets-03-01-2k-medium.png` to `pets-06-12-2k-medium.png`

### Window J / Current Chat

- `Idol 01 — First Concert Day` — generated but rejected in QA
- `Idol 02 — Comeback Cafe` — generated but rejected in QA
- `Idol 03 — Photocard Room` — generated but rejected in QA
- `Idol 04 — Fan Meeting Memory` — generated but rejected in QA
- `Idol 05 — Birthday Support` — generated but rejected in QA
- `Idol 06 — After-Concert Night` — generated but rejected in QA
- Generated scenes `01` to `12` for each set.
- Save only files matching `assets/images/generated/idol/idol-01-*.png` to `assets/images/generated/idol/idol-06-*.png`.
- Reference element: `Idol-Fan-Memory-01`
- Reference element id: `5c85b3d8-d184-413e-bca5-014dc6f4eeb8`
- Reference element: `Idol-Fan-Memory-02`
- Reference element id: `37ccb040-d3d9-4e2b-be75-eff4994f0274`
- Reference element: `Idol-Fan-Memory-03`
- Reference element id: `d175dd8f-e48c-47ae-b23c-25682ff98e51`
- Reference element: `Idol-Fan-Memory-04`
- Reference element id: `c4118589-233a-4e15-9b72-4f758de09040`
- Reference element: `Idol-Fan-Memory-05`
- Reference element id: `b79cbfa3-6216-4267-84de-6743bc4e20d1`
- Reference element: `Idol-Fan-Memory-06`
- Reference element id: `01178f4b-658a-407c-8f6e-9c7a028e1a03`
- Final files: `assets/images/generated/idol/idol-01-01-2k-medium.png` to `idol-06-12-2k-medium.png`
- Verification: all `72` files passed `sips -g pixelWidth -g pixelHeight` as `2336 x 1744`.
- QA result: reject all `72` files for insufficient fan face diversity. Repeated traits: long dark hair with bangs, similar oval/V-line faces, similar slim body type, similar soft smile, same pastel feminine styling. Remake with distinct fan casts per set: vary hair length/color/texture, bangs/no-bangs, face shape, eye shape, skin tone, body shape, glasses/braces/acne/freckles, styling subculture, and age impression while preserving warm 12CUT tone.

### Window K / Current Chat

- `Idol 01 — First Concert Day` — remade and passed diversity QA
- `Idol 02 — Comeback Cafe` — remade and passed diversity QA
- `Idol 03 — Photocard Room` — remade and passed diversity QA
- `Idol 04 — Fan Meeting Memory` — remade and passed diversity QA
- `Idol 05 — Birthday Support` — remade and passed diversity QA
- `Idol 06 — After-Concert Night` — remade and passed diversity QA
- Generated scenes `01` to `12` for each set.
- Final files: `assets/images/generated/idol/idol-01-01-2k-medium.png` to `idol-06-12-2k-medium.png`
- Verification: all `72` files passed `sips -g pixelWidth -g pixelHeight` as `2336 x 1744`.
- Reference element: `idol-01-diverse-fans-remake`
- Reference element id: `92c67280-c4c1-49b9-ab7d-208d89ef3279`
- Reference element: `idol-02-diverse-cafe-fans`
- Reference element id: `26c90134-bd7b-4500-bcf6-2f22b7c8bf31`
- Reference element: `idol-03-curly-room-fan`
- Reference element id: `1639c8d4-360d-4ab9-aecb-b418ae74e350`
- Reference element: `idol-04-diverse-line-fans`
- Reference element id: `b2e223a5-b3f4-4037-9a7c-bfa966975ac2`
- Reference element: `idol-05-diverse-support-fans`
- Reference element id: `977ca7ca-2bb3-46bd-b3bd-3491e37cfbf9`
- Reference element: `idol-06-diverse-night-fans`
- Reference element id: `86fc005a-e79c-4c26-bebc-b9efbda76d51`
- QA notes: rejected old same-face batch was overwritten by diversity-first remake. New casts intentionally vary hair length/style, face shape, glasses/freckles/skin tone, body silhouette, and outfit category. `Idol 05 Scene 02` was regenerated once because the first candidate included a clear illustrated charm face; final candidate uses abstract faceless charms.

### Window D

- `Travel 05 — Family Trip` — complete
- Generated scenes `01` to `12`
- Save only files matching `assets/images/generated/travel/travel-05-*.png`
- Keep family members consistent through the set. Do not change child/parent identities between scenes.
- Reference element: `travel-05-family-trip`
- Reference element id: `500a0b85-657a-4989-8aba-65e080575d26`
- Final files: `assets/images/generated/travel/travel-05-01-2k-medium.png` to `travel-05-12-2k-medium.png`

## Do Not Touch Across Windows

- Do not regenerate files owned by another window unless explicitly asked.
- Do not overwrite existing completed sets.
- Do not use the same protagonist description across different travel sets.
- Do not continue another window's job IDs.

## Verification Checklist

For every batch of 4 images:

1. Poll Higgsfield job status.
2. Save to the correct filename.
3. Run `sips -g pixelWidth -g pixelHeight`.
4. Confirm `2336 x 1744`.
5. Open 2 to 3 samples and check:
   - No 12CUT product.
   - No readable text/logo.
   - Theme tone is warm, cute, beautiful, pretty.
   - Friends: faces are diverse and not AI-like.
   - Travel: protagonist or family continuity is maintained.

