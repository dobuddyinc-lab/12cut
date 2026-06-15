# 핸드오프 — 도넛 편집기 회전 아이콘 통일 (2026-06-14)

## 배경
- 도넛(`www.donutframe.com`)의 12컷 편집기는 진입 경로에 따라 **편집기 파일이 둘로 분기**됨.
  - 로더: `/12cut_editor/index.html` → URL에 `catecd=` 있으면 `donutEditor.html`, 없으면 `12cutEditor.html` (모바일/iframe도 동일 target).
- 회전 핸들 아이콘(빨간 원 + 흰 회전 화살표) 상태:
  | 파일 | 회전 아이콘 |
  |---|---|
  | `/12cut_editor/donutEditor.html` (56KB) | **있음** (개선판: `rotateActionHandler` 폴백 + `touchSizeX/Y:50`) |
  | `/12cut_editor/12cutEditor.html` (24KB) | **없음** (fabric 기본 핸들) |
- 따라서 과제는 "신규 추가"가 아니라 **`12cutEditor.html`에 동일 아이콘 이식 → 두 편집기 통일**.

## 환경 사실
- fabric.js: **v5.3.0** (도넛 자체 호스팅 `/data/skin/front/moment/js/fabric/fabric.min.js`). `fabric.Control`·`controlsUtils.rotationWithSnapping` 지원 → 코드 호환 OK.
- SVG 문자열은 12cut / donutEditor.html과 **바이트 동일**.

## 변경 내용
- 대상: 도넛 `/12cut_editor/12cutEditor.html`
- 방식: **순수 삽입 1건** (다른 라인 변경 0). CRLF 줄바꿈 보존.
- 삽입 위치: `fabric.Object.prototype.set({ ... })` 블록을 닫는 `});` **직후** (원본 line 187 다음).
- 앵커(이 직후에 삽입):
  ```
      // padding: 10,
      // cornerStyle: "circle"
    });
  ```
- 삽입 블록(donutEditor.html 개선판과 동일):
  ```javascript
    // [회전 핸들 아이콘] donutEditor.html 개선판 이식 — 빨간 원 + 흰 회전 화살표
    const rotateImg = new Image();
    const rotateSvg = `<svg ...#FF7373... 회전화살표...>`;  // 12cut/donutEditor와 동일 SVG
    rotateImg.onload = () => {
      const rotateActionHandler = fabric.controlsUtils?.rotationWithSnapping || fabric.Object.prototype.controls?.mtr?.actionHandler;
      fabric.Object.prototype.controls.mtr = new fabric.Control({
        x: 0, y: -0.5, offsetY: -40,
        actionHandler(eventData, transform, x, y) {
          transform.originX = transform.originY = 'center';
          return rotateActionHandler(eventData, transform, x, y);
        },
        render(ctx, left, top, styleOverride, fabricObject) {
          ctx.save();
          ctx.translate(left, top);
          ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
          ctx.drawImage(rotateImg, -13, -13, 26, 26);
          ctx.restore();
        },
        touchSizeX: 50,
        touchSizeY: 50,
      });
    };
    rotateImg.src = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(rotateSvg);
  ```
  (완성 SVG 포함 전체 파일 = `editor/donut/12cutEditor.patched.html`)

## 산출물 (이 레포)
- `editor/donut/12cutEditor.live.bak` — 도넛 라이브 원본 스냅샷(24,493B, 2026-06-14 fetch).
- `editor/donut/12cutEditor.patched.html` — 회전 컨트롤 이식본(28,100B, +3,607B). 그대로 업로드 가능.

## 배포 — ★ 완료·검증됨 (2026-06-14 17:18)
- 도넛 SFTP 자격증명 수령 → 도넛 서버 직접 배포 성공.
  - HOST `gdadmin.donutt32.godomall.com:17662` / USER `donuttad` (배포 스크립트 `.deploy_donut.exp`, gitignored).
  - 원격 루트 `/`에 `12cut_editor/` 존재 확인 → `put editor/donut/12cutEditor.patched.html /12cut_editor/12cutEditor.html`.
- 안전 절차: 업로드 전 라이브 `12cutEditor.html`(24,493B) get → 우리 백업과 **IDENTICAL** 확인(패치 베이스=현재 라이브) → 변경 삽입 24줄·수정/삭제 0 확인 후 업로드.
- 검증: 라이브 `curl` = **28,100B, 패치본과 바이트 IDENTICAL**, 마커 `rotateImg`×4·`mtr = new fabric.Control`·`rotationWithSnapping`·`touchSizeX`·`FF7373` 전부 확인.
- 주의(stale): 배포 시점 `donutEditor.html`·`global.js`·`global.css`가 17:16~17:17(당일) mtime → 도넛 외주가 동시 작업 중일 수 있음. 단 본 변경 대상 `12cutEditor.html`은 미수정(Sep 2025)이라 충돌 없음. 외주 통지 권장.
- 잔여: 실제 회전 핸들 **렌더 육안 확인**은 편집기 플로우(12컷 선택→트리밍 step2)에서 1회 권장(코드/바이트는 라이브 일치 확정).

## 검증 체크리스트(반영 후)
- [ ] `catecd=` 없이 편집기 진입 → 트리밍(step2)에서 사진 선택 시 상단 중앙에 빨간 회전 핸들 표시.
- [ ] 핸들 드래그 회전 동작 + 5도 스냅(`snapAngle:5`).
- [ ] 모바일 터치 회전(터치 영역 50px) 동작.
- [ ] `donutEditor.html`(catecd= 경로)와 시각·동작 일치.

## 비고 / 검토 포인트
- 도넛 `12cutEditor.html`은 `borderScaleFactor:3, cornerSize:25`로 코너가 큼 → 26px 아이콘이 상대적으로 작게 느껴지면 `drawImage(...,32,32)` + 오프셋 `-16`으로 비례 확대 검토.
- 두 편집기(`12cutEditor.html` 24KB vs `donutEditor.html` 56KB)는 기능 차가 큼 → 로더 단일화(Option B)는 부작용 리스크로 비권장. 아이콘만 통일하는 본 패치가 안전.
