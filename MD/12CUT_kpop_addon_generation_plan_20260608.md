# 12CUT K-pop Add-on Image Generation Plan — Tokyo/Yokohama

## Status

- Base image generation is already complete: `40` sets x `12` images = `480` final images.
- Add-on scope: K-pop exhibition set for Tokyo/Yokohama.
- Recommended first batch: `12` K-pop-coded sets x `12` images = `144` images.
- Output root: `assets/images/generated/kpop/`.
- File pattern: `assets/images/generated/kpop/kpop-{setNo}-{sceneNo}-2k-medium.png`.
- Final image spec: `2336 x 1744`, PNG, `2k`, `medium`, `4:3`.
- Model target: Higgsfield `gpt_image_2`.

## Legal/Brand Safety Rule

- Real star names are allowed only as curation references and audience-recognition planning inputs.
- Generated images must not copy a real idol's face, agency logo, group logo, stage costume, album art, photocard design, readable name, or trademarked symbol.
- Prompt language should use "fictional K-pop star", "K-pop-coded", "inspired by broad stage archetypes", and "no celebrity likeness".
- Do not include readable Korean/Japanese/English text, fan slogans, group names, venue names, or brand marks.

## Tokyo/Yokohama Curation Logic

- Acquisition: Japanese visitors should recognize the K-pop context within 3 seconds through styling, concert culture, lightstick-like abstract props, dance practice, fan cafe, and backstage mood.
- Activation: Each 12-slide set should feel like one collectible memory pack, not a random fashion shoot.
- Revenue: The set should increase perceived variety beyond romance/friends/travel/pets/wedding/idol-fan memories.
- Retention/Referral: Use scenes that viewers can imagine sharing: concert day, comeback cafe, dance practice, photocard room, Yokohama night, Tokyo station trip.

## Real-Star Shortlist for Curation Reference Only

### First Priority

1. Jungkook — broad Japanese/general recognition, solo performance energy.
2. V — fashion/editorial recognition, strong visual memory.
3. Jimin — dance/performance association.
4. Jennie — luxury/editorial K-pop iconography.
5. Lisa — global dance/performance recognition.
6. Rosé — vocal/emotional editorial mood.
7. Jisoo — elegant visual archetype.
8. Karina — current Japanese youth relevance, cyber/futuristic idol mood.
9. Winter — clean vocal/visual archetype.
10. Wonyoung — current-generation idol visual recognition in Japan.
11. Yujin — bright performance/variety-friendly archetype.
12. Hanni — youthful natural K-pop mood.

### Expansion Candidates

- Sakura — Japan-native K-pop bridge, very relevant for Tokyo/Yokohama.
- Chaewon — strong current-generation recognition.
- Sana — Japan-native K-pop bridge, strong local familiarity.
- Momo — Japan-native dance archetype.
- Mina — elegant Japan-native archetype.
- Nayeon — bright senior idol archetype.
- Taeyeon — vocal legacy archetype.
- IU — Korean pop/actor crossover, softer emotional set option.

## First Batch Set Matrix

Use these as fictional archetypes. Do not generate direct likenesses.

| Set | Curation Reference | Fictional Archetype | Primary Value |
| --- | --- | --- | --- |
| K-pop 01 | Jungkook | Male solo performance day | Stage energy |
| K-pop 02 | V | Editorial city night idol | Fashion memory |
| K-pop 03 | Jimin | Dance practice to spotlight | Movement |
| K-pop 04 | Jennie | Chic comeback cafe star | Iconic styling |
| K-pop 05 | Lisa | Global dance break star | Dynamic performance |
| K-pop 06 | Rosé | Warm vocal recording day | Emotional softness |
| K-pop 07 | Jisoo | Elegant fan meeting day | Refined intimacy |
| K-pop 08 | Karina | Futuristic Tokyo pop star | Currentness |
| K-pop 09 | Winter | Clean winter stage star | Crisp visual identity |
| K-pop 10 | Wonyoung | Bright magazine idol day | Fresh youth |
| K-pop 11 | Yujin | Outdoor festival idol | Energy and approachability |
| K-pop 12 | Hanni | Natural street-pop idol | Casual relatability |

## Global Prompt Prefix

```text
Warm, cute, beautiful, emotionally memorable 12CUT slide image, fictional K-pop star memory, Tokyo/Yokohama exhibition mood, modern Korean pop culture atmosphere, cinematic editorial lifestyle photo, Kodak Portra 400 film look, warm soft highlights, natural human skin texture, clean composition, shallow depth of field, delicate film grain, 4:3 landscape photo, no text, no logo, no watermark, no 12CUT product visible.
```

## Global Negative Prompt

```text
real celebrity likeness, copied idol face, agency logo, group logo, real album art, readable name, readable poster, readable ticket, readable text, watermark, trademark, luxury brand mark, 12CUT product, slide viewer, toy camera, distorted face, distorted hands, extra fingers, bad anatomy, plastic skin, oversexualized pose, vulgar styling, dark gritty mood, AI artifacts, low quality
```

## Reusable 12-Scene Sequence

Apply this sequence to each set, changing wardrobe, props, location, and mood by archetype.

1. Arrival: candid pre-event moment near a station, cafe, studio, or backstage hallway.
2. Detail: hands adjusting accessory, in-ear monitor, ribbon, mic pouch, abstract lightstick, or bag charm.
3. Practice: movement rehearsal, mirror room, soft motion blur, natural sweat, non-glamorous human detail.
4. Quiet: seated waiting moment, warm drink, handwritten but unreadable note, soft window light.
5. Fan Culture: abstract fan goods, blurred photocards, blank cheering board, no readable text.
6. Portrait: face-visible but fictional, natural skin, non-celebrity features, warm eye contact.
7. Performance: stage-like light, no real venue logo, no readable LED text.
8. Friends/Staff: one or two supporting figures, candid laugh, not same-face clones.
9. Tokyo/Yokohama Context: train platform glow, Yokohama harbor night, Tokyo cafe, or street crossing atmosphere.
10. After Moment: tired but happy, hoodie/jacket layer, low-key post-event emotion.
11. Object Memory: mic silhouette, ribbon, shoe detail, tote, abstract lightstick reflection.
12. Closing Slide: warm collectible memory image, soft smile or atmospheric still, no text.

## Set-Specific Prompt Directions

### K-pop 01 — Male Solo Performance Day

- Fictional male Korean pop soloist in his mid-20s.
- Athletic but warm styling, soft black hair, natural face, no real-idol likeness.
- Wardrobe: cream bomber, black practice tee, soft denim, silver in-ear detail.
- Mood: performance energy, clean confidence, Tokyo concert day.

### K-pop 02 — Editorial City Night Idol

- Fictional male K-pop editorial star in his late-20s.
- Wardrobe: long charcoal coat, ivory knit, soft scarf, minimal jewelry.
- Location: Yokohama night street, warm reflections, no brand signs.
- Mood: cinematic fashion memory, quiet charisma.

### K-pop 03 — Dance Practice to Spotlight

- Fictional male K-pop dancer in his mid-20s.
- Wardrobe: loose white shirt, black dance pants, soft cardigan or practice jacket.
- Focus: dance line, mirror room, hands, shoes, breath, spotlight.
- Mood: graceful movement and effort.

### K-pop 04 — Chic Comeback Cafe Star

- Fictional female K-pop star in her mid-20s.
- Wardrobe: cropped cardigan layered modestly, soft tweed jacket, ribbon accent, denim.
- Location: Tokyo fan cafe mood with abstract decorations only.
- Mood: chic but cute comeback memory.

### K-pop 05 — Global Dance Break Star

- Fictional female K-pop dancer in her mid-20s.
- Wardrobe: sporty jacket, cargo pants, soft metallic accent, sneakers.
- Focus: dynamic rehearsal, performance light, abstract stage.
- Mood: confident, global, high-energy, never provocative.

### K-pop 06 — Warm Vocal Recording Day

- Fictional female vocalist in her mid-20s.
- Wardrobe: soft knit, light denim, natural wavy hair, tiny pendant.
- Location: warm recording booth, lyric sheet blurred/unreadable.
- Mood: intimate voice memo, emotional warmth.

### K-pop 07 — Elegant Fan Meeting Day

- Fictional female idol in her mid-to-late 20s.
- Wardrobe: ivory blouse, soft black skirt, pearl-like detail, cardigan.
- Location: small fan-meeting room, flowers, blank cards, warm light.
- Mood: refined, gentle, trustworthy.

### K-pop 08 — Futuristic Tokyo Pop Star

- Fictional female K-pop star with current-generation styling.
- Wardrobe: silver-gray jacket, powder blue accent, clean black base layer.
- Location: Tokyo night neon glow, abstract cyber backdrop, no readable signs.
- Mood: current, sleek, cool, but still warm enough for 12CUT.

### K-pop 09 — Clean Winter Stage Star

- Fictional female K-pop vocalist/dancer.
- Wardrobe: white padded jacket, pale blue knit, silver hair clip, winter boots.
- Location: winter stage prep, backstage, city lights.
- Mood: crisp, clean, delicate.

### K-pop 10 — Bright Magazine Idol Day

- Fictional young adult female idol.
- Wardrobe: pastel cardigan, white tee, soft skirt or denim, tiny hair ribbon.
- Location: magazine shoot prep, flower props, pastel studio.
- Mood: bright, fresh, friendly.

### K-pop 11 — Outdoor Festival Idol

- Fictional female K-pop performer.
- Wardrobe: varsity jacket, white tee, denim, cap, sneakers.
- Location: outdoor festival rehearsal, golden hour, Yokohama harbor air.
- Mood: energetic and approachable.

### K-pop 12 — Natural Street-Pop Idol

- Fictional young female K-pop star.
- Wardrobe: oversized hoodie, pleated skirt or denim, headphones, tote.
- Location: Tokyo street/cafe/studio commute.
- Mood: natural, casual, relatable, Gen Z softness.

## Generation Execution Notes

- Generate one set at a time: `kpop-01` before `kpop-02`.
- Run `4` images per job if the tool supports batch count `4`; otherwise one scene per job.
- After each set, verify:
  - exactly `12` files
  - every file is `2336 x 1744`
  - no readable text/logo
  - no real celebrity likeness
  - no same-face issue among supporting characters
- If a set fails identity safety or same-face QA, regenerate the failed scenes and overwrite final filenames.

## Expansion Rule

If Tokyo/Yokohama positioning needs stronger local resonance, add a second batch:

- `K-pop 13 — Sakura Bridge Idol`
- `K-pop 14 — Sana/Momo/Mina Japan-Line Dance Day`
- `K-pop 15 — Chaewon Current-Gen Pop Mood`
- `K-pop 16 — Nayeon Bright Senior Idol`

This would add `4` sets x `12` images = `48` images, bringing the K-pop add-on to `192` images.
