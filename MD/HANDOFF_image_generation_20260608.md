# 12CUT Image Generation Handoff — 2026-06-08

## Summary

- 12CUT home film-reel image generation is complete.
- Total scope: `40` story sets x `12` images = `480` images.
- Final output root: `assets/images/generated/`.
- Final image spec: `2336 x 1744`, PNG, `2k`, `medium`, `4:3`.
- Generation model: Higgsfield `gpt_image_2`.
- Tracking document: `MD/12CUT_parallel_image_generation_plan.md`.

## Completed Themes

- `Lover 01` to `Lover 08`: complete.
- `Friends 01` to `Friends 06`: complete.
- `Travel 01` to `Travel 08`: complete.
- `Pets 01` to `Pets 06`: complete.
- `Wedding 01` to `Wedding 06`: complete.
- `Idol 01` to `Idol 06`: complete after full diversity remake.

## Important QA Notes

- All final image files were verified as `2336 x 1744`.
- `Idol 01` to `Idol 06` were initially generated but rejected because fan faces looked too similar.
- The rejected Idol batch was overwritten with a diversity-first remake.
- Final Idol remake intentionally varies hair length/style, face shape, glasses/freckles/skin tone, body silhouette, and outfit category.
- `Idol 05 Scene 02` was regenerated once because the first remake candidate included a clear illustrated charm face. Final version uses abstract faceless charms.

## Current Status

- Image asset generation is done.
- This does not yet mean home deployment or exhibition video rerender is done.
- Next work should start from final images in `assets/images/generated/`.

## Add-on Scope — K-pop Tokyo/Yokohama

- User requested a separate K-pop add-on set after the base `480` images.
- Exhibition location: Tokyo/Yokohama, Japan.
- Recommended first batch: `12` K-pop-coded sets x `12` images = `144` additional images.
- Add-on output root: `assets/images/generated/kpop/`.
- Add-on planning document: `MD/12CUT_kpop_addon_generation_plan_20260608.md`.
- Important safety rule: real K-pop star names are curation references only. Generated images should be fictional K-pop-coded scenes, with no direct celebrity likeness, no agency/group logo, no readable names, and no trademarked visual assets.

## Suggested Next Window Prompt

```text
12CUT 홈 필름릴 이미지 480장 생성은 완료됐다.
최종 이미지는 assets/images/generated/에 있고, 기록은 MD/HANDOFF_image_generation_20260608.md와 MD/12CUT_parallel_image_generation_plan.md를 확인해.
사용자 추가 지시로 도쿄/요코하마 전시용 K-pop 추가본을 진행한다.
K-pop 추가본 명세는 MD/12CUT_kpop_addon_generation_plan_20260608.md를 기준으로 하고, 실존 스타명은 큐레이션 참고로만 쓰며 생성물은 fictional K-pop-coded scene으로 만든다.
모델/해상도/검증 규칙은 기존 480장과 동일하게 유지한다.
```

## Reference

- Main generation plan and detailed reference element IDs: `MD/12CUT_parallel_image_generation_plan.md`
- Existing exhibition/video assets: `assets/videos/exhibition/`
