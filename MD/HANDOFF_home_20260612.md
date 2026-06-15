# 집 작업 핸드오프 (2026-06-12)

집에서 이어서 작업할 때는 이 문서를 먼저 읽고, 그 다음 `git status --short`로 현재 로컬 상태를 확인할 것.

---

## 0. 현재 결론

| 항목 | 상태 |
|---|---|
| 오늘 작업 | 공식 도메인 전환 계획, 일부 도메인 비종속 코드 치환, B2B 문의 모달 초안, 전시용 영상 산출물 정리 |
| 라이브 배포 | **아직 안 한 것으로 봐야 함** |
| 커밋 | **아직 안 함** |
| 즉시 배포 가능 여부 | **불가** — `custom.js`의 B2B 문의 endpoint가 placeholder |
| 가장 중요한 블로커 | `B2B_ENDPOINT='.../REPLACE_WITH_DEPLOYED_WEB_APP_ID/exec'` 교체 전 `custom.js` 배포 금지 |

---

## 1. 현재 Git 상태

### 수정됨

- `custom.css`
- `custom.js`
- `index.html`
- `skin/main/index.html`

### 새 파일/미추적

- `MD/DOMAIN_MIGRATION_www-12cut-net.md`
- `assets/videos/exhibition/`
- 기존 미추적 로컬 파일들: `.cursor/`, `.live_*`, `.venv_video/` 등

현재 `main`은 `public/main`과 같은 커밋 `b0c53f8` 기준이고, 오늘 변경분은 working tree에만 있음.

---

## 2. 오늘 작업 상세

### A. 공식 도메인 전환 계획

새 문서:

- `MD/DOMAIN_MIGRATION_www-12cut-net.md`

결정/전제:

- 대표 도메인 TO-BE: `www.12cut.net`
- 기존 `12cut.co.kr`은 삭제하지 않고 `www.12cut.net`으로 301 존치
- `img.12cut.net`은 미디어/API 서버로 유지, 영향 0 목표
- 코드보다 먼저 DNS, 고도몰 도메인 연결, SSL, OAuth redirect URI 등록이 선행되어야 함

집에서 확인할 것:

1. `12cut.net` DNS 관리 콘솔이 어디인지 확인
2. 고도몰 관리자에서 `www.12cut.net` 외부 도메인 추가 가능 여부 확인
3. 카카오/네이버/구글/페이스북 OAuth redirect URI에 `www.12cut.net` 추가 필요 여부 확인
4. GSC/네이버 서치어드바이저 이전 계획 검토

### B. 도메인 비종속 코드 치환

변경 파일:

- `skin/main/index.html`
- `index.html`
- `custom.css`

변경 내용:

- 홈 CTA 2곳:
  - `https://12cut.co.kr/goods/goods_view.php?goodsNo=1000000000`
  - → `/goods/goods_view.php?goodsNo=1000000000`
- Google SNS 아이콘:
  - `url(https://12cut.co.kr/dobuddy/imgs/sns_google.png)`
  - → `url(/dobuddy/imgs/sns_google.png)`

의도:

- `www.12cut.net` 전환 이후에도 내부 이동이 현재 도메인을 따라가게 함
- 301 리다이렉트 1홉을 줄이고, 도메인 변경 때마다 CTA 코드를 다시 수정하지 않게 함

주의:

- OG URL, canonical, sitemap, robots는 상대경로가 아니라 `https://www.12cut.net/...` 절대 URL이어야 함
- `_redirects`, README, `PROJECT_CONTEXT.md`, 전시 QR/스토리보드는 아직 전부 정리된 상태가 아님

### C. B2B 비즈니스 문의 모달 초안

변경 파일:

- `custom.js`

추가 내용:

- 푸터 또는 홈 footer 링크 영역에 B2B 문의 링크 삽입
- `?biz=1` 쿼리로 문의 모달 자동 오픈
- 언어별 문구 지원: ja/ko/en/zh
- 입력 필드: 문의 유형, 회사명, 담당자명, 이메일, 전화번호, 지역, 문의 내용, 개인정보 동의
- 제출 방식: Google Apps Script Web App으로 JSON POST
- 공개 API: `window.openB2B`

현재 치명적 미완:

```js
var B2B_ENDPOINT='https://script.google.com/macros/s/REPLACE_WITH_DEPLOYED_WEB_APP_ID/exec';
```

이 값이 placeholder라서 현재 `custom.js`는 **라이브 배포 금지**. 배포하면 사용자는 폼을 열 수 있지만 제출은 실패함.

집에서 완료할 것:

1. Google Apps Script Web App 생성
2. doPost에서 12cut/donut 공통 Google Sheet로 적재
3. Web App URL을 `B2B_ENDPOINT`에 반영
4. CORS/권한 확인: 익명 사용자가 `fetch(..., Content-Type:text/plain)`으로 전송 가능해야 함
5. 실제 폼 제출 테스트 후에만 SFTP 배포

UX 판단:

- B2B CTA는 Acquisition/Revenue 관점에서 전시·제휴 문의 수집에 유리
- 단, 현재는 푸터에 자동 삽입되므로 CTA 위계가 강하지 않음
- 전시용으로 문의를 적극 받을 목적이면 홈 Pricing 또는 FAQ 아래 별도 섹션 배치가 더 명확함
- 반대로 일반 소비자 구매 전환을 방해하지 않는 것이 우선이면 푸터 링크 수준이 안전함

### D. 전시용 영상 산출물

경로:

- `assets/videos/exhibition/`

주요 파일:

- `12cut-exhibition-actual-service-5theme-rolling.mp4` — 최종 후보로 보이는 5테마 롤링 영상
- `12cut-exhibition-actual-service-fullscreen-no-qr.mp4` — QR 없는 풀스크린 버전
- `12cut-exhibition-actual-service-5theme-contact-sheet.jpg`
- `12cut-home-qr.png`
- `lover-ja-qr.mp4`, `friends-ja-qr.mp4`, `family-ja-qr.mp4`, `travel-ja-qr.mp4`, `self-ja-qr.mp4`
- `actual_frames*`, `actual_inputs`, `higgsfield_raw`, `overlays`

관련 문서:

- `MD/12CUT_exhibition_rolling_video_storyboard.md`

주의:

- 현재 스토리보드 destination은 `https://12cut.co.kr/`
- 공식 도메인을 `www.12cut.net`으로 전환한다면 QR/스토리보드/영상 내 표기도 같이 바꿔야 함
- 영상 산출물은 용량이 크고 프레임 디렉터리가 많으므로 커밋 여부를 별도 결정해야 함

---

## 3. 집에서 이어갈 실행 순서

### 1단계 — 현재 상태 재확인

```bash
cd /Volumes/jw/vibecording/12cut
git status --short
git diff --stat
git diff -- custom.css custom.js index.html skin/main/index.html
```

### 2단계 — B2B endpoint 결정

선택지:

| Option | 내용 | 판단 |
|---|---|---|
| A. 오늘 코드에서 B2B 모달 제거/보류 | 도메인 치환만 먼저 배포 가능 | 안정적 |
| B. Google Apps Script endpoint 완성 후 유지 | B2B 리드 수집까지 같이 오픈 | 전시/제휴 목적에 유리 |

권장:

- 라이브 급하면 **Option A**
- 전시 문의 수집이 오늘 목표면 **Option B**

### 3단계 — 검증

```bash
node --check custom.js
```

추가로 Cursor에서 `ReadLints`로 `custom.js`, `custom.css` 확인.

### 4단계 — 라이브 pull/diff 후 배포

공용/외주 공유 파일이므로 배포 전 라이브 기준 확인 필수.

- `/dobuddy/12cut/custom.js`
- `/dobuddy/12cut/custom.css`
- `/data/skin/front/moment/main/index.html`

배포는 기존 `.deploy.exp` 사용.

예상 배포 대상:

```text
custom.css -> /dobuddy/12cut/custom.css
custom.js -> /dobuddy/12cut/custom.js   # B2B endpoint 해결 후에만
skin/main/index.html -> /data/skin/front/moment/main/index.html
```

### 5단계 — 라이브 검증

```bash
curl -s "https://12cut.co.kr/?z=$RANDOM" | grep -c 'href="/goods/goods_view.php?goodsNo=1000000000"'
curl -s "https://12cut.co.kr/dobuddy/12cut/custom.css?z=$RANDOM" | grep -c 'url(/dobuddy/imgs/sns_google.png)'
curl -s "https://12cut.co.kr/dobuddy/12cut/custom.js?z=$RANDOM" | grep -c 'openB2B'
```

도메인 전환 후에는:

```bash
curl -sI "https://12cut.co.kr/?z=$RANDOM" | grep -iE "HTTP/|location"
curl -sI "https://www.12cut.net/?z=$RANDOM" | head -n 5
```

---

## 4. 커밋 제안

B2B endpoint를 아직 못 붙이면 커밋을 2개로 나누는 것이 안전함.

### Commit 1

```text
docs: record www domain migration plan
```

포함:

- `MD/DOMAIN_MIGRATION_www-12cut-net.md`

### Commit 2

```text
fix: make homepage links domain agnostic
```

포함:

- `custom.css`
- `index.html`
- `skin/main/index.html`

### Commit 3 — endpoint 완료 후

```text
feat: add business inquiry form
```

포함:

- `custom.js`

단, `REPLACE_WITH_DEPLOYED_WEB_APP_ID`가 남아 있으면 커밋/배포하지 말 것.

영상 산출물은 별도:

```text
chore: add exhibition video assets
```

단, 프레임 디렉터리까지 커밋할지, 최종 mp4/contact sheet만 커밋할지 먼저 결정.

---

## 5. Critical Question

B2B 문의 CTA의 1차 목적이 **전시 현장 리드 수집**인지, 아니면 **일반 사이트 하단의 보조 문의 채널**인지 먼저 결정해야 함.

- 전시 리드 수집이면: 홈 중간/하단에 더 명확한 CTA 섹션 필요
- 보조 문의 채널이면: 현재처럼 푸터 링크 삽입이 적절

이 결정을 하지 않으면 B2B 폼의 위치, 문구, 수집 항목, Google Sheet 구조가 계속 흔들림.
