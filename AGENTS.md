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
- 호스트: `gdadmin-dobuddy39.godomall.com` (포트 **17662**, 17762 아님) = **12cut 서버**. browndust2 등 타 서버에는 쓰기 불가(=구조적 격리).
- 계정: `dobudd0438` / `donut583015` (검증됨). 원격 루트에 `dobuddy`·`data` 존재. 대상 경로 `/dobuddy/12cut/`.
- **`sshpass` 함정(중요)**: 이 맥에서 `sshpass`는 비번 주입에 실패해 항상 `Permission denied (password)`가 난다(자격증명은 정상). → **`expect`로 비번을 직접 타이핑하는 방식**으로 접속/업로드할 것. 서버는 구형 `ssh-rsa` 호스트키만 제공하므로 `-o HostKeyAlgorithms=+ssh-rsa -o PubkeyAcceptedAlgorithms=+ssh-rsa` 필요. paramiko는 호스트키 협상에서 막혀 부적합.
- GUI(Cyberduck/FileZilla) 사용 시 **프로토콜을 반드시 SFTP로**(FTP면 "SSH-2.0-FTP Server ready" 파싱 실패).

### 홈 = 네이티브 랜딩 이식 (iframe 폐기, 현행 구조 / 배포·검증됨)
- **이전 구조(폐기)**: 홈을 `custom.js`가 iframe으로 랜딩(pages.dev)을 덮어씌움 → 헤더 깜박임·SEO 불가. iframe/스플래시(`iframe-ready`, `cut-splash-out`) 로직은 **전부 제거됨**.
- **현행 구조(B′ 단일소스화 완료 / 배포·검증됨)**: 랜딩 `<body>` 마크업을 **고도 스킨 `/data/skin/front/moment/main/index.html`** 에 직접 이식(고도 템플릿 토큰으로 래핑). **에셋은 자사 인프라로 전환 완료 → `pages.dev` 의존 0**: ① 이미지·CSS·OG는 **고도 스킨 경로 `/data/skin/front/moment/img/home/...`**, ② 영상은 **`https://img.12cut.net/12cut_prod/`**(nginx, Range 206 지원). `custom.js` main()은 홈에서 **iframe 미주입**, `dev=1`일 때만 편집기 미리보기 iframe 유지.
  - *(히스토리)* 이전엔 Option B-2 하이브리드 = 마크업은 스킨, 에셋은 `https://12cut.pages.dev/`(외부 Cloudflare)였음. 아래 "단일소스 전환 완료" 참조.
- **`custom.css`의 홈(`.body-index`) 오버라이드**: 고도 `#header_warp`·`#footer_wrap`·`.location_wrap`·`.side_cont`·`#foot-bar` 숨김 + `#wrap/#container/#contents/.sub_content/.content_box` 폭·여백·float 해제(랜딩 풀폭 렌더).

#### 홈 네이티브 이식의 핵심 함정 3개 (반드시 숙지)
1. **`.sub_content{display:none}` 함정 (블랭크 화면 주범)**: `global.css`에 `.sub_content{display:none}`이 있고, `global.js`는 `if(!ui.myCustom)$('.sub_content').show()`로만 해제. **12cut은 `ui.myCustom`이 truthy** → `.sub_content`가 영구 숨김 → 그 안에 이식한 랜딩 전체가 안 보여 "아무것도 안 뜸". → `custom.css`에서 `.body-index #contents,.body-index .sub_content{display:block!important}`로 **강제 노출**해야 함.
2. **공용 마퀴 함정 (헤더 위 띠)**: `global.js`가 `ui.gdEtc.settings.marquee[lang]`이 있으면 jquery.marquee로 `<div class='fade-in marquee'>…</div>`를 만들어 **`prependTo('body')`** → body 최상단(=`#header_warp`보다 바깥)에 붙음. 그래서 헤더를 숨겨도 띠가 위에 남음. → **`body>.marquee{display:none!important}`**(custom.css, 12cut 전 페이지)로 숨김. 랜딩의 `.examples__marquee`(필름릴)와는 **클래스가 달라 무관**.
3. **`body{opacity:0}` 함정**: 고도 기본 `main/index.html` 템플릿엔 인라인 `body{opacity:0;transition}`이 있어 JS가 1로 돌려줘야 보임. 네이티브 이식본에선 이 인라인을 제거하되, 안전망으로 `custom.css`에 `.body-index{opacity:1!important}` 둠.

#### 홈→상품 전환 매끄러움 (배포·검증됨)
- **CTA는 같은 탭 이동**: 히어로/Pricing CTA에서 `target="_blank"` 제거. 새 탭이면 빈 흰 탭이 먼저 뜬 뒤 고도가 헤더 재구성하며 깜박임 → 같은 탭이면 브라우저 paint-holding으로 흰 깜박임 최소화. (이전 iframe 땐 `parent.location=`이라 같은 탭이었음 → 동작 복원)
- **히어로 영상 로드 전 배경**: `<video>`의 `poster`(제품 스틸)를 제거 → 로드 전엔 `.hero{background:var(--black)}` 검정 배경만 잠깐 보이고 영상 시작(poster 프레이밍이 영상과 달라 늘어나 보이던 문제 해소). FAQ 영상 poster는 유지.

#### main/index.html 수정 워크플로
- 라이브 스킨 파일을 직접 `expect`+`sftp get`으로 받아(`/data/skin/front/moment/main/index.html`) `/tmp`에서 편집 후 `put`. 스킨 템플릿은 컴파일 캐시로 반영 ~20초.
- **백업**: 원본 홈 템플릿은 `/tmp/skin_main_index.html`(롤백 시 iframe 구조 복구 가능).

#### 단일소스 전환 완료 (2026-06 / 배포·검증됨)
- **결과**: 라이브 홈(`12cut.co.kr`)의 `pages.dev` 참조 **24 → 0**. 외부 Cloudflare 의존 완전 제거, 전부 자사 인프라.
- **핵심 발견(경로 파이프라인 차이)**: `/dobuddy/12cut/`는 **신규 파일/디렉터리 동기화 30분+ 지연**이라 단일소스화를 막던 병목이었음. 반면 **고도 표준 스킨 경로 `/data/skin/front/moment/img/home/`는 신규 파일·디렉터리(`img/home/`)도 origin·CDN 즉시 200** 서빙. → 정적 에셋(이미지·CSS·OG)은 스킨 경로로, **영상은 `img.12cut.net`으로 분리**.
- **`img.12cut.net` = 통합 미디어 서버(nginx)**: `api.php`(주문 추적, `custom.js`에서 호출) **+ 이미지/영상 호스팅 겸용** 서버임(이름이 `img`이나 API도 받음, 혼동 주의). 영상은 `/12cut_prod/`에 위치(`hero.mp4`, `prod.mp4`). 헤더에 `Cache-Control` 명시는 없으나 **미디어 캐시 30일**(개발자 확인).
- **영상 캐시 정책 = 파일명 버전(Option A 채택)**: 캐시 30일이라 같은 파일명 덮어쓰면 최대 한 달 stale. → **교체 시 파일명에 버전 부여**(`hero.mp4`→`hero-v2.mp4`). 개발자가 업로드 후, `main/index.html`의 `<source src>` 한 줄만 수정해 반영. (배너관리 연동(B안)은 히어로 배경 영상의 `autoplay muted loop playsinline` 속성 보장 불확실로 보류.)
- **치환 규칙(재현용)**: `main/index.html`에서 `https://12cut.pages.dev/assets/videos/hero-bg.mp4`→`https://img.12cut.net/12cut_prod/hero.mp4`, `.../product-exploded.mp4`→`.../prod.mp4`, 나머지 `https://12cut.pages.dev/`→`/data/skin/front/moment/img/home/`. 업로드 배치 원본은 `.sftp_batch.txt`.

#### 히어로 배경·카피 현황 (2026-06 / 배포·검증됨)
- **히어로 배경 = 정지 이미지(임시)**: 영상 제작 전까지 `<video>` 대신 `<img class="hero__video">` 사용. 소스는 골든아워 교실 창가에서 12cut을 든 손 컷 → `assets/images/hero-still.webp`(원본 2752×1536 JPEG 2.5MB를 폭 1920·q82 webp로 75KB 변환). 스킨 경로 `/data/skin/front/moment/img/home/assets/images/hero-still.webp?v=1`로 로드. **원본 JPEG(`Delicate_shot_...jpeg`)은 영상 소스라 로컬 보관, git 미추적**(처리 방식 A=.gitignore / B=assets/sources 보관 미정).
- **영상 복원법**: 영상 완성 시 `main/index.html`의 `<img ...hero-still.webp...>` 한 줄을 `<video autoplay loop muted playsinline preload="auto" class="hero__video"><source src="https://img.12cut.net/12cut_prod/hero.mp4"></video>`로 되돌리면 됨. **히어로 영상(`hero.mp4`)·FAQ 영상(`prod.mp4`)은 `img.12cut.net/12cut_prod/`에 그대로 보존**(200·Range 206 확인).
- **히어로 딤 완화**: `.hero__overlay` 검정 오버레이 `rgba(26,26,26,0.65)→0.45`(따뜻한 빛 강조, 중앙 흰 헤드라인 가독 유지). 더 밝게=0.35/더 어둡게=0.55로 조정 가능. 텍스트가 정중앙이라 균일딤 한계 시 방사형 그라데이션(가장자리 밝게+중앙 보호) 대안 있음.
- **슬로건 강조**: `.hero__title` `clamp(30,4.6vw,60)→clamp(34,5.4vw,76)`, 12CUT 로고는 `height:1.3em` 비례 자동 확대. 슬로건↔CTA 간격 24→36px. **subtitle 제거**(eyebrow "Film Slide Viewer"와 정보 중복 → A안: eyebrow 유지/subtitle 삭제). `section-label` ×6(Gallery/Product/How It Works/Stories/Pricing/FAQ)은 스캔 앵커라 유지.
- **캐시버전**: `main/index.html`의 `style.css?v=N` 쿼리로 CSS 캐시 우회. **현재 `?v=5`**(다음 CSS 수정 시 `?v=6`으로 올릴 것).
- **영상 시나리오(미확정)**: A안 "창가의 빛"(히어로 배경용, 8~12초 루프 무음, 느린 push-in) **권장** / B안 "12개의 장면"(제품 기능 몽타주, 별도 필름) / C안 "둘의 하루"(브랜드 필름, 장기). 한 촬영으로 A+B 동시 확보 가능.

#### 미해결/다음 작업
- **영상 제작 → 히어로 복원**: A안 시나리오로 히어로 배경 영상 제작 후 위 "영상 복원법"대로 `<img>`→`<video>` 전환.
- **원본 JPEG 처리**: `.gitignore` 제외(A) vs `assets/sources/` 보관 커밋(B) 결정.
- **push 여부**: 현재 `main`이 `public/main`보다 앞섬. **`public/main`이 공개 원격이면 `.sftp_batch.txt`(SFTP 서버 경로 구조 포함) push 적절성 확인** 필요.
- **히어로 미세조정(선택)**: 모바일 슬로건 줄바꿈(하한 34px→32px 여부), 76px에서 12CUT 로고 밸런스(`1.3em→1.15em` 여부) — 실기기 확인 후 판단.
- **git 커밋**: `gallery.js`(신규), `.htaccess` 변경 스냅샷 미커밋(이번 세션의 `custom.css`/`custom.js`/`style.css`/`AGENTS.md`/히어로 이미지는 커밋 완료).

### 브랜드
- 브랜드 액센트 컬러: `#F63237` (CTA, 활성 인디케이터 등 강조 요소에 사용)
<!-- 12CUT GODOMALL RULES END -->
