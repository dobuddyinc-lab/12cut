<!-- VERCEL BEST PRACTICES START -->
## Best practices for developing on Vercel

These defaults are optimized for AI coding agents (and humans) working on apps that deploy to Vercel.

- Treat Vercel Functions as stateless + ephemeral (no durable RAM/FS, no background daemons), use Blob or marketplace integrations for preserving state
- Edge Functions (standalone) are deprecated; prefer Vercel Functions
- Don't start new projects on Vercel KV/Postgres (both discontinued); use Marketplace Redis/Postgres instead
- Store secrets in Vercel Env Variables; not in git or `NEXT_PUBLIC_*`
- Provision Marketplace native integrations with `vercel integration add` (CI/agent-friendly)
- Sync env + project settings with `vercel env pull` / `vercel pull` when you need local/offline parity
- Use `waitUntil` for post-response work; avoid the deprecated Function `context` parameter
- Set Function regions near your primary data source; avoid cross-region DB/service roundtrips
- Tune Fluid Compute knobs (e.g., `maxDuration`, memory/CPU) for long I/O-heavy calls (LLMs, APIs)
- Use Runtime Cache for fast **regional** caching + tag invalidation (don't treat it as global KV)
- Use Cron Jobs for schedules; cron runs in UTC and triggers your production URL via HTTP GET
- Use Vercel Blob for uploads/media; Use Edge Config for small, globally-read config
- If Enable Deployment Protection is enabled, use a bypass secret to directly access them
- Add OpenTelemetry via `@vercel/otel` on Node; don't expect OTEL support on the Edge runtime
- Enable Web Analytics + Speed Insights early
- Use AI Gateway for model routing, set AI_GATEWAY_API_KEY, using a model string (e.g. 'anthropic/claude-sonnet-4.6'), Gateway is already default in AI SDK
  needed. Always curl https://ai-gateway.vercel.sh/v1/models first; never trust model IDs from memory
- For durable agent loops or untrusted code: use Workflow (pause/resume/state) + Sandbox; use Vercel MCP for secure infra access
<!-- VERCEL BEST PRACTICES END -->

<!-- 12CUT GODOMALL RULES START -->
## 12cut 고도몰 커스터마이징 규칙 (최우선)

12cut.co.kr은 고도몰(Godo Mall) 기반이며, 공용 스크립트 위에 서비스별 오버라이드로 동작합니다.
여러 서비스(`12cut`, `bd2`, `vsquare`, `donut`)가 **공용 자원**을 공유하므로, **타 서비스 영향은 절대 금지**입니다.

### 절대 수정 금지 (공용 자원)
- `https://browndust2-goods.com/dobuddy/global.js` — 전 서비스 공용 스크립트
- `https://browndust2-goods.com/dobuddy/global.css` — 전 서비스 공용 스타일
- 이 파일들은 **읽기만** 한다. 문제 원인이 공용 파일이어도 **반드시 12cut 측 오버라이드로만** 해결한다.

### 수정 허용 범위 (12cut 전용)
- `/dobuddy/12cut/custom.css` — 12cut 전용 스타일 오버라이드
- `/dobuddy/12cut/custom.js` — 12cut 전용 스크립트 (`global.js`가 `setLib('/dobuddy/${alias}/custom.js')`로 서비스별 분기 로드)
- `/data/skin/front/moment/**` — 12cut 사이트 스킨 (`moment`)

### 로딩 체인 & 캐시 (중요)
- `_header.html` → 공용 `global.js`(browndust2) → `alias` 판별 → `setLib('/dobuddy/12cut/custom.js')` → `custom`(main/beforeRun/afterRun) 정의
- `custom.afterRun()`는 `global.js`의 `run()` 마지막에 호출됨 (DOM·`data-i` 세팅 완료 후)
- **`alias` 함정**: 실제 로드되는 건 **CDN 판** `https://browndust2-goods.com/dobuddy/global.js`이며, 여기에는 매핑에 `'12cut':'12cut'`가 있어 정상. 단, `https://12cut.co.kr/dobuddy/global.js`(오리진 사본)는 이 키가 빠진 **구버전**이라 alias=undefined가 나온다. **분석 시 반드시 `_header.html`이 실제 로드하는 CDN URL을 봐야 한다.**
- **CSS/JS 캐시버스팅(유일하게 신뢰 가능)**: `_header.html`에서 `{=setBrowserCache('/dobuddy/12cut/파일')}` 사용 → `?ts=filemtime` 자동 부여. **파일 수정 시 URL이 바뀌어 모든 기기(폰 포함) 캐시를 무조건 우회**한다.
- **`setLib` 함정 1**: URL 마지막 3글자가 `css`일 때만 `<link>`로 처리. `custom.css?v=...`처럼 쿼리를 붙이면 `<script>`로 로드되어 **스타일 미적용**.
- **`setLib` 함정 2 (중요)**: `setLib`는 `custom.js`를 **버전 파라미터 없이** 로드한다. 따라서 `custom.js`는 엣지/브라우저 캐시(특히 폰)에 옛 버전이 오래 남는다. **`?b=$RANDOM` 같은 무작위 쿼리는 엣지가 무시하고 stale을 주는 경우가 있다.** → **JS 신규 로직은 `custom.js`에 의존하지 말고 별도 파일로 분리해 `_header.html`에서 `setBrowserCache`로 로드할 것.**
- **`.htaccess` 캐시 제어**: `/dobuddy/12cut/.htaccess`에 `mod_headers`로 js/css를 `Cache-Control: no-cache, must-revalidate`로 설정함(적용 확인됨, 12cut 폴더 한정). 단 반영에 origin→엣지 전파 지연(1~2분) 있음.
- 오리진 업로드 후 엣지 반영까지 **1~2분 지연** 있음. 업로드 직후 curl이 stale이면 잠시 후 재확인한다.
- 스킨 템플릿(`_header.html`) 변경은 고도몰 컴파일 캐시로 반영까지 ~20초 소요 가능

### 상품 이미지 갤러리 (도트 인디케이터 + 스와이프) — 구현 위치
- **`/dobuddy/12cut/gallery.js`** (독립 파일, `_header.html`에서 `setBrowserCache`로 로드). 캐시 무관·`custom.js` 실행 여부 무관하게 동작.
- 동작: `/goods/goods_view.php`에서만 실행 → 요소 등장까지 폴링(최대 12s, `global.js`의 `#app` 재구성 타이밍 흡수) → `.img_photo_big`(주의: **`<span>` 인라인 요소**)에 `display:block` 부여 후 도트 absolute 배치.
- 도트 위치는 `bottom:14px`(퍼센트 금지: 인라인 span에서 % 높이가 0으로 해석되어 모바일에서 안 보였던 핵심 버그).
- 동기화: `window.gd_change_image`를 후킹해 썸네일 클릭/스와이프/화살표 모든 경로에서 활성 도트·슬라이드 애니 일원화.
- 스와이프: **Pointer Events**(PC 마우스+모바일 터치 통합) + `touch-action:pan-y`(폰에서 가로 제스처가 스크롤로 소비되어 `pointercancel`나는 것 방지). 도트는 `pointer-events:auto`로 클릭 시 해당 이미지 이동.
- `custom.js`에는 갤러리 로직을 두지 않는다(중복 방지). `custom.js`는 편집기 버튼('스토리 만들기') 등 나머지만 담당.

### 검증 원칙
- 변경 후 `curl`로 오리진 직접 확인(캐시 우회 `?z=$RANDOM`). 서버 반영과 브라우저 캐시를 분리해 진단한다.
- 모바일 전용 이슈는 **Mac 브라우저 리사이즈 ≠ 실제 폰**임을 명심: 실제 폰은 ① 캐시(특히 `setLib` 무버전 로드) ② 인라인 요소의 % 높이 해석 ③ `touch-action` 부재로 인한 제스처 소비 — 이 3가지가 데스크톱과 다르게 동작한다.
- "안 바뀜" 증상은 ① 공용(CDN)/전용 파일 혼동 ② `?v=`로 인한 setLib CSS 오판 ③ `custom.js`의 무버전 캐시 — 우선 점검. 신규 JS는 `gallery.js`처럼 `setBrowserCache` 로드로 캐시 문제를 원천 차단한다.
- 임시 진단이 필요하면 `?dbg=1` 쿼리에서만 보이는 화면 오버레이 로거를 쓴다(고객 비노출).

### SFTP 접속
- 호스트: `gdadmin-dobuddy39.godomall.com` (포트 17662) = **12cut 서버**. browndust2 등 타 서버에는 쓰기 불가(=구조적 격리).

### 브랜드
- 브랜드 액센트 컬러: `#F63237` (CTA, 활성 인디케이터 등 강조 요소에 사용)
<!-- 12CUT GODOMALL RULES END -->
