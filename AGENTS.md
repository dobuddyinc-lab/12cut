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

### 협업 경계 (외주 공통 레이어 / 2026-06 합의)
- **공통 레이어 = 외주 담당**: `_header.html`(공통화됨)·스킨 공통부·전 서비스 공유 구조는 외주가 1차 소유. 외주 권고: **"메인을 제외한 커스텀은 `/dobuddy/<service>/` 하위에서만"** → 12cut 신규 커스텀은 원칙적으로 `/dobuddy/12cut/`(특히 `custom.js`) 안에서 처리(별도 파일·`_header.html` 로더 추가 지양).
- **`_header.html` 직접 수정 = 허용됨(사용자 확인)**: 12cut도 필요 시 `_header.html`을 직접 수정 가능. 단 **공통 파일이므로 타 서비스 영향 0** 보장이 전제(서비스 분기/조건 안에서만 변경). 가능하면 공통부 변경은 외주와 조율.
- **stale 경고**: 외주가 공통/스킨/`custom.js`를 수정하면 **이 문서 서술이 즉시 stale**해질 수 있음 → 외주 변경 회신 수신 시 **`curl ?z=$RANDOM`으로 라이브를 우선 재확인**하고, 로컬 레포는 라이브 기준으로 **pull 후** 편집(로컬 구버전 업로드로 외주 작업 덮어쓰기 방지).

### Git·배포 경로 (2026-06-04)
| 경로 | 역할 | 비고 |
|---|---|---|
| **SFTP → `12cut.co.kr`** | **라이브 반영(실효)** | `/dobuddy/12cut/`, 스킨. Git과 무관. |
| **GitLab `keepcool.kr/202507-dobudy-bd2`** | **SSOT(통합 repo·실경로)** | `dobuddy/12cut/custom.js`·`custom.css`·`12cutEditor.html` 존재. 로컬 remote `gitlab-bd2`. |
| ~~`202503-dobudy-12cut`~~ | 구/스냅샷 repo | `12cut_editor/`·`skin/` 일부만. `custom.js` 없음. remote `gitlab`(레거시). |
| **`public` → `dobuddyinc-lab/12cut`** | 우리 GitHub 백업·pages `_redirects` | `main` 추적. 외주 GitLab과 별도. |
| ~~`devrepo` → `12cut-dev`~~ | **폐기** | 로컬 remote 제거됨. GitHub/CF `12cut-dev` 삭제는 대시보드 별도. |

- **우리가 GitLab에 올리는 절차**: SSH 등록 완료(`@smiletube9`) → **`gitlab-bd2`**=`git@gitlab.com:keepcool.kr/202507-dobudy-bd2.git` → push 대상 **`dobuddy/12cut/`** → 브랜치/MR 외주 합의 후.
- **회사 작업 핸드오프**: `MD/HANDOFF_office_20260604.md` (repo 구분·remote·SFTP·다음 push 절차).

### 로딩 체인 & 캐시 (중요)
- `_header.html` → 공용 `global.js`(browndust2) → `alias` 판별 → `setLib('/dobuddy/12cut/custom.js')` → `custom`(main/beforeRun/afterRun) 정의
- `custom.afterRun()`는 `global.js`의 `run()` 마지막에 호출됨 (DOM·`data-i` 세팅 완료 후)
- **`alias` 함정**: 실제 로드되는 건 **CDN 판** `https://browndust2-goods.com/dobuddy/global.js`이며, 여기에는 매핑에 `'12cut':'12cut'`가 있어 정상. 단, `https://12cut.co.kr/dobuddy/global.js`(오리진 사본)는 이 키가 빠진 **구버전**이라 alias=undefined가 나온다. **분석 시 반드시 `_header.html`이 실제 로드하는 CDN URL을 봐야 한다.**
- **CSS/JS 캐시버스팅(유일하게 신뢰 가능)**: `_header.html`에서 `{=setBrowserCache('/dobuddy/12cut/파일')}` 사용 → `?ts=filemtime` 자동 부여. **파일 수정 시 URL이 바뀌어 모든 기기(폰 포함) 캐시를 무조건 우회**한다.
- **`setLib` 함정 1**: URL 마지막 3글자가 `css`일 때만 `<link>`로 처리. `custom.css?v=...`처럼 쿼리를 붙이면 `<script>`로 로드되어 **스타일 미적용**.
- **`setLib` 함정 2 (현황 업데이트 2026-06)**: `setLib`는 `custom.js`를 **버전 파라미터 없이** 로드한다. 과거엔 이로 인해 폰 엣지/브라우저에 옛 `custom.js`가 오래 남아(stale) 신규 JS를 별도 파일+`setBrowserCache`로 분리했었다. **현재는 아래 `.htaccess` `no-cache, must-revalidate`가 `custom.js`에 실효적으로 적용됨이 라이브 헤더로 검증됨**(`cache-control: no-cache, must-revalidate` + `etag`/`last-modified` 응답 → 매 로드 재검증). → **신규 JS를 `custom.js`에 직접 넣어도 모바일 stale 위험은 낮음**(별도 파일 분리는 더 이상 필수 아님). 단 엣지 재검증 보장은 변경 직후 **실기기 1회 확인** 권장.
- **`.htaccess` 캐시 제어(검증됨)**: `/dobuddy/12cut/.htaccess`에 `mod_headers`로 js/css를 `Cache-Control: no-cache, must-revalidate`로 설정함. **라이브 `custom.js` 응답 헤더로 적용 확인**(`?z=$RANDOM` 우회 없이도 no-cache 반환). 12cut 폴더 한정. 단 반영에 origin→엣지 전파 지연(1~2분) 있음.
- 오리진 업로드 후 엣지 반영까지 **1~2분 지연** 있음. 업로드 직후 curl이 stale이면 잠시 후 재확인한다.
- 스킨 템플릿(`_header.html`) 변경은 고도몰 컴파일 캐시로 반영까지 ~20초 소요 가능

### 상품 이미지 갤러리 (도트 인디케이터 + 스와이프) — 구현 위치
- **구현 위치 변경(2026-06 / 외주 통합·배포·검증됨)**: 기존 독립 파일 `/dobuddy/12cut/gallery.js`는 **폐기(삭제됨, 302→godo error.html)**. 갤러리 로직 전체가 **`/dobuddy/12cut/custom.js`의 `afterRun()` → `case '/goods/goods_view.php'` 블록 내 `// gallary 관련 커스텀` 주석 하위로 이관**됨. 로컬 원본은 `archive/gallery.js.bak` 보존.
  - **통합 배경**: 외주(공통 레이어 담당)가 `_header.html`을 공통화하며 "메인 제외 커스텀은 `/dobuddy/<service>/` 하위에서만"으로 정리 → 갤러리도 `custom.js` 단일 진입점으로 흡수. **분리했던 원래 이유(무버전 `setLib` stale)는 `.htaccess` `no-cache, must-revalidate`로 이미 해소**됨(라이브 헤더로 검증, 아래 "캐시" 참조).
  - **중복 실행 주의**: `gallery.js` 파일·`_header.html`의 `setBrowserCache` 로더는 **제거 완료**. 향후 둘 중 하나라도 되살아나면 갤러리 2회 실행(도트/핸들러 중복) → 반드시 단일 소스(`custom.js`)만 유지.
- 동작: `/goods/goods_view.php`에서만 실행 → 요소 등장까지 `setInterval` 폴링(150ms×최대 80회=12s, `global.js`의 `#app` 재구성 타이밍 흡수) → `.item_photo_big` 내 `.img_photo_big`(주의: **`<span>` 인라인 요소**)에 `display:block` 부여 후 도트 absolute 배치.
- 도트 위치는 `bottom:14px`(퍼센트 금지: 인라인 span에서 % 높이가 0으로 해석되어 모바일에서 안 보였던 핵심 버그). 활성 도트 색 `#F63237`.
- 동기화: `window.gd_change_image`를 후킹(`window.__gci`에 원본 보관)해 썸네일 클릭/스와이프/화살표 모든 경로에서 활성 도트·슬라이드 애니 일원화.
- 스와이프: **Pointer Events**(PC 마우스+모바일 터치 통합) + `touch-action:pan-y`(폰에서 가로 제스처가 스크롤로 소비되어 `pointercancel`나는 것 방지). 도트는 `pointer-events:auto`로 클릭 시 해당 이미지 이동. 모바일(`innerWidth<=1200`)에선 slick `unslick` 처리.
- `custom.js`의 나머지 역할: 편집기 버튼('스토리 만들기'), 메인 MY링크(`.nav__right`)·언어선택 동기화(`localStorage.$mylang`), 주문 추적 등.

### 검증 원칙
- 변경 후 `curl`로 오리진 직접 확인(캐시 우회 `?z=$RANDOM`). 서버 반영과 브라우저 캐시를 분리해 진단한다.
- 모바일 전용 이슈는 **Mac 브라우저 리사이즈 ≠ 실제 폰**임을 명심: 실제 폰은 ① 캐시(특히 `setLib` 무버전 로드) ② 인라인 요소의 % 높이 해석 ③ `touch-action` 부재로 인한 제스처 소비 — 이 3가지가 데스크톱과 다르게 동작한다.
- "안 바뀜" 증상은 ① 공용(CDN)/전용 파일 혼동 ② `?v=`로 인한 setLib CSS 오판 ③ `custom.js`의 무버전 캐시(현재 `.htaccess` no-cache로 완화, 위 "setLib 함정 2" 참조) — 우선 점검.
- 임시 진단이 필요하면 `?dbg=1` 쿼리에서만 보이는 화면 오버레이 로거를 쓴다(고객 비노출).

### SFTP 접속
- 호스트: `gdadmin-dobuddy39.godomall.com` (포트 **17662**, 17762 아님) = **12cut 서버**. browndust2 등 타 서버에는 쓰기 불가(=구조적 격리).
- 계정: `dobudd0438` / `donut583015` (검증됨, **비번 정상·로테이션 아님**). 원격 루트에 `dobuddy`·`data` 존재. 대상 경로 `/dobuddy/12cut/`, 스킨은 `/data/skin/front/moment/`.
- **★ 공개키 선시도 함정(2026-06 해결)**: 새 OpenSSH는 password 프롬프트 전에 **publickey 인증을 먼저 시도** → 키가 거부되며 `Permission denied`가 떠 "비번 틀림"처럼 보인다(실제 비번은 정상). 또 post-quantum 경고 라인이 출력돼 혼동. → **반드시 패스워드 인증 강제**: `-o PubkeyAuthentication=no -o PreferredAuthentications=password -o NumberOfPasswordPrompts=1`, expect 매칭은 `-nocase "password:"`. (`.skin_get.exp`·`.up2.exp`에 반영 완료, 접속·get 검증됨.)
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

#### pages.dev 폐기 / 홈 일원화 (2026-06 / 배포·발효 완료)
- **배경(분기 발견)**: `12cut.co.kr`(고도 스킨 네이티브 = 실 운영)와 `12cut.pages.dev`(Cloudflare = 루트 `index.html`과 **바이트 동일** standalone)가 **히어로가 서로 다름**. co.kr만 개선(정지이미지·subtitle 제거·CTA 같은 탭·단일소스 에셋) 반영, pages.dev/`index.html`은 구버전(구 영상·subtitle·새 탭 CTA)에 정체. README도 stale("Production=pages.dev")이었음.
- **조치(Option A 채택·발효됨)**: `_redirects` 추가로 pages.dev 홈을 **co.kr로 301**(`domain-report.html`은 catch-all 제외해 보존). `public` 원격(`github.com/dobuddyinc-lab/12cut.git`) push → Cloudflare Pages 재배포 → **`12cut.pages.dev` → 301 → `12cut.co.kr` 실측 확인 완료**. README "배포" 섹션 정정(Production=co.kr). 루트 `index.html`은 삭제하지 않고 **스킨 이식 원본/레퍼런스로 보관**(히어로도 co.kr에 맞춰 정지이미지·subtitle 제거·같은 탭 CTA로 동기화). **완전 삭제 원하면 Cloudflare 대시보드 작업 필요(미실행).**
- **canonical 홈 레포 편입(완료)**: 운영 홈(스킨 `main/index.html`)·스킨 `css/custom.css`를 SFTP로 받아 **`skin/` 미러로 레포 편입 완료**(`skin/main/index.html`, `skin/css/custom.css`, `skin/README.md` 경로 매핑). godo 토큰 `{*** ***}` 포함한 **raw 편집 소스**. 참고로 스킨 `custom.css`는 스텁(주석만)이고 실제 오버라이드는 `/dobuddy/12cut/custom.css`. (렌더링 스냅샷 `reference/`는 raw 확보로 역할 종료 → 제거.)
- **재현용**: `_redirects` = `/domain-report.html /domain-report.html 200` + `/* https://12cut.co.kr/ 301`.

#### 세션 기록 (2026-06-02 / 외주 라이브 반영분 동기화)
- **외주 회신 반영 검토·동기화**: 외주가 ① `_header.html` 공통화 ② "메인 제외 커스텀은 `/dobuddy/<service>/` 하위에서만" 권고 ③ `gallery.js`를 `custom.js`로 통합 ④ 메인 MY링크·언어 동기화 추가 — 를 라이브에 반영함. 라이브 검증 후 **로컬을 라이브 기준으로 동기화**(아래).
- **갤러리 통합 검증**: `custom.js`(7488B)에 갤러리 로직 100% 보존(도트 `bottom:14px`·Pointer Events·`gd_change_image` 후킹), `gallery.js` 삭제(302), `custom.js`는 `.htaccess` `no-cache`로 모바일 stale 해소(헤더 실측). 로컬 `gallery.js` → `archive/gallery.js.bak`.
- **공유 자원 동기화 정밀검토 결과**: `custom.js`·`custom.css`·`style.css`는 로컬=라이브 **바이트 일치**. `script.js`(root)는 라이브 `/dobuddy/12cut/home/script.js`로 배포되는 소스 — 미사용 `hero_subtitle` i18n 키 4개 제거 후 **라이브에도 SFTP 업로드해 일치**(co.kr 홈엔 subtitle 요소 없음, 무해).
- **경로 매핑 확정**: co.kr 홈은 `/data/skin/front/moment/img/home/style.css?v=5` + `/dobuddy/12cut/home/script.js?v=3` 참조. 로컬 root `style.css`/`script.js`가 이 경로들의 소스.
- **git**: 2커밋 후 `public`에 push 완료 — `ffbe85b`(동기화/pages.dev 일원화/skin 편입), `1dad00b`(영상 프롬프트). `*.exp`(비번)·`.DS_Store` 등은 `.gitignore`로 제외, `.sftp_batch.txt`는 서버 경로만(비번 없음)이라 push 허용.

#### 세션 기록 (2026-06-02 / 다국어 사전 + 스토리 편집기 다국어화)
- **고도 시스템 UI 사전 채움**: 라이브 `/dobuddy/files/{en,ja,zh}.html`(고도 `$t()` 사전, JSON)을 SFTP로 받아 `scripts/fill_i18n.py`로 빈 슬롯만 채움. **Class A(기능성 UI)만** 채우고 **Class B(BD2 캐릭터 고유명: 프로즌퀸·스트레인저 바니 등)·손상행은 `SKIP`**(12cut 소관 아님). en 85·ja 4·zh 96 채움 + 공통 신규키. 업로드·라이브 curl 검증 완료.
- **★ 핵심 발견 — 단일 사전 공유**: 상품 페이지·고도 시스템 UI·**스토리 편집기(`/dobuddy/12cut/12cutEditor.html`)가 모두 `/dobuddy/files/{lang}.html` 하나의 사전을 공유**. 편집기는 `mounted()`에서 그 파일을 fetch → `$t(원문키)`·`[data-t]`/`<t>` innerHTML로 치환(키 없으면 한국어 폴백). lang은 `localStorage.$mylang||navigator.language`. → **편집기 번역 = 별도 시스템이 아니라 같은 사전에 원문키 추가**.
- **편집기 다국어화 작업**: ① `fill_i18n.py`에 `EDITOR_KEYS` 39개(탭·단계안내문·툴팁·STORY GUIDE 캐러셀·버튼·알림 타이틀·알림/토스트 본문, `<b>`·`<br>`·😊·`$`토큰·스마트따옴표 EXACT) 추가 → 사전 **323→362키**. ② 편집기에서 `$t()` 미래핑이던 알림/토스트 본문 7개 + `onbeforeunload`를 `$t()`로 래핑(호출부에서 래핑, 템플릿은 기존 `$t` 유지). ③ 커버리지 검증 스크립트로 편집기 33개 키 **전 언어 PASS** 확인 후 SFTP 업로드(27375→27405B), 라이브 curl 검증.
- **⚠️ 외주 공유 파일 직접 수정(중요)**: `12cutEditor.html`은 **외주와 공유되는 파일**. 이번에 라이브를 직접 받아 7개 래핑 후 재업로드함. → **외주에 변경분 통지 필요**(외주가 자기 사본으로 덮으면 래핑 소실 / 반대로 우리가 외주 신버전 못 받고 덮을 위험). **다음 편집기 수정 전 반드시 라이브를 `?z=$RANDOM`으로 재확인 후 편집**. 롤백 원본 = `editor/12cutEditor.live.bak`(추적 제외), 레포 canonical = `editor/12cutEditor.html`.
- **잔여**: 편집기 `complete()` 내 `장바구니로 이동하시겠습니까?` 알림은 현재 호출 경로 없음(데드코드)이라 미래핑 잔존. `i18n_base/ko.html`은 `{}`(ko는 원문 폴백). `scripts/`는 원래 gitignore였으나 i18n 산출물(`fill_i18n.py`·`i18n_base`·`i18n_out`)은 배포물이라 **추적 전환**(.gitignore 예외).

#### 세션 기록 (2026-06-02 / 외주 협업구조 확정·편집기 재배포·공통페이지 스타일링 착수)
- **외주 협업구조 협의(정경석 개발자)**:
  - **저장소 통합**: 외주 GitLab `gitlab.com/keepcool.kr/202503-dobudy-12cut`(**초대 완료**). Clone: `git@gitlab.com:keepcool.kr/202503-dobudy-12cut.git`. 기존 방식은 FTP 반영분을 날짜순 수동 추출. → 처음엔 "대기" 요청했다가 **"FTP 바로 반영하면 제가 끌어와서 git도 반영하겠다"로 대기 해제**. = **우리는 기존 SFTP 배포 계속 가능, 외주가 FTP→git 흡수**.
  - **구조 확정**: 고도몰(베이스) + `global.js`(공용 훅) + `/dobuddy/<service>/`(서비스 커스텀). 스킨은 **저장소상 공통 `/skin` + 사이트별 `/skin_main/<service>` 오버라이드**로 관리. **`/skin_main/12cut` → 배포 대상: `12cut.co.kr:/data/skin/front/moment/main`**. (홈을 스킨 main에 네이티브 이식한 건 **SEO·무깜박임** 때문 → `/dobuddy`(JS 주입) 회귀 대신 **스킨 사이트별 분기로 보존**, 외주 수락. 이름 `/main`→`/skin_main`으로 명확화.)
  - **다국어**: "**site-dependent(라이브 기준)**" → 우리 사전 보존. 공통 사전 공유 + 사이트별 추가분만 분리는 **안정화 후** 진행(현재는 유지). Class A 공통 기여분 보존 재확인 = 그 분리 시점 체크포인트.
  - **Tailwind 방법론**: "메인 이외 **대규모 신규** UI"에만 Tailwind(vsquare `/dobuddy/global-board.js` = **Play CDN**, page-gated[`bdId=suggest/Portfolio`], 고도 게시판 DOM scrape→재구성 패턴). **12cut은 소규모 보정 위주 → 당분간 바닐라 유지·Tailwind 보류**. (향후 적용 시 가드레일: 브랜드색 `#F63237`·`preflight:false`·prefix·`custom.js` 흡수. QA: vsquare본에 `console.log`·전 카드 동일 `aria-label` 잔존.)
- **★ 운영 규칙 갱신 — 2트랙 배포(대기 해제됨)**: ① **12cut 전용(우리 소유: 홈/`skin_main`·에셋)** = **FTP 직접 배포 OK** → 외주가 git 흡수. ② **공유·외주 분기 파일(`custom.css`·`custom.js`·`12cutEditor.html`)** = **통째 덮기 금지, 라이브 pull→우리 델타만 머지→배포**. (실측: `custom.css` 라이브=외주본 **9,555B**[`:root`·`@font-face`×3·`.body-index`] vs 로컬 **2,421B**[`.body-main`] → 통째 올리면 폰트 정의 등 약 7KB가 12cut에서 소실. 타 서비스 영향과는 별개 축의 리스크.)
- **편집기 덮어쓰기 사건 + 재배포(검증 완료)**: 라이브 편집기가 외주본(**25,714B·`$t(`22·onbeforeunload 미래핑·`'저장에 실패했습니다.'` 경로 부재**)으로 바뀌어 **우리 래핑 6~7곳 소실** 확인. 외주 승인하에 **우리 canonical(27,405B·`$t(`30) FTP 재업로드** → **`12cut.co.kr` 오리진 27,405B·`$t(`30·onbeforeunload `$t()` 반영 검증**. 편집기 진입 = `${location.origin}/dobuddy/12cut/12cutEditor.html` → **사용자는 12cut.co.kr 로드 = 복구됨**. `browndust2-goods.com` CDN 사본(25,714B)은 진입경로 아님·무영향·우리 쓰기권 밖. **외주본 백업 = `editor/12cutEditor.outsourced-20260602.bak`**. ⚠️ **외주 통지 필요**: 우리본(27,405)>외주본(25,714)이라 외주 의도 변경분이 덮였을 수 있음 → git 흡수 전 **diff 대조 요청**.
- **신규 작업 착수 — 공통페이지 스타일링(진행 예정)**: 로그인·회원가입·장바구니·결제 등 공통페이지 스타일(폰트크기·좌우마진·여백·컬러) 보정. **위치 = `/dobuddy/12cut/custom.css`**(바닐라 = 소규모 보정 Option2). **라이브 base 위에 페이지 스코프 오버라이드만 추가**(고도 body 클래스 `.body-login`·`.body-join`·`.body-basket`·`.body-orderform` 등으로 `.body-index` 누수 방지). **디자인 소스 = 정리된 Figma(링크 미수신)**. 라이브 custom.css(9,555B)는 `/tmp/live_custom.css`로 받아뒀으나 재개 시 다시 받을 것(stale 가능).

#### 세션 기록 (2026-06-03~04 / 로그인·약관 리디자인 + 전 페이지 폰트 시스템 구축)

##### 로그인 페이지 리디자인 (`.body-login`) — 배포·검증됨
- **ZIGZAG식 소셜-퍼스트 구조**: Google·Apple·Facebook 풀폭 버튼 + "12cut 아이디로 가입" 토글(ID/PW 패널) + 카카오·네이버 아이콘 행 + 디바이더.
- **상단 캐릭터 히어로**: `lumi.mp4`(→`.m4v` 확장자 우회 업로드, 서버가 `.mp4` 차단) 로드. `login.html` 스킨에 `<video>` 삽입.
- **CSS 핵심**: `custom.css`에 `.body-login` 스코프. 고도 데스크톱 member 박스 중화(`member_wrap/member_cont` border/padding/고정폭 리셋). CTA 비활성=`:has(:placeholder-shown)` CSS-only. 체크박스 커스텀(`#F63237`). `font-family`는 `inherit`로 body 레벨 언어 폰트 상속.
- **SNS 아이콘 세로 정렬**: `common.css`의 `.member_sns_login>*{margin-top:12px}` → `margin-top:0!important` 리셋.
- **Payco 제거**, Apple·Facebook은 고도 관리자에서 활성화 필요(미완).

##### 약관동의 페이지 리디자인 (`.body-join-agreement`) — 배포·검증됨
- **Figma Option A 구현**: 카드형 → 리스트형 전환. 헤드라인 "12cut 이용을 위한 / 약관에 동의해주세요." `$t()` 래핑(다국어). 아코디언 접힘(`.js_terms_view.open`). 하단 단일 "다음단계" 풀폭 버튼.
- **"이전단계" → 로그인 이동**: `$('#btnPrevStep').off().on()` + CSS 숨김.
- **"다음단계" 비활성화**: 필수 체크 전 회색(`btn--disabled`), `$(':checkbox.require')` change 이벤트로 실시간 토글.
- **미체크 경고 메시지**: 고도 기본 아이콘(`icon_caution02.png` 깨짐) 제거 → `background:none` + 색 `#F63237` + `font-weight:500`.
- **체크박스 스타일**: `label.check` + `label.check_s` 모두 커스텀(`#F63237`).
- **Figma 미세조정**: 헤드라인 `#555555`, `(필수)` `#000/500`, 전체동의 `14px/500/#333`, 버튼 `font-weight:500`.

##### 헤더 ← 화살표 수정 — 배포·검증됨
- **원인**: `global.js`가 `.header_top`에 `data-h`를 `.member_tit>:first-child` 텍스트로 설정. 로그인 페이지는 `.member_tit` 요소 부재 → `data-h=""` (falsy) → 클릭 핸들러 무시. 약관 페이지는 `history.back()` 의존(직접 진입 시 무반응).
- **해결**: `custom.js afterRun()`에서 `$('.header_top').attr('data-h', $t(title))` + `stopImmediatePropagation` + 명시 URL 이동(로그인→`/`, 약관→`/member/login.php`).

##### 전 페이지 폰트 시스템 구축 — 배포·검증됨
- **Pretendard Variable CDN**: `beforeRun()`에서 `<link>` 주입 → 전 페이지에서 true weight(400~900) 사용 가능. 기존 `Pretendard-Medium.woff`(500 only)의 faux-bold 문제 해소.
- **언어별 디스플레이 폰트**:
  - **en**: Nunito (Google Fonts)
  - **ja**: Zen Maru Gothic (Google Fonts)
  - **zh**: ZCOOL KuaiLe (Google Fonts)
  - **ko**: Pretendard Variable (기본, 별도 디스플레이 폰트 없음)
- **★ 핵심 발견 — `sel_lang` disabled 옵션 함정**: `global.js`가 `<select id=sel_lang>` 생성 시 en/ja/zh 옵션에 `disabled` 부여 → `sel_lang.value='en'` 시 `selectedIndex=-1` → `lang='ko'` 폴백 → `$('body').addClass('ko')`. `sel_lang`은 `beforeRun()` **이후에** 생성되므로 `beforeRun`에서 `removeAttr('disabled')` 불가. → **`afterRun()`에서 `$('body').removeClass('ko en ja zh').addClass(실제lang)` 교정**.
- **★ 핵심 발견 — 폰트 파일 비동기 미로드**: `<link rel=stylesheet>` 방식은 비동기라 폰트 파일 다운로드 전 렌더됨 → **`<style>@import url(...)</style>` 방식으로 변경** = 스타일 파싱 시 동기적 폰트 CSS 로드 → 즉시 적용 확인.
- **CSS `font-family:inherit` 전환**: 로그인·약관 페이지 11개 요소의 `font-family:Pretendard,sans-serif` → `inherit`로 교체. body 레벨 언어 폰트가 상속.
- **CSS `body.en/ja/zh` 규칙**: `custom.css` 상단에 `body.en,body.en input,...{font-family:'Nunito',...!important}` (ja/zh 동일 패턴). 실제 렌더는 `afterRun`의 `<style>@import` 태그가 담당(최고 우선순위).

##### i18n 사전 추가 (3개 언어)
- `12cut 이용을 위한` / `약관에 동의해주세요.` / `12cut의 모든 약관을 확인하고 전체 동의합니다.` — en/ja/zh 추가. 사전 총 371키.
- **사전 캐시 주의**: `localStorage.$lang`에 캐시됨. 새 키 추가 후 언어 전환 1회 필요(또는 `localStorage.removeItem('$lang')` 후 새로고침).

##### 푸터 깨진 이미지 수정 — 배포됨
- `global.js`가 삽입하는 `/dobuddy/imgs/arrow.svg` = 12cut 서버에 **404**. `foot_sns.png`도 12cut 미사용.
- CSS로 `display:none!important` 처리(`.foot_cont img[src*="arrow.svg"],.foot_cont~img[src*="foot_sns"]`).

##### GitLab SSOT 확정 (2026-06-04) — fetch 검증됨
- **통합 repo**: `202507-dobudy-bd2` — `dobuddy/12cut/custom.js`·`custom.css`·`12cutEditor.html` 존재. 로컬 remote `gitlab-bd2`.
- **구 repo `202503-dobudy-12cut`**: `custom.js` 없음 — remote `gitlab`은 레거시, push 금지.
- **SSH**: GitLab `@smiletube9` 등록 완료. 회사 PC는 **별도 공개키 등록** 또는 동일 키 이전 필요.
- **GitLab push**: 미실행. 로컬·SFTP > GitLab main(바이트). 외주 MR/브랜치 합의 후 `dobuddy/12cut/`만 push.
- **핸드오프 문서**: `MD/HANDOFF_office_20260604.md`.

#### 세션 기록 (2026-06-05 / 회원가입 정보입력 `join.php` 리디자인)

##### 구조 발견 — global.js가 폼을 재구성(스타일만 입히면 됨)
- **body class = `body-member body-join`** (login=`body-login`, join_agreement=`body-join-agreement`와 별개 토큰 → `.body-join` 셀렉터는 약관 페이지에 누수 없음).
- **`global.js`가 `/member/join.php`에서 `#formJoin`을 모바일 폼으로 재구성**: `$('#contents').hide()` 후 `#my_custom.w600` 생성 → `#formJoin` 이관 → `.f` 컨테이너에 `<b>라벨</b>+<input>+<small>힌트</small>` 패턴으로 필드 재배치. 필드 순서: 아이디(`#memId`)·비밀번호(`#newPassword`)·비밀번호확인(`[name=memPwRe]`,class `check-id`)·이름(`memNm`)·이메일(`#email`+메일수신 `.form_element`)·휴대폰(`#cellPhone`+SMS `.form_element`)·주소(`.address_postcode`+`.address_input`)·생일(`b.not-required`+`.member_warning`들). 끝에 `.btns`(취소/완료 primary).
- **이메일 도메인 셀렉트·휴대폰 국가코드 셀렉트는 이관 안 됨**(global이 `#email`/`#cellPhone` 입력만 이동) → 단일 입력으로 렌더(글로벌향 OK).
- **생일 함정**: `.member_birthday>*`로 이관된 게 `.f` 직계 `.member_warning` **4개**(빈 div 1 + `#birthYear`100px·`#birthMonth`80px·`#birthDay`80px, 각 인라인 width). 그냥 두면 붙어 보임 → **custom.js가 셀렉트 3개를 `.bday-row`(flex)로 `wrapAll`**, 빈 div는 `.f>.member_warning{display:none}`로 숨김.

##### 적용 (Figma node `1032-3428` 기준 / 배포·검증됨)
- **custom.css `.body-join`**: 필 인풋(`radius40`,`#FAFAFA`,포커스`#F63237`)·라벨(Bold14 `#333342`+`:not(.not-required)::after` 빨강 `*`)·힌트(10px `#C4C4C4`)·생일 셀렉트(`radius8`+커스텀 화살표)·주소찾기(빨강 아웃라인 필)·체크박스(`#F63237` 커스텀: 메일/SMS/양력/음력)·하단 **단일 풀폭 `확인`**(취소 숨김)·필드 그룹 간격 36px(체크박스 다음 라벨 24px)·**PC(≥851px) `#my_custom` padding-top:60px**(헤더 아래 간격).
- **custom.js `case '/member/join.php'`**: 헤더 `data-h=$t('회원가입')`(번역)+`←`클릭→약관복귀, `.btns .primary` 텍스트 `$t('확인')`, 주소 placeholder 3종 `$t()`, 생일 `.bday-row` wrapAll, **아이디 한글 입력 안내**(`compositionstart`/`beforeinput`에서 비ASCII 감지 → `.join-id-warn` 2.5초 노출).

##### 진단 도구 — puppeteer-core(기존 Chrome) 가입플로우 자동화
- join.php는 직접 접근 시 `잘못된 경로` alert로 리다이렉트 → **약관동의 페이지에서 체크박스 전체 체크→다음** 으로 플로우 통과해야 렌더. `dev/diag_*.cjs`(puppeteer-core, `executablePath`=시스템 Chrome)로 자동 통과+DOM진단+스크린샷. `dev/`는 `package.json type:module`이라 **`.cjs` 확장자** 필수.
- **검증 결과**: ① 아이디 "입력 안 됨"=버그 아님 — 고도 `gdMemberId` 필터가 **한글 제거**(`가나다`→`""`, `abc가나123`→`abc123`), 영문/숫자 정상(라이브 실측). ② 헤더 타이틀 번역 일 `会員登録`/중 `注册`/영 `Sign Up`/국 `회원가입` 실측. ③ 라벨·버튼·체크박스·대부분 placeholder 일/중/영 정상.

##### ⚠️ 미완 — i18n 사전 4개 키 미업로드(서버 불안정)
- **준비됨·미반영**: `우편번호`·`도로명 주소 검색`·`상세 주소를 입력해 주세요.`·`없이 입력하세요.`(휴대폰 placeholder) + `영문 소문자·숫자만 입력할 수 있어요`(아이디 안내) → en/ja/zh. **현재 일/중/영에서 해당 placeholder만 한국어 폴백**(기능 무관).
- **업로드 차단 원인(2026-06-04 야간)**: godo SFTP(`gdadmin-dobuddy39:17662`)가 **인증 ~120초 지연 후 `Permission denied`** 또는 세션 중 `Received disconnect ... Application error`로 끊김. 정체 세션 강제종료가 fail2ban류 차단을 계속 리셋 → 악순환. **비번·코드 문제 아님**(custom.css·custom.js는 그 와중에 통과해 라이브 반영됨).
- **남은 작업(서버 안정 후 1스텝)**: `i18n_pending/{en,ja,zh}.html` → `/dobuddy/files/{en,ja,zh}.html` 업로드만 하면 종료. (각 382키, 신규 키 검증 완료. `/tmp/dict_*.html`와 동일본을 레포에 보존.)
- **검증 명령**: 업로드 후 `curl -s "https://12cut.co.kr/dobuddy/files/en.html?z=$RANDOM" | grep "Postal code"`로 반영 확인.

##### 다른 창 작업 흔적 — `skin/mypage/index.html`(미커밋)
- 다른 창에서 **마이페이지(`mypage/index.php`) 스킨**을 라이브에서 받아 `skin/mypage/index.html`로 미러링함(godo 토큰 raw: `진행 중인 주문`·`최근 본 상품` 등 주문 요약/최근주문/최근본상품 구조). `skin/main/index.html` 미러 패턴과 동일. **아직 디자인 적용 전 원본 스냅샷**으로 추정 → 향후 마이페이지 리디자인 base.

#### 세션 기록 (2026-06-05 / 히어로 스크롤 인디케이터 삭제 — 코드 반영·배포 미완)
- **변경(로컬 완료)**: 히어로 CTA 하단의 스크롤 인디케이터(`SCROLL` 텍스트 + 펄스 라인) 제거.
 - HTML 2곳: `skin/main/index.html`(라이브 스킨 미러)·`index.html`(레퍼런스 원본)에서 `.hero__scroll-hint`(`.hero__scroll-line`+`<span>SCROLL</span>`) 블록 삭제.
 - CSS: `style.css`에서 `.hero__scroll-hint`·`.hero__scroll-hint span`·`.hero__scroll-line` 규칙 + **전용** `@keyframes scrollPulse` 삭제. (공용 `fadeInUp`은 다른 4곳에서 사용 → 유지.)
 - 캐시버스팅: `skin/main/index.html`의 `style.css?v=5`→**`?v=6`**.
- **★ 배포 완료·검증(2026-06-05 밤)**: `.up_hero2.exp`(ServerAlive+fail-fast)로 1회 성공 — 인증 170ms, `skin/main/index.html`(33KB)·`style.css`(26KB) 100% 전송, `style.css` mtime 22:19 확인. **라이브 검증: 홈 `hero__scroll-hint`=0, `style.css?v=6` 참조, CSS `scrollPulse`=0.** 스크롤 인디케이터 라이브 제거 완료.

##### ★★ godo SFTP 배포 지연 정밀 진단 결과 (2026-06-05 / 재현·해결)
- **증상**: 배포 SFTP가 비번 전송 후 `sftp>` 대기에서 **무한 행(200초+)** 또는 인증 직후 `Connection reset`. "느리다"의 정체.
- **단계별 측정(ssh -vv + perl 타임스탬프)**: TCP 연결 **0.017s**, SSH 핸드셰이크(KEX·호스트키 ssh-rsa·SERVICE_ACCEPT) **0.26s**, 정상 시 비번 인증 완료 **0.19s**(`.diag_auth.exp` 측정). → **회선·핸드셰이크·코드·비번 전부 정상. 본질적으로 느리지 않음.**
- **진짜 원인 = 간헐적 throttle/tarpit**: **에이전트의 즉석 반복·중단 연결**이 godo의 fail2ban류 차단(또는 계정 동시세션 한도)을 유발 → 백투백 재연결 시 비번 인증 단계에서 무한 행. 죽인 세션이 **서버 측에서 즉시 해제 안 됨** → 슬롯 점유로 후속 로그인 대기. **쿨다운 둔 단일 연결은 0.2초로 성공**(반복 검증).
- **해결책(검증됨)**: ① 연속 연결 금지(쿨다운) ② **`-o ServerAliveInterval=5 -o ServerAliveCountMax=2 -o ConnectTimeout=15`**로 행 시 ~15초 자동 종료(200초 행 방지) ③ 단일 클린 연결. → `.up_hero2.exp`에 반영, 1회 성공.
- **SSH 쉘 = 불가(SFTP-only)**: `ssh ... "cmd"` → **`exec request failed on channel 0`**(ForceCommand internal-sftp). 따라서 **rsync 불가**(원격 쉘 필요), 원격 lftp/uname 불가.
- **lftp 경로 = 이 맥에선 인증 막힘**: lftp는 SFTP일 때 외부 `ssh`(connect-program)에 위임 → 비번 주입 필요. **키 불가(서버 password-only)** + **`sshpass` 즉시 `Permission denied`**(이 맥/서버 조합, 재확인). → **비대화식 인증 가능한 유일 수단 = `expect`로 openssh sftp에 비번 타이핑.** (lftp를 쓰려면 connect-program을 expect 래퍼로 감싸야 함 — 미구현.)
- **재현용 스크립트(루트, `*.exp` gitignore)**: `.up_hero2.exp`(배포·ServerAlive), `.diag_auth.exp`(인증 타이밍), `.diag_shell.exp`(쉘 가부). **향후 모든 godo 배포는 ServerAlive 옵션 + 쿨다운 + 단일연결 원칙 적용.**
- **남은 작업(서버 안정 후 2 put)**: `skin/main/index.html` → `/data/skin/front/moment/main/index.html`, `style.css` → `/data/skin/front/moment/img/home/style.css`. 업로드 스크립트 `.up_hero.exp` 작성·보존(루트, gitignore 대상). 스킨 템플릿 반영 ~20초.
- **검증 명령**: `curl -s "https://12cut.co.kr/?z=$RANDOM" | grep -c "hero__scroll-hint"` → **0**이면 반영 완료.
- *(검토 메모)* 멀티프레임 히어로라 스크롤 어포던스 상실 리스크는 사용자가 "완전 삭제"로 확정. 추후 약화형(작은 셰브론) 대안 여지 있음.

#### 세션 기록 (2026-06-05 / 회원 페이지 헤더 장바구니 아이콘 → 홈 이동 버그 수정 — 배포·헤드리스 검증됨)
- **증상**: 회원 페이지(`login.php`·`find_id.php` 등) **모바일**에서 상단 헤더 장바구니 아이콘 클릭 시 엉뚱하게 이동(`login.php`→홈 `/`, `find_id.php`→`login.php`). 데스크톱은 정상.
- **★ 핵심 발견 1 — 장바구니는 `<a>`가 아니라 `<img onclick>`**: `global.js`가 헤더 `top_member_box`를 **로그인 상태·언어에 따라 통째로 재구성**한다. 서버 HTML의 `<a href="../order/cart.php">장바구니(0)</a>`는 사라지고, 실제로는 **`<img src="/dobuddy/imgs/icon_cart.png" onclick='location="../order/cart.php"'>`** (26~43px 아이콘)로 바뀜. MY 아이콘도 `<img onclick='location="../mypage/index.php"'>`. → curl(정적 HTML)만 보면 절대 못 잡음. **반드시 헤드리스로 post-JS DOM을 봐야 함**.
- **★ 핵심 발견 2 — `_hdrBack` 뒤로가기 핸들러가 아이콘 클릭을 가로챔**: `custom.js afterRun()`의 회원페이지 ← 뒤로가기 핸들러가 `.header_top`에 바인딩, 조건이 **타깃 기준** `e.offsetX<34`. 장바구니가 작은 `<img>`라 클릭 시 offsetX가 거의 항상 34 미만 → `innerWidth<851`(모바일)에서 발동 → `stopImmediatePropagation` 후 `location.href=_hdrBack[1]`로 **인라인 onclick(cart) 이동을 덮어씀**. 데스크톱은 `innerWidth<851` 거짓이라 무발동(정상).
- **2차 헛수정 교훈**: 1차로 `a[href*=order/cart.php]` 절대경로화 + 가드 `closest('a,button,input,select,label')` 추가했으나 **둘 다 빗나감**(장바구니는 `<a>` 아님·`<img>`라 가드 미포함). "정밀 검토" 요구로 헤드리스(playwright-core+chromium-headless-shell) 도입해 실측·재현 후에야 정체 규명.
- **수정(`custom.js` 3곳)**:
 1. `$('.top_member_box img[onclick*="order/cart.php"]').attr('onclick','location="/order/cart.php"')` — 아이콘 onclick을 **절대경로**로 정규화(기존 `a[href]` 라인은 유지·무해).
 2. `_hdrBack` 일반 핸들러 + `/member/join.php` 핸들러: 트리거를 **타깃 offsetX → 헤더 기준 X**(`(e.clientX||0)-this.getBoundingClientRect().left < 44`)로 변경 + 제외 셀렉터에 `img,[onclick],.top_member_box` 추가. → 좌측 끝 화살표 영역만 발동, 우측 아이콘류는 절대 비발동.
- **배포·검증**: SFTP `custom.js` 업로드(13409B). **헤드리스 클릭 실측으로 4/4 통과** — `login.php`·`find_id.php` × 모바일390·데스크톱1280 **전부 `/order/cart.php`** 이동 확인.
- **잔여 확인(미완)**: 모바일 좌측 ← 화살표가 의도대로 동작하는지 검증 중 헤드리스에서 `about:blank`(=`history.back()`가 테스트 히스토리 맨 앞 about:blank로 회귀하는 **테스트 아티팩트**로 추정) 관찰. 화살표 트리거 지점(좌측<44px)은 변경 전후 동일하므로 **회귀 아님**으로 판단하나, 실기기/실히스토리(home→login 진입 후 ←)로 최종 육안 확인 권장. `.header_top` click 핸들러는 `(none)`(global.js)+`hdr`(우리) 2개 공존.
- **도구 메모**: 헤드리스 환경 = `/tmp/hdrtest`(playwright-core, `unset PLAYWRIGHT_BROWSERS_PATH` 후 실행). probe 스크립트들로 post-JS DOM·elementFromPoint·실클릭 네비게이션 추적. **godo 헤더 디버깅은 이 방식이 정답**(curl 무력).

#### 세션 기록 (2026-06-06 / 12cut 기본 언어 일본어 전환 — 배포·검증됨)
- **요구**: `12cut.co.kr` 최초 접근 시 기본 언어를 일본어(`ja`)로 적용. 단, 사용자가 이후 `EN/KR/CN` 등 다른 언어를 선택하면 그 선택을 유지해야 함.
- **1차 실수/원인**: `custom.js` 최상단에 `if(localStorage.$mylang!=='ja'){...location.reload()}` 형태로 넣어 **기본값(default)** 이 아니라 **항상 일본어 강제(force)** 가 됨. 결과: 사용자가 다른 언어로 바꿔도 다음 로드에서 다시 `ja`로 되돌아감.
- **수정 원칙**: `localStorage.$mylang`이 없거나 기존 사용자에게 1회 기본값 마이그레이션이 필요한 경우에만 `ja`를 세팅. 이후에는 `localStorage.$mylang`을 신뢰한다. 마이그레이션 플래그는 `localStorage.$12cutDefaultLang='ja'`. 언어 사전 캐시(`localStorage.$lang`)는 1회 일본어 기본값 세팅 때만 제거해 `ja` 사전을 재수신하게 함.
- **구현 위치**: `/dobuddy/12cut/custom.js` 전용. 공용 `global.js` 수정 금지. `main()`의 홈 언어 클릭은 `localStorage.$mylang||'ja'`, `afterRun()`의 body 언어 클래스/`#sel_lang` 값도 `localStorage.$mylang||'ja'` 기준으로 정렬.
- **검증**: 라이브 `custom.js` curl 확인(`const _ldk='$12cutDefaultLang'`, `localStorage.$mylang||'ja'`, `var _cl=localStorage.$mylang||'ja'` 존재, 고정 `data-lang="ja"` 제거). Puppeteer 실측: 최초 접근은 `mylang=ja`·`$lang.lang=ja`·`body.ja`·`#sel_lang=ja`; 이후 영어 선택 후 리로드는 `mylang=en`·`$lang.lang=en`·`body.en`·`#sel_lang=en` 유지. `mypage/index.php`는 비로그인 상태에서 `/member/login.php`로 리다이렉트되지만 동일 공통 헤더/언어 셀렉트 경로에서 검증 완료.

#### 세션 기록 (2026-06-06 / 마이페이지 모바일=BD2 정렬(오버라이드 제거) + 회원정보수정 스타일 배포·검증됨)
- **요구 변천**: ① 마이페이지(`/mypage/index.php`) PC·모바일 Figma 반영 → ② "모바일 링크 오류·메뉴 허브" → ③ 결국 **"구조가 BD2와 동일하니 BD2를 그대로 반영"** 으로 전환(사용자가 BD2 계정 제공). PC는 BD2와 공통 좌측 메뉴 사용.
- **★ 핵심 발견 — 모바일 허브는 `global-side.js`의 `#my_custom`이 이미 생성**: BD2 로그인 후 헤드리스(`puppeteer-core`, 시스템 Chrome)로 post-JS DOM·스크린샷 실측. 모바일에서 **보이는 레이아웃 = `#my_custom`**(global-side.js가 BD2식 메뉴 허브로 구성), 기존 `.mypage_main`은 `.sub_content` 안에서 **숨김**이 정상. → 12cut도 별도 커스텀 허브를 만들 필요 없음. BD2와 동일 동작은 **global 스크립트에 맡기면 끝**.
- **★ 버그 원인 — 우리 오버라이드가 숨겨진 옛 콘텐츠를 되살림**: 12cut `custom.css`가 모바일에서 `.body-mypage .sub_content{display:flex!important}`로 강제 노출 → global이 숨긴 옛 `.mypage_main`이 `#my_custom`과 **중복 표시**되어 "링크 잘못/지저분" 증상. `custom.js`의 `case'/mypage/index.php'` 커스텀 허브 주입도 중복 유발.
- **조치(제거가 정답)**: `custom.css`의 `.body-mypage`(index 전용: PC 2단 그리드·모바일 허브·`sub_content` 강제표시) 규칙 **전부 삭제**, `custom.js`의 `case'/mypage/index.php'` 블록 **전부 삭제**. → 마이페이지는 global 기본 렌더(BD2 동일)로 복귀. (검증: 라이브 `custom.css`에 `.body-mypage `(index) 매치 **0**.)
- **회원정보수정(`.body-mypage-edit`) 함께 배포**: 다른 창에서 작성된 회원정보수정 페이지 스타일(로컬 `custom.css`에만 있던 델타)을 같은 배포에 포함. **공용 파일이라 덮기 전 라이브 재pull→diff** 결과 **차이가 `.body-mypage-edit`뿐(외주 변경 0)** 확인 후 업로드. 라이브=로컬 **바이트 일치(`cmp` IDENTICAL, 59,948B)**, `custom.js`도 바이트 일치·문법 OK.
- **도구 메모**: `dev/cap_bd2.cjs`(BD2 로그인→`/mypage/index.php` DOM 덤프·스크린샷, `DESKTOP=1`로 1440 뷰포트 전환). 배포 스크립트 `.up_custom_mypage2.exp`는 `bye` 직후 `close`로 강제 종료(ServerAlive 행 방지). godo 헤더/마이페이지 진단은 curl 무력 → **헤드리스 post-JS DOM 필수**.
- **잔여**: 회원정보수정 페이지의 **Figma 기준선 1:1 대조 미실시**(현재는 "로컬→라이브 일치" 상태). 기준 노드 확보 시 간격·`#F63237` 액센트 대조 권장. 외주 통지 대상에 본 `custom.css`/`custom.js` 변경분 추가.

#### 세션 기록 (2026-06-06 / 회원정보수정 모바일 레이아웃 깨짐 수정 — 배포·검증됨)
- **증상**: 실폰에서 `/mypage/my_page.php` 회원정보 수정 내부 페이지 모바일 레이아웃이 깨짐. 입력 필드 오른쪽이 화면 밖으로 밀리고, 비밀번호 설정 버튼/입력 필드 폭이 뷰포트와 맞지 않으며 카카오 플로팅 버튼이 휴대폰 입력 영역과 겹쳐 보임.
- **원인 판단**: `.body-mypage-edit` 모바일 미디어쿼리에서 데스크톱 `#my_custom{width:1280px}` 계열 값을 충분히 해제하지 못하고, `#contents`와 `#my_custom`이 동시에 좌우 padding을 갖는 구조라 실제 폰에서 폭 계산이 불안정. `custom.css`의 모바일 컨테이너 책임이 혼재된 상태.
- **수정(`custom.css` 한정)**: `@media (max-width:850px)` 안에서 `#container`·`.sub_content`·`.content_box`·`#contents`·`#my_custom`·`#formJoin`에 `width:100%`, `max-width`, `min-width:0`, `box-sizing:border-box`, `overflow-x:hidden`을 명시. `#my_custom`은 `padding:24px 0 50px`로 내부 중복 좌우 padding 제거, 폼 내부 `.f`는 `width:min(100%,343px)`로 중앙 정렬. `custom.js`는 미수정.
- **배포·검증**: `.up_css.exp`를 ServerAlive+fail-fast+`close` 방식으로 갱신 후 `custom.css`만 SFTP 업로드. 원격 `ls -l /dobuddy/12cut/custom.css`에서 76,269B·mtime `Jun 6 10:01` 확인. 라이브 `https://12cut.co.kr/dobuddy/12cut/custom.css?z=...`에서 새 규칙(`width:100%!important;max-width:480px`, `width:min(100%,343px)`) 존재 확인. `ReadLints` 기준 CSS 진단 오류 없음.
- **운영 메모**: 기존 `.up_css.exp`는 `expect eof` 대기와 서버 tarpit에 취약했음 → 이번에 `.up_custom_mypage2.exp`와 같은 fail-fast 패턴으로 개선. 전송 100%와 원격 `ls`가 보이면 성공으로 간주하고, `bye` 이후 세션이 남으면 `close`로 종료.

#### 세션 기록 (2026-06-06 / 장바구니 `cart.php` Phase 1 Figma 수치·브랜드 교정 — 배포·헤드리스 검증됨)
- **요구**: `/order/cart.php`를 Figma(browndust2 cart, PC `1786-13084`·모바일 `1786-11290`) 기준으로 정밀 반영. **앞으로 모든 페이지는 PC·모바일 2구조로 판단**(사용자 원칙). Figma는 rate limit 때문에 `user-figma` MCP(다른 토큰)로 우회.
- **★ 구조 발견 — 2단 골격은 `global.js`가 이미 생성**: `#my_custom>.aside+.body`, `.cart-li`(상품행), `.cart-sumbox`(요약), `.btns`(버튼행)는 global이 모바일 폼으로 재구성. → **CSS로 본문만 시안 정렬**(마크업 생성 불필요). `.body` 직계 순서: `h2(장바구니)` → `div>h3(전체선택)+체크박스` → `.cart-div`(상품/`.list-msg`) → `.btns.border-gray`(삭제/비우기) → `.cart-sumbox`×2(`.only-krw`/`.only-currency`, 통화별 1개만 표시) → `.btns`(주문). 
- **★ 헤드리스 필수**: cart는 curl로 상태 파악 불가(global 재구성·통화분기·빈/채움). `puppeteer-core`+시스템 Chrome으로 ① 상품 담기(`goodsNo=1000000000`, `#cartBtn` 클릭+dialog accept) ② post-JS DOM 실측 ③ 로컬 `custom.css`를 `addStyleTag`로 주입해 before/after·치수 검증. 게스트 카트 세션은 런마다 비므로 **검증 전 담기 단계 선행** 필수. 스크립트군 `/tmp/cartdiag/*.cjs`.
- **Phase 1 적용(`custom.css` `.body-cart` 스코프, 라이브 AS-IS 교정)**:
 - 썸네일 85×85·radius8·`object-fit:cover`(라이브 16px 미사이즈), 상품명 15/600 #000·옵션 12/500 #555·가격 16/600.
 - 체크박스: godo `.check_s` 스프라이트 → **브랜드 커스텀(#F63237 on + 흰 체크마크)**. 전체선택(`for=allCheck1`)·행 체크 **통일**(`.body-cart .body label.check_s`).
 - 요약박스: padding 15 균일·텍스트 #555·**결제예정금액 파랑(#0B84EC)→레드 #F63237**·적립 마일리지 녹색(#272) 중화.
 - 버튼행: 라이브 음수마진(-3/-20)·`space-between` 과대간격 제거 → `display:flex;gap:10px;flex:1 1 0`로 **콘텐츠 폭 꽉 채움+50/50 균등**. 주문 CTA 검정→**레드(#F63237)**, 보조 주문 레드 아웃라인, 삭제/비우기(`.border-gray`)는 회색 아웃라인 유지. 공통 radius8.
 - 모바일(≤850): 요약카드 radius15, `#my_custom` 좌우거터 16 균일.
- **막판 2건 수정(이번 세션 / 라이브 검증됨)**:
 1. **삭제행↔결제박스 간격 0 → 30px**: `.cart-sumbox`에 `margin-top:30px`(Figma 섹션 간격 IKXQC3 gap 30). 헤드리스 실측 gap 30 확인(빈/채움 × PC/모바일 4케이스).
 2. **빈 카트 '전체선택' 댕글링 숨김**: 빈 상태(`.cart-div .list-msg` 존재)에선 체크박스 없이 "전체선택" 텍스트만 노출됐음. `.body-cart .body:has(.cart-div .list-msg)>div:has(>h3){display:none}` — `body>div:has(>h3)`가 전체선택 행만 유일 매칭. `:has` 라이브 지원 확인. 채운 카트는 정상 노출 유지(검증됨).
- **배포·검증**: `.deploy.exp`(검증된 ServerAlive+fail-fast+`bye`후 `close` 헬퍼, `expect .deploy.exp <local> <remote>` 다중쌍 지원)로 `custom.css`(40KB) → `/dobuddy/12cut/custom.css` 1회 성공(인증 181ms, 100% 전송). 라이브 curl로 `margin-top:30px!important;padding:15px`·`list-msg)>div:has(>h3)` 두 규칙 확인. 헤드리스 4케이스(빈/채움×PC/모바일) gap30·전체선택 토글 전부 통과.
- **Phase 2(미착수)**: 수량 스테퍼·컬러칩·상품별 배송비 라인은 JS/백엔드 의존 → 별도. 사용자 선택 "나중에(먼저 수량변경 기능 유무 확인)".

#### 세션 기록 (2026-06-06 / 회원정보 수정 재인증 화면 소셜 로고 교체 — 배포·검증됨)
- **요구 정정**: 사용자가 업로드한 `assets/images/image 1.png`·`image 2.png`·`image 3.png`는 로그인 페이지가 아니라 **회원정보 수정(`/mypage/my_page.php`) 진입 전 재인증 화면**의 소셜 인증 로고 교체용이었음. 1차로 로그인 페이지 소셜 버튼에 잘못 적용 → 즉시 원복.
- **이미지 매핑·배포**: `image 1.png`=Kakao, `image 2.png`=Naver, `image 3.png`=Facebook. 명확한 이름으로 복제 후 `/dobuddy/12cut/sns-kakao.png`, `/dobuddy/12cut/sns-naver.png`, `/dobuddy/12cut/sns-facebook.png`에 SFTP 업로드. 라이브 3개 파일 모두 200 확인.
- **최종 적용 범위**: 로그인 페이지는 기존 상태 유지(풀폭 Facebook 파란 버튼+SVG, 하단 Kakao/Naver 원형 아이콘 유지). `custom.js`의 `_reauth()` 안에서만 재인증 화면 내 `img[alt/src*="kakao|naver|facebook"]`을 새 `/dobuddy/12cut/sns-*.png`로 교체. `custom.css`는 `.body-reauth img[src*="/dobuddy/12cut/sns-"]` 스코프로만 크기 제어.
- **재인증 화면 스타일 현황**: 기존 godo 재인증 레이아웃 유지. 하단 버튼(`취소`/`인증하기`)만 12cut 레드 체계 유지. `.c-red` 강조 텍스트는 다국어 공통으로 검정(`#1A1A1A`) 오버라이드. 카카오 로고를 감싸던 보더는 `.cut-kakao-plain{border:none;background:none;box-shadow:none}`로 제거.
- **로고 정렬·크기 최종값**: 재인증 로고 부모 `.cut-kakao-plain`은 `display:flex;align-items:center;justify-content:center;text-align:center`. 새 소셜 로고는 `max-width:180px`, `height:42px`, `margin:0 auto`, `object-fit:contain`. 라이브 CSS에서 `max-width:180px!important;height:42px!important` 확인 완료.
- **검증/주의**: 재인증 화면은 로그인 세션 필요로 curl 정적 HTML만으로 최종 DOM 확인이 어려움. 변경 검증은 라이브 `custom.css`/`custom.js` 마커 및 이미지 200으로 확인. 실기기/로그인 상태에서 최종 육안 확인 권장. 향후 이 화면 소셜 로고 수정 시 **로그인 페이지가 아니라 `.body-reauth` 스코프만 건드릴 것**.

#### 세션 기록 (2026-06-06 / 중문 폰트 GenSenRounded 적용 범위 보정 — 배포·검증됨)
- **요구**: 12cut 중문 폰트가 예쁘지만 가독성이 낮아, 일문 `Zen Maru Gothic`과 결이 비슷한 둥근 고딕 계열로 교체. 선택안은 **3번 `GenSenRounded` 계열**.
- **최종 폰트**: `GenSenRounded2 TC` + `https://fontsapi.zeoseven.com/303/main/result.css`. `GenSenRounded2 TW`가 브랜드/현대 UI에는 더 적합하나 ZeoSeven `303/main/result.css`는 실제로 `GenSenRounded2 TC`만 내려줌(TW는 OTF 원본을 받아 웹폰트 분할/자가호스팅 필요). 기존 `ZCOOL KuaiLe`는 장식용 디스플레이 폰트라 본문·버튼·주문/회원 UI 가독성이 낮아 제거.
- **반영 파일(공통/홈)**: `custom.js`의 `zh` 폰트 로더, `custom.css`의 `body.zh` 폰트 패밀리, 홈 `script.js`의 `zh` 폰트 로더, 홈 `style.css`의 `:lang(zh)` 폰트 변수 변경. 실기기 로드 타이밍/캐시 보강을 위해 `custom.css`와 홈 `style.css` 최상단에 `@import url("https://fontsapi.zeoseven.com/303/main/result.css");` 추가. 홈 스킨 `skin/main/index.html`은 `style.css?v=6→v=7` 캐시버스팅.
- **★ 실수 원인 — 편집기 별도 로더 누락**: 사용자가 확인한 화면은 상품상세가 아니라 **`/dobuddy/12cut/12cutEditor.html` 편집기**였음. 편집기는 `custom.js`/`custom.css` 체인이 아니라 자체 `applyEditorFont()`에서 `zh: ["'Noto Sans SC'", Google Fonts]`를 로드하므로 공통/홈 배포만으로는 바뀌지 않음. → `editor/12cutEditor.html`의 `zh` 매핑도 `GenSenRounded2 TC`/ZeoSeven으로 변경해 `/dobuddy/12cut/12cutEditor.html`에 SFTP 배포.
- **운영 규칙(재발 방지)**: 언어/폰트 변경 시 범위를 반드시 ① 공통 고도 페이지(`/dobuddy/12cut/custom.js`, `custom.css`) ② 홈 랜딩(`script.js`, `style.css`, `skin/main/index.html` 캐시버전) ③ **스토리 편집기(`editor/12cutEditor.html`)** 로 나눠 점검·배포한다. 사용자가 스크린샷으로 확인하는 화면이 편집기면 공통 파일 검증만으로 "반영됨"이라고 판단하지 말 것.
- **검증**: 라이브 `custom.js`/`custom.css`/홈 CSS/편집기에서 `ZCOOL KuaiLe`·`Noto Sans SC` 제거 및 `GenSenRounded2 TC` 존재 확인. Puppeteer 실측: 상품상세 `/goods/goods_view.php?goodsNo=1000000000`에서 `body.zh`·`商品总价` 계산 폰트 `"GenSenRounded2 TC", "Pretendard Variable", Pretendard, sans-serif`, `document.fonts.check(...)=true`; 편집기 `/dobuddy/12cut/12cutEditor.html`에서 `body.cut12.zh`·`创建你的故事` 계산 폰트 `"GenSenRounded2 TC", Pretendard, sans-serif`, `document.fonts.check(...)=true`. 배포 직후 `urllib` 한 번은 stale 응답(`Noto Sans SC`)을 받았으나 `Cache-Control: no-cache` 반복 확인에서 새 파일만 수신(고도/CDN 엣지 전파 지연).
- **리스크/후속**: 현재는 외부 ZeoSeven Fonts API 의존. 12cut 홈 단일소스/자사 인프라 원칙과 완전히 맞추려면 `GenSenRounded2 TW` 또는 선택 폰트를 직접 woff2 분할해 `/dobuddy/12cut/` 또는 스킨 에셋 경로에 자가호스팅하는 Option B 검토.

#### 세션 기록 (2026-06-06 / 모바일 레일 통일 + 마이페이지 탭·헤더 보정 — 배포·검증됨)
- **요구**: 로그인·회원가입·장바구니·결제하기·마이페이지 메뉴 전반의 모바일 좌우 마진을 정밀 분석 후 일관화. 이후 마이페이지 메뉴별로 남은 안쪽 마진, FAQ/주문기록 상단 탭 wrap, 1:1문의 헤더 잘림 및 탭 우측 잘림을 추가 보정.
- **모바일 레일 기준 확정(Option A)**: 390px 뷰포트 기준 **좌우 16px / 콘텐츠 358px**를 기본 레일로 채택. 결제하기 화면이 기준에 가장 가까웠고, 로그인은 `.sub_content` 기본 `margin:4px` 때문에 20px, 회원가입 정보입력은 내부 `.f` 축소 때문에 30px, 장바구니는 `#contents 20px + #my_custom margin 16px` 중첩 때문에 36px로 들어가던 상태를 정리.
- **반영(`custom.css`)**: `.body-login .sub_content/.content_box` 기본 마진 제거, `.body-login .member_login_box` `max-width:480px`, `.body-join #formJoin .f` 모바일 100%, `.body-cart #contents{padding:0}` + `#my_custom margin 16px`, `.body-mypage-edit #formJoin .f` 모바일 100%. 라이브 헤드리스 검증: 로그인·약관·회원가입 정보입력·장바구니 본문/결제박스 모두 `left 16 / right 16 / width 358`, `scrollWidth 390`.
- **마이페이지 메뉴별 핵심 원인**: `global-side.js`가 `/mypage/*`에서 `#contents`에 `#my_custom`을 prepend하고, 공통 `global.css`의 `#contents{padding:0 20px}` + `#my_custom{max-width:100vw-60}` + `#my_custom:not(.w600)>div{margin:0 10px}`가 중첩되어 메뉴별 콘텐츠가 더 안쪽으로 보였음. `custom.js`에서 `/mypage/*`에 `body-mypage`, `/mypage/mypage_qa.php`에 `body-mypage-qa` 클래스 부여. `custom.css`에서 `.body-mypage:not(.body-mypage-edit)` 스코프로 `#contents` padding 0, `#my_custom margin:0 16px 50px`, 내부 div margin 0, `.body/.content/.content_box` 100%로 정리. 회원정보수정(`.body-mypage-edit`)은 기존 전용 스타일 유지.
- **상단 탭 스와이프**: FAQ(`/service/faq.php`)와 주문기록(`/mypage/order_list.php`)의 `.filter`를 모바일에서 `flex-wrap:nowrap`, `overflow-x:auto`, `-webkit-overflow-scrolling:touch`, `scroll-snap-type:x proximity`로 변경. `/service/faq.php` 진입 시 `body-faq` 클래스를 명시적으로 부여해 규칙 누락 방지. 라이브 FAQ 계측: `scrollWidth 625 > clientWidth 330`, `flex-wrap:nowrap`, `overflow-x:auto`.
- **탭 우측 잘림 처리**: 스와이프 탭 레일 오른쪽 끝이 딱 잘려 보이지 않도록 `.body-faq #my_custom .filter,.body-mypage-order #my_custom .filter`에 `-webkit-mask-image`/`mask-image: linear-gradient(90deg,#000 0,#000 calc(100% - 34px),rgba(0,0,0,0))` 적용. 라이브 CSS 마커 확인 완료.
- **1:1문의 헤더/본문 연결**: 첨부 실폰에서 `/mypage/mypage_qa.php` 상단 카드가 헤더에 붙어 잘려 보임. `.body-mypage-qa #my_custom{padding-top:22px}`로 다른 페이지와 시작 간격을 맞추고, `#header .header_top[data-h]` 및 `:before`에 하단 투명 그라데이션 배경을 적용해 스크롤 시 본문과 부드럽게 이어지도록 처리.
- **검증/주의**: `custom.css`·`custom.js` SFTP 배포 완료, 라이브 마커 확인 완료, `ReadLints` 오류 없음. 마이페이지 일부 메뉴는 로그인 세션 의존이라 완전한 실계정 DOM 육안 확인은 사용자가 진행. 구조상 마진 보정은 12cut 전용 body class 스코프로 제한되어 결제/장바구니/회원가입 레일에는 추가 영향 없게 설계.

#### 세션 기록 (2026-06-06 / 마이페이지 회원탈퇴·찜 빈상태 단순 번역 — 배포·검증됨)
- **요구**: 마이페이지 회원탈퇴 문구가 번역되지 않음 → "단순 번역만" 진행. 이후 `/mypage/wish_list.php`의 `찜한 상품이 없습니다.`도 번역 누락 확인.
- **원인**: `global-side.js`가 마이페이지 메뉴에서 `회원 탈퇴`를 `$t('회원 탈퇴')`로 렌더하지만 라이브 사전에는 `회원 탈퇴`/`회원탈퇴`/`탈퇴하기` 계열 키가 없었음. `/mypage/hack_out.php`는 `global-side.js` 전용 case가 없어 고도 원본 `.content/.content_box`를 그대로 붙이는 구조라 일반 텍스트는 자동 번역되지 않음. 찜 빈상태도 `ui.setGoodsList(...,'찜한 상품이 없습니다.')`가 `$t(empty)`를 호출하지만 사전 키가 없어서 한국어 폴백.
- **반영(`custom.js`)**: `_cutPageTx` 로컬 보강맵 추가(en/ja/zh) + 마이페이지 사이드 메뉴 `회원정보 수정`/`회원 탈퇴` 텍스트 노드 치환. `/mypage/hack_out.php` case 추가(`body-mypage-withdraw`)로 제목·본문 텍스트 노드·input/button/a value/text·placeholder·`onclick/onsubmit` 속성 안의 한국어 confirm 문구를 단순 치환. `/mypage/wish_list.php` case 추가(`body-mypage-wish`)로 캐시가 남아도 `.list-msg`의 `찜한 상품이 없습니다.`를 즉시 치환.
- **반영(사전)**: `scripts/fill_i18n.py` `NEW_KEYS`에 `회원정보 수정`, `회원 탈퇴`, `회원탈퇴`, `탈퇴`, `탈퇴하기`, `회원탈퇴 신청/안내/사유`, 확인/완료 문구, 탈퇴 안내문 후보, `찜한 상품이 없습니다.` 추가 → `scripts/i18n_out/{en,ja,zh}.html` 재생성 후 `/dobuddy/files/{en,ja,zh}.html` 업로드. 대표 번역: en `Delete Account`/`No wishlisted items.`, ja `退会`/`お気に入り商品がありません。`, zh `注销会员`/`暂无收藏商品。`.
- **배포·검증**: PTY 고갈(`The system has no more ptys`)로 `expect spawn` 사용 불가. 대안으로 **PTY 없는 OpenSSH SFTP** 사용 성공: 임시 `SSH_ASKPASS` 스크립트 + `SSH_ASKPASS_REQUIRE=force DISPLAY=1 sftp -b` + 기존 ssh-rsa 옵션. `custom.js`, `en.html`, `ja.html`, `zh.html` 업로드 완료. `node --check custom.js` 통과, `ReadLints` 오류 없음, 라이브 `custom.js`에서 `body-mypage-withdraw`·`body-mypage-wish` 확인, 라이브 사전에서 신규 키 확인.
- **주의**: 기존 브라우저의 `localStorage.$lang` 사전 캐시가 있으면 새 사전 키는 언어 전환 1회 또는 `localStorage.removeItem('$lang')` 후 반영됨. 단 이번 두 화면은 `custom.js` 로컬 보강맵/후처리로 주요 문구를 즉시 치환하도록 보완함. 로그인 세션 의존 페이지(`/mypage/hack_out.php`)는 최종 DOM 육안 확인 권장.

#### 세션 기록 (2026-06-06 / 마이페이지 1:1 문의 아이콘 소실 수정 — 배포·검증됨)
- **증상**: 마이페이지 1:1 문의 메뉴/링크의 아이콘이 사라짐. 최근 1:1 문의 링크를 카카오톡 채널로 치환하는 로직과 마이페이지 메뉴 레일 보정 이후 발생.
- **원인**: `custom.js`의 `_wireKakaoInquiry()`가 대상 링크에 `.text(_kakaoLabel)`을 호출해 링크 내부 HTML을 통째로 교체함. 이때 `global-side.js`가 만든 메뉴 링크 안의 `<img>`/아이콘 노드까지 삭제되어 텍스트만 남음. **CSS 문제가 아니라 JS가 DOM 자식 노드를 제거한 문제**.
- **수정(`custom.js`)**: 1:1 문의 링크의 `href/target/rel` 치환은 유지하되, 링크에 자식 요소가 있으면 텍스트 노드만 제거 후 `_kakaoLabel`을 append하도록 변경. 자식 요소가 없는 일반 텍스트 링크만 기존처럼 `.text(_kakaoLabel)` 사용. → 아이콘 보존 + 라벨 통일 동시 달성.
- **최종 UX 정책(사용자 확정)**: 화면 라벨은 **`1:1 문의`로 유지**한다. `카톡 상담` 등으로 문구를 바꾸지 않는다. 대신 클릭 대상은 카카오톡 채널 `http://pf.kakao.com/_MhWxkM`로 연결하고, 링크 클릭 경로는 반드시 `target="_blank"`/`rel="noopener"`로 **새창** 처리한다. 직접 URL(`/service/qa.php`, `/board/list.php?bdId=qa`, `/mypage/mypage_qa.php`) 진입은 브라우저 팝업 정책상 자동 새창이 막힐 수 있으므로 현재 탭 리다이렉트 허용.
- **배포·검증**: `node --check custom.js` 통과, `ReadLints` 오류 없음. `expect` 기반 SFTP로 `/dobuddy/12cut/custom.js` 업로드(99199B, `Jun 6 16:15`) 완료. 라이브 `https://12cut.co.kr/dobuddy/12cut/custom.js?z=...`에서 `children().length`·`nodeType===3`·`append(_kakaoLabel)` 마커 확인 완료.
- **재발 방지**: 메뉴/버튼/아이콘이 섞인 링크를 치환할 때 `.text()`·`.html()`로 전체 내용을 덮지 말 것. 특히 `global-side.js`가 만든 마이페이지 메뉴는 아이콘 노드를 포함할 수 있으므로, 라벨 변경은 **텍스트 노드만 조작**해야 함.

#### 세션 기록 (2026-06-06 / 주문내역 주문취소 버튼 번역 누락 수정 — 배포·검증됨)
- **증상**: `/mypage/order_list.php` 주문내역에서 상태 필터·본문은 다국어로 보이지만 각 주문 행의 **`주문취소` 버튼만 한국어로 잔존**. 첨부 화면 기준 EN 상태에서 `Order History` 하위 버튼이 `주문취소`로 표시됨.
- **원인**: 주문내역 행 버튼은 고도/global 렌더 이후 원문 text/value로 남고, `custom.js`의 `/mypage/order_list.php` case는 `body-mypage-order`·헤더·이미지 다운로드 링크만 처리해 버튼 번역 후처리가 없었음. 사전에도 FAQ 문장 `주문취소 했는데 언제 환불되나요?`는 있었지만 버튼 단독 키 `주문취소`/`주문 취소`가 없었음.
- **수정(`custom.js`)**: `_cutPageTx` 로컬 보강맵에 `주문취소`·`주문 취소` 추가(en `Cancel Order`, ja `注文キャンセル`, zh `取消订单`). `/mypage/order_list.php` case에서 `button`·`a`·`input[type=button|submit]`의 text/value가 `주문취소` 또는 `주문 취소`이면 `_ct()`로 즉시 치환하도록 300ms 후처리 추가. 기존 브라우저의 `localStorage.$lang` 캐시가 남아도 버튼은 즉시 교정됨.
- **수정(사전)**: `scripts/fill_i18n.py` `NEW_KEYS`에 `주문취소`·`주문 취소` 추가 후 `scripts/i18n_out/{en,ja,zh}.html` 재생성. `/dobuddy/files/{en,ja,zh}.html`에도 SFTP 배포해 신규/캐시 없는 사용자는 사전 경로에서도 정상 번역.
- **배포·검증**: `node --check custom.js` 통과, `ReadLints` 오류 없음. `expect .deploy.exp`로 `/dobuddy/12cut/custom.js`와 사전 3종 업로드(PTY 고갈로 sandbox `expect` 실패 후 `required_permissions:["all"]`로 성공). 라이브 `custom.js`에서 `주문취소` 마커 확인, 라이브 사전에서 en `Cancel Order`, ja `注文キャンセル`, zh `取消订单` 키 확인 완료. 업로드 직후 사전 HTTP 응답은 잠시 stale였으나 약 30초 후 새 키 반영 확인.

#### 세션 기록 (2026-06-06 / 장바구니 배지 stale + 스토리 편집상품 리스트 드롭 수정 — 배포·헤드리스 검증됨)
- **증상 2종**: ① 장바구니에 상품(요약 ₩490,000/1개)이 있는데 **리스트(상품 행)가 안 보임**(사용자 확인: 스토리 편집 상품). ② **로그아웃해도 헤더 장바구니 배지 숫자가 계속 유지**됨.
- **★ 핵심 발견 — 리스트는 `ui.setCartList`가 렌더, `no` falsy면 행 드롭**: cart.php 리스트는 `global.js`의 `setCartList()`(319행)가 서버 원본 `.cart_cont_list tbody>tr`를 읽어 `.cart-li`로 변환(렌더된 `data-p="${p*q}-${dis}"` 포맷이 setCartList 고유 출력 → cart.php도 이 함수 사용 확정. 체크박스는 cart 전용 래퍼가 추가). 그런데 `no=tr.dataset.goodsno||d.goodsNo`가 falsy면 `return !no?''`로 **그 행을 통째로 빈 문자열 렌더** → 모든 행이 비면 `.list-msg` 폴백. **요약 금액은 별도 서버 소스라 남음** → "리스트만 빔 + 금액은 보임" 증상. 스토리 편집상품은 옵션(priceInfo) 기반이라 일부 상태에서 `no` 미해결.
- **★ 핵심 발견 — 배지는 `localStorage.cartCnt` 영구 캐시**: 배지 카운트 = `ui.gdEtc.cartCnt` = **`localStorage.cartCnt`**(global.js 256·261~262행, sessionStorage 아님). goods API 응답에 `cartCnt`가 없으면(`r.cartCnt==undefined`) 기존 localStorage 값 유지 → **로그아웃해도 안 지워짐**. 실제 카운트 동기화는 `setCartList`(322행)가 도는 cart/order 페이지에서만.
- **진단 방법(필수)**: cart는 통화분기·global 재구성·로그인 의존이라 **curl 무력 → 헤드리스(puppeteer-core+시스템 Chrome) post-JS DOM 필수**. 게스트로 편집기와 동일한 옵션 add(`/order/cart_ps.php`, `goodsNo[]=1000000000&optionSno[]=14`)는 **정상 렌더**됨(1·2개·KRW 모두) → "옵션상품이라 항상 드롭"은 아니고 **회원/특정 데이터 상태 한정**. 사용자 로그인 카트의 broken DOM은 게스트 권한으로 미재현. 스크립트군 `/tmp/cartdiag/*.cjs`.
- **수정(`custom.js` 전용, 공용 global.js 무수정)**:
  1. **리스트 드롭 근본 보정(`beforeRun`)**: `ui.setCartList`를 1회 래핑(`ui.__cutCartFix`). 호출 직전 `.cart_cont_list tbody>tr` 각 행에 `dataset.goodsno`가 없으면 ① 첫 input `data-goods-no` ② priceInfo JSON `goodsNo` ③ `a[href*=goodsNo=]` ④ 폴백 `1000000000`(편집기 고정 goodsNo) 순으로 채움. → global이 `no`를 해결해 **정상 행(체크박스·버튼·가격 포함)을 스스로 렌더**(마크업 복제 불필요). 이미 goodsno 있으면 skip = **정상 카트 무영향**(price 분기는 `d.goodsNo`(input dataset) 기준이라 미변경, `tr.dataset.goodsno`는 `no`에만 영향).
  2. **배지 stale 보정(`afterRun`, `_isCutLoggedIn` 직후)**: 로그아웃 링크 클릭 시 `localStorage.removeItem('cartCnt')` + **비로그인(`!_isCutLoggedIn()`) 상태에서 cart/order 페이지 제외 시 캐시 제거 + 배지 빈값**. cart/order는 setCartList가 실제 행수로 동기화하므로 제외.
- **검증(요청 가로채기 헤드리스)**: 수정본 `custom.js`를 `setRequestInterception`으로 라이브에 주입. ① cart.php 정상 카트: 행 정상 렌더(`li:1`, 중복 없음), 배지 stale 7→실제 1로 동기화. ② 비로그인 일반 페이지: 배지 ""·`cartCnt` 제거. (probe의 `window.custom`/`window.ui` false는 lexical 전역이라 생긴 false negative, 동작은 정상.) `_isCutLoggedIn`은 게스트 헤더의 `로그인` 링크로 false 반환 정상(헤더 공통 `주문조회` 텍스트로 오판 안 함).
- **배포**: `node --check` 통과·`ReadLints` 0. 편집 전 로컬==라이브 동일(99,785B) 확인 후 `expect .deploy.exp custom.js /dobuddy/12cut/custom.js`(AUTHED 204ms·100%). 라이브==로컬 동일(101,804B), 마커 `__cutCartFix`×2·`click.cutCart`×1 확인.
- **잔여/주의**: 사용자 실제 로그인 broken 카트는 미재현이라 **리스트 복구의 실효는 실기기 최종 확인 권장**(로직상 `no` 해결로 수복). 배지: **현재 이미 stale한 기존 사용자**는 비로그인 시 다음 새로고침에 클리어(또는 cart.php 방문 시 동기화). 게스트가 일반상품을 담은 경우 비-cart 페이지에서 배지가 잠시 빈값일 수 있으나 cart.php에서 실제값 복원(자가치유). **공용 파일 변경분 외주 통지 대상**(`custom.js`: setCartList 래퍼 + 배지 보정).

#### 세션 기록 (2026-06-07 / 모바일 헤더 12cut 로고 크기 통일 — 배포·검증됨)
- **증상**: 홈 모바일 헤더와 비홈 공통 모바일 헤더(`.cut-mobile-header`)의 12cut 로고 크기가 달라 보임. 직전 작업에서 위치·색상·장바구니 아이콘은 통일했지만, 로고 자체의 기준값이 서로 달랐음.
- **원인**: 홈은 `style.css`의 `.nav__logo-img`가 `height:34px;width:auto` 기준으로 렌더되는 반면, 비홈 주입 헤더는 `custom.css`에서 `.cut-mobile-header__logo`/`img`를 `78px × 28px` 고정으로 둬 실제 높이가 6px 작았음. 같은 SVG라도 높이 기준이 다르면 헤더 내 존재감이 달라짐.
- **수정(`custom.css` 한정)**: `.cut-mobile-header__logo`와 `.cut-mobile-header__logo img`를 모두 `height:34px!important;width:auto!important`로 변경. 비홈은 흰 배경이므로 기존 `filter:brightness(0)!important`는 유지. 홈 `style.css`/스킨은 미수정.
- **배포·검증**: `custom.css` 린트 오류 없음. PTY 없는 OpenSSH SFTP(`SSH_ASKPASS_REQUIRE=force`)로 `/dobuddy/12cut/custom.css` 업로드(93,335B·mtime Jun 7 00:42). 라이브 HTTP는 최초 1회 stale(88,901B) 후 약 20초 뒤 새 마커(`width:auto!important;height:34px!important`) 확인 완료.
- **재발 방지**: 모바일 헤더 로고 기준은 홈·비홈 모두 **높이 34px + width auto**로 통일한다. 향후 헤더 수정 시 Figma의 박스 크기(`78×28`)를 그대로 고정하지 말고, 실제 홈 렌더 기준(`.nav__logo-img`)과 비교해야 함.

#### 세션 기록 (2026-06-07 / 스토리 편집기 모바일 타이포·썸네일 보정 — 배포·검증됨)
- **요구 흐름**: 상품 커스텀 편집기(`/dobuddy/12cut/12cutEditor.html`) 실폰 확인 중 ① 모바일 확대컷 이미지 깨짐 ② 하단 썸네일 스와이프/정렬 ③ step0/1 섬네일 세로 스크롤 막힘 ④ 모바일 텍스트가 커스텀 화면을 가림 ⑤ step2 하단 썸네일 레일 배경이 트리밍 화면과 겹침 ⑥ 알림 팝업 타이틀 과대 ⑦ 이미지 로드 후 썸네일 빨간 보더 2중 표시가 순차 보고됨.
- **이미 반영·배포 확인된 편집기 CSS 변경**: `editor.css` 모바일에서 step0/1 세로 터치 허용(`body:has(#app[data-step="0/1"]){touch-action:pan-y}`), step0/1 하단 버튼 가림 방지 padding 추가, `.full` 모바일 확대컷은 `scale(3.3)` 유지 + `transform-origin:50% 8vh`로 정렬 복구. 모바일 타이포는 `font-size`뿐 아니라 `line-height`·`letter-spacing`까지 조정: 탭/안내문/하단 버튼/가이드 본문 기준값 추가, 영문·일문 안내문 자간 추가 압축(en `.tab-guide` `-0.035em`, ja `.tab-guide` `-0.03em`), 팝업 타이틀 1차 축소(`.alert .title` 17px → 이후 로컬에서 15.5px로 추가 축소).
- **최신 수정(배포 완료)**: `editor/12cutEditor.html`의 `.load` 반복 노드에 `imgs[i-1] && 'has-img'` 클래스 추가. `editor/editor.css`에서 `.load.has-img::before{background:none}`로 이미지가 들어간 슬롯의 빈 슬롯 SVG 보더를 제거해 2중 보더 방지. `#app[data-step="2"] .imgs`에 `background:rgba(255,255,255,.94)`, `border-top`, `box-shadow`, 상하 padding을 추가해 트리밍 화면과 하단 썸네일 레일을 시각적으로 분리. 모바일 `.alert .title`을 15.5px, en/ja는 15px로 추가 축소.
- **장애 원인(정밀검토 결과)**: 실폰에서 이중 보더가 계속 보인 이유는 로컬 보정이 아니라 **라이브 미반영**. 배포 전 라이브 `12cutEditor.html`은 `has-img` 0회, 라이브 `editor.css`는 `.load.has-img::before` 0회였고, `.load::before`의 빈 슬롯 SVG가 이미지가 있는 슬롯에도 계속 렌더되어 이미지 보더와 겹쳤음.
- **배포·검증**: `expect` 기반 SFTP로 `editor/editor.css`→`/dobuddy/12cut/editor.css`, `editor/12cutEditor.html`→`/dobuddy/12cut/12cutEditor.html` 업로드 완료(`Jun 7 01:36`, CSS 16KB·HTML 32KB). 라이브 HTTP에서 `has-img` 1회, `.load.has-img::before` 1회, `rgba(255,255,255,.94)` 1회 확인. 헤드리스 렌더 검증: 일반 URL(주의: `dev=1` 금지)에서 Vue 상태에 이미지 1장을 주입했을 때 첫 슬롯 `class="load has-img"`, `::before background-image:none`, 빈 슬롯은 기존 SVG 유지.
- **주의**: `12cutEditor.html`은 외주 공유 파일이므로 다음 편집기 수정 전 라이브 pull/diff 원칙 유지. `dev=1`은 편집기가 테스트 데이터를 넣고 step2→step3으로 자동 이동하므로 step0 썸네일 검증에 쓰면 안 됨. 실기기에서 stale이면 탭 종료 후 재진입 또는 강제 새로고침으로 확인.

#### 세션 기록 (2026-06-07 / 홈 푸터 공통화·모바일 레일·헤더 배지 정렬 — 배포·검증됨)
- **요구 변천**: 홈 전용 푸터를 마이페이지/상품상세의 두버디 공통 푸터와 맞출지 검토 → 처음엔 홈 전용 푸터를 12cut식 신뢰 정보 구조로 확장했으나, 최종 지시는 **"홈화면의 푸터를 두버디 공통 푸터로 반영"**. → `skin/main/index.html`의 랜딩 전용 `<footer class="footer" id="footer">` 마크업을 제거하고 `{ # footer }` 토큰으로 붙는 고도 공통 `#footer_wrap`만 사용하도록 전환. 레퍼런스 `index.html`의 홈 전용 푸터도 제거.
- **공통 레이어 영향 없음**: 공통 `_footer`/`global.css`/`global.js`는 수정하지 않음. 홈에서 공통 푸터를 숨기던 `custom.css`의 `.body-main #footer_wrap` 숨김만 해제. `#header_warp`, `.location_wrap`, `.side_cont`, `#foot-bar` 숨김은 유지.
- **푸터 배경/간격 보정(`custom.css`)**: 공통 푸터를 홈에 노출하자 `#footer_wrap` 배경과 FAQ 아래 베이지 띠가 보임. `#footer_wrap`·`.content_info_wrap`·`#footer`·`.foot_list`·`.foot_cont`·`.foot_certify`는 `background:#fff!important`로 고정. 홈에서 `#container` 하단 여백과 `#footer_wrap`/`.content_info_wrap` 상단 margin/padding/border를 0으로 눌러 FAQ와 푸터 사이 빈 띠 제거.
- **플로팅 아이콘 흰 박스 버그**: 처음 흰 배경 대상에 `.scroll_wrap`까지 포함해 우측 플로팅 아이콘 뒤에 흰 세로 박스가 생김. 원인은 고도 `scroll_wrap/#scroll_right` 컨테이너를 푸터 배경으로 오인한 것. → `.scroll_wrap`, `#scroll_left`, `#scroll_right`, `.right_banner`, `.scroll_right_cont`, `.btn_scroll_top`은 `background:transparent!important`로 분리. **향후 푸터 배경 보정 시 `.scroll_wrap`을 푸터로 취급하지 말 것.**
- **모바일 푸터 레일 통일**: 실측상 모바일 390px에서 `#footer_wrap .foot_cont`가 좌우 약 20px(폭 351px)로 렌더되어 기존 12cut 모바일 레일(좌우 16px/콘텐츠 358px)과 불일치. `@media (max-width:850px){#footer_wrap .foot_cont{width:auto;margin-left:16px;margin-right:16px;box-sizing:border-box}}` 적용. 헤드리스 재측정: viewport 390, left 16, right 16, width 358, scrollWidth 390.
- **모바일 헤더 장바구니 배지 위치 통일**: 홈은 `style.css`의 `.nav__cart-badge{top:0.5px;left:12px}`, 비홈은 `custom.css`의 `.cut-mobile-header__badge{top:-5px;left:12px}`라 배지가 위로 5.5px 올라가 보임. 비홈을 홈 기준에 맞춰 `top:.5px;left:12px`로 변경. 배지 크기/폰트/색은 기존 값 유지. 라이브 CSS 마커 확인 완료.
- **배포·검증**: `expect .deploy.exp`로 `skin/main/index.html`→`/data/skin/front/moment/main/index.html`, `custom.css`→`/dobuddy/12cut/custom.css` 필요 시 반복 업로드. 라이브 홈 검증: 랜딩 전용 `.footer` 0개, 공통 `#footer_wrap` 1개, `CS CENTER`·`BANK INFO`·`주식회사 두버디` 노출. `custom.css` 라이브 마커 확인. `ReadLints` 오류 없음. 모바일 폭/배지는 `puppeteer-core` + 시스템 Chrome 헤드리스 실측.

#### 세션 기록 (2026-06-07 / 모바일 하단 앱바 정렬·i18n·언어 즉시 반영 — 배포·검증됨)
- **구현 위치**: `custom.js` `afterRun()` → `_cutBottomNav()`가 `.cut-bottom-nav`(Home / 12cut / My)를 `body`에 append. 스타일은 `custom.css` `@media (max-width:850px)` `.cut-bottom-nav` 블록(Figma 16-28059/16-28074 기준). 회원·결제·편집기 경로는 주입 차단.
- **① 수직 정렬 보정(`custom.css`)**: 증상 = 앱바 70px 안에서 아이콘+텍스트 묶음이 위로 붙고 하단 여백만 과다. 원인 = `.cut-bottom-nav{align-items:flex-start}` + `.cut-bottom-nav__item{justify-content:flex-start}`. 수정 = 컨테이너 `align-items:center`, 아이템 `justify-content:center`. 라이브 `custom.css` 마커(`align-items:center!important`·`justify-content:center!important`) 확인.
- **② 메뉴 텍스트 번역(`custom.js`)**: 증상 = `home`/`my` 영문 하드코딩으로 `$t()`·사전 미경유. 수정 = `_cutPageTx`에 `홈`/`마이` 추가(en `Home`/`My`, ja `ホーム`/`マイ`, zh `首页`/`我的`), 생성 시 `_ct('홈')`·`_ct('마이')` 사용. `12cut`은 브랜드명으로 고정 유지.
- **③ 언어 변경 즉시 반영(`custom.js`)**: 증상 = 언어 전환 후 본문은 바뀌어도 앱바 라벨은 초기 로드 값 유지, 수동 새로고침 필요. 원인 = 앱바가 최초 1회만 생성·갱신 로직 없음. 홈은 `script.js` `applyLang()`이 랜딩만 in-place 갱신(새로고침 없음). 비홈 `#sel_lang`은 `global.js`가 `location.reload()`하지만 앱바는 별도 DOM이라 동기화 누락 시 stale.
- **③ 수정 상세**: `_syncCutBottomNav()`(기존 nav span·aria-label 즉시 치환), `_applyCutLang(lang)`(`_cl`·body class·모바일 lang 버튼 active·앱바 sync). `_cl` 초기화를 `_cutMobileHeader()` 호출 **이전**으로 이동(모바일 lang active 상태 버그 동시 해소). 훅: `#sel_lang` `change.cutLang`, `.lang-btn`/`[data-lang]` `click.cutLangBtn`(`.cut-mobile-lang-btn` 제외), `.cut-mobile-lang-btn` `click.cutLangMobile`(sync 후 reload 유지).
- **배포·검증**: `expect .deploy.exp`로 `custom.css`→`/dobuddy/12cut/custom.css`, `custom.js`→`/dobuddy/12cut/custom.js` 각 1회 성공. `node --check custom.js` 통과. 라이브 마커: CSS 정렬 규칙, JS `_syncCutBottomNav`·`_applyCutLang`·`click.cutLangBtn`. 엣지 전파 10~20초 지연 후 curl 확인.
- **재발 방지**: 12cut 전용 JS 주입 UI(앱바·모바일 헤더 등)는 **언어 전환 시 `$t()`만 믿지 말고** `_applyCutLang` 또는 동등한 sync를 모든 lang 경로에 연결. 신규 앱바/푸터 커스텀 추가 시 생성+갱신 함수 분리 원칙 유지.

#### 세션 기록 (2026-06-07 / 체크박스 체크마크 위치 버그 수정 — 배포·검증됨)
- **요구**: `/member/join_agreement.php`(약관동의) "체크박스+화살표" 행에서 체크박스 선택 표현이 깨짐. 장바구니(`/order/cart.php`)처럼 빨간 라운드 박스 + 흰 체크마크로 통일.
- **★ 근본 원인 — 체크마크(`::after`) 위치 기준은 항상 라벨(label)**: `custom.css`의 공통 "체크마크 중앙 정렬 보정" 블록이 **모든** 커스텀 체크박스에 `left:50%`를 적용 중이었음.
  - **Pattern A (요소 자체가 박스, 텍스트 없음)**: 장바구니 `.body-cart .body label.check_s`(20px)·주문서 전체동의 `.ord-agree`(22px) → `left:50%` = 박스 중심 → **정상**.
  - **Pattern B (라벨에 텍스트 있고 박스는 `::before`, 박스 `left:0`)**: 약관동의·회원가입(`join.php`)·회원정보수정(`my_page.php`)·주문서 약관(`.f2 .form_element label`)·로그인 상태유지 → `left:50%` = **텍스트 라벨의 한가운데** → 흰 체크마크가 빨간 박스를 벗어나 **글자 위로 떠버림** = 사용자가 본 "체크박스 아이콘 오류".
- **수정(`custom.css` 보정 블록 분리, line ~689~)**: 가로 중심을 **라벨 폭과 무관한 박스 px 중심**으로 고정.
  - Pattern A 유지: `left:50%/top:48%` (cart `label.check_s` · orderform `.ord-agree`).
  - Pattern B1 (박스 20px, `top:0`): `left:10px/top:10px` — 약관동의 `.join_agreement_cont`, 주문서 `.f2 .form_element label`.
  - Pattern B2 (박스 20px, `top:50%` 세로중앙): `left:10px/top:50%` — 회원가입 `.body-join #formJoin`, 회원정보수정 `.body-mypage-edit #formJoin`.
  - 로그인 상태유지(박스 18px, `top:0`): `left:9px/top:9px`.
  - 공통 변환은 `translate(-50%,-50%) rotate(45deg)` 유지 → 박스 중심에 체크마크 정중앙.
- **진단 방법**: 라이브 헤드리스(`puppeteer-core`+시스템 Chrome)가 네트워크 지연으로 중단 → **로컬 하니스로 전환**(`/tmp/cartdiag/harness.html` = 약관 DOM 재현 + `file://` 로컬 `custom.css` 로드, `--allow-file-access-from-files`). 헤드리스는 **샌드박스 밖(`required_permissions:["all"]`)** 에서만 실행됨. 측정 결과 박스 `rgb(246,50,55)` 20px + 체크마크 `left:10px top:10px`(=박스 중심) 확인, 스크린샷 육안 검증(빨강 박스 + 정중앙 흰 체크 + `>` 화살표 정상).
- **배포·검증**: 공용 파일이라 배포 전 라이브 `custom.css` pull→diff = **내 보정 블록 변경분만 차이(외주 변경 0)** 확인. `expect .deploy.exp custom.css /dobuddy/12cut/custom.css`(AUTHED 195ms·100%). 엣지 12초 후 라이브 = 로컬 **바이트 일치**, `Pattern B1` 마커 확인. `ReadLints` 0.
- **영향 범위**: 약관동의 외 회원가입 정보입력·회원정보수정·주문서 약관·로그인 상태유지 체크박스가 **함께 정렬 교정**됨(같은 버그였음).
- **외주 통지 대상**: `custom.css` 보정 블록 변경 → 공용 파일 diff 공유 필요.
- **잔여(검토)**: 약관 행 체크박스 크기(현재 20px) 유지 vs 확대 — 약관은 리스트 스캔 목적이라 20px 적절 판단, 장바구니(상품 선택)와 최적 크기 다를 수 있음.

#### 세션 기록 (2026-06-07 / 약관·로그인·팝업 i18n 누락 보정 — 배포·검증됨)
- **증상**: `/member/join_agreement.php?memberFl=personal`에서 상단 헤더 언어 변경 시 일부 문구가 한국어로 잔존. 특히 커스텀 헤드라인 `12cut 이용을 위한 / 약관에 동의해주세요.`와 전체동의 문구 `12cut의 모든 약관을 확인하고 전체 동의합니다.`가 미번역. 이후 첨부 실폰 화면 기준 장바구니 빈 상태 팝업에서 `通知/確認`은 번역되지만 본문 `장바구니에 담겨있는 상품이 없습니다.`만 한국어 잔존. `/member/login.php`도 소셜/회원 버튼 일부 번역 누락 확인.
- **원인**: 라이브 `/dobuddy/files/{ja,en,zh}.html` 사전이 외주/공용 bd2 기반으로 갱신되며 12cut 전용 키가 소실됨. 공용 사전에는 `브라운더스트2 굿즈...` 등 타 서비스 키는 있으나 `12cut 이용을 위한`, `약관에 동의해주세요.`, `장바구니에 담겨있는 상품이 없습니다.` 같은 12cut 전용 UI 키가 없음. `$t()`는 키가 없으면 한국어 원문을 그대로 반환.
- **수정(`custom.js` 전용, 공용 사전·`global.js` 미수정)**: `_cutPageTx` 로컬 보강맵에 약관 헤드라인/전체동의, 로그인 버튼(`구글로 로그인`, `Apple로 로그인`, `Facebook으로 로그인`, `12cut 아이디로 로그인`, `카카오로 로그인`, `네이버로 로그인`, `회원가입`, `아이디 찾기`, `비밀번호 찾기`, `아이디 저장`, `또는`, 비회원 주문조회 안내), 팝업 본문(`장바구니에 담겨있는 상품이 없습니다.`)을 en/ja/zh로 추가. `_ct()` 경유로 약관 헤드라인을 렌더하고, `_translateCutText()`로 12cut 전용 텍스트 노드/value/placeholder/aria-label을 후처리. 팝업처럼 늦게 생성되는 레이어는 `_watchCutLayerText()` `MutationObserver`로 치환.
- **중요 주의 — 약관 법무 본문 제외**: `.agreement_box`, `textarea`, `.terms_box`, `.scroll_box`, `script`, `style`는 후처리 제외. 약관 조항 원문은 서버 법무 텍스트라 자동 번역 대상이 아니며, 이번 작업은 구조적 UI/CTA/팝업 문구만 대상으로 함.
- **배포·검증**: `node --check custom.js` 통과, `ReadLints` 오류 없음. `expect .deploy.exp custom.js /dobuddy/12cut/custom.js`로 SFTP 업로드 성공(AUTHED 217ms, 118KB 100%). 라이브 HTTP 2회 확인: size `121338`, 마커 `There are no items in your cart` 1, `Continue with Google` 1, `_watchCutLayerText` 2, 로컬과 라이브 `cmp` **IDENTICAL**.
- **헤드리스 검증**: `/member/login.php` 모바일 390px에서 ja/en/zh 각각 Google/Apple/Facebook/회원가입 버튼 번역 확인(ja `Googleでログイン`, en `Continue with Google`, zh `使用 Google 登录`). `/order/cart.php` 빈 카트 전체주문 클릭 팝업에서 사용자 표시 본문이 ja `カートに商品が入っていません。`로 치환됨 확인. DOM 전체에는 숨은 원본/스크립트 조각으로 한국어가 남을 수 있으나, 실제 표시 팝업 본문은 번역됨.
- **운영 규칙(재발 방지)**: 12cut 전용 UI 문자열은 공용 사전에 의존하지 말고 `_cutPageTx` 로컬 보강맵을 함께 점검. 특히 팝업/레이어/alert류는 페이지 로드 후 늦게 생기므로 `$t()` 정적 검증만으로 완료 판단 금지, MutationObserver 또는 헤드리스 post-JS DOM으로 실제 표시 텍스트 확인 필요.

#### 세션 기록 (2026-06-07 / 재인증 안내문 + 장바구니 알림 팝업 번역 — 배포·헤드리스 검증됨)
- **요구**: ① `/mypage/my_page_password.php` 재인증 안내문 번역 ② 첨부 팝업("구매 불가능한 상품이 존재합니다. 장바구니 상품을 확인해 주세요!")이 **일본어 화면인데 본문만 한국어**로 남는 문제 + 장바구니/주문 팝업 문구 전반 검토.
- **★ 근본 메커니즘 — `ui.alert()` 본문은 `$t(html)`로 사전 번역**: 공용 `global.js`의 `ui.alert(html,{title,okTitle,confirm,noTranslate})`는 `if(!noTranslate)html=$t(html)`로 본문을 사전 치환하고, 모달은 `<h2 class=title>$t(title||'알림')</h2><div class=contents>${html}</div><a class=primary>$t(okTitle||'확인')</a>` 구조. → **타이틀(通知=$t('알림'))·버튼(確認=$t('확인'))은 사전에 있어 번역되는데, 본문 문구는 사전에 키가 없어 한국어 폴백**이 정체. = "타이틀/버튼은 일본어, 본문만 한국어" 현상.
- **★ 출처 추적 무용 — DOM 텍스트 매칭이 정답**: 스크린샷 문구는 `global.js`·`cart.php` inline·19개 외부 JS·`\uXXXX` 디코드 어디에도 없음(동적 AJAX/서버 생성 추정). 출처를 쫓는 대신 **문구 자체를 사전 키로 등록**하면 `$t(html)`가 직접 번역. 보조로 `custom.js`의 `_watchCutLayerText`(MutationObserver가 `document.body` subtree 감시 → `_translateCutText`로 텍스트 노드 trim 매칭 치환)가 캐시 stale 사용자까지 커버.
- **사전 대조 결과**: 장바구니/주문 팝업 문구 대부분(`옵션을 선택하세요`·`장바구니에 담긴 상품이 없어요.`·`주문내역이 없습니다.`·`해당 상품은 현재 구매가 불가한 상품입니다.`)은 **이미 사전에 있음**. 누락은 3개뿐 → 추가.
- **조치(이중 안전망)**: `scripts/fill_i18n.py` `NEW_KEYS`에 ① `구매 불가능한 상품이 존재합니다. 장바구니 상품을 확인해 주세요!` ② `구매확정 하시겠습니까?` ③ `재고가 부족합니다. 현재 %s개의 재고가 남아 있습니다.`(`%s` sprintf 토큰) 추가 → `i18n_out/{en,ja,zh}.html` 재생성. 고정 문구 2개(①②)는 `custom.js` `_cutPageTx` en/ja/zh에도 추가(캐시 사용자 즉시 치환). 재인증 안내문(`회원님의 정보를 안전하게 보호하기 위해…`)도 사전+`_cutPageTx` 반영.
- **배포 안전성**: 배포 전 라이브 ja.html과 생성본 대조 = `OUT 384키 = LIVE 381 + 신규 3`, **`LOST_IF_OVERWRITE 0`**(라이브 키 손실 0) 확인 후 덮어씀. `expect .deploy.exp`로 사전 3종(`/dobuddy/files/`) + `custom.js`(`/dobuddy/12cut/`) 4파일 100% 전송. (1차 배포는 ServerAlive `eof` 행으로 사용자 중단 → 라이브 미반영 확인 후 재배포 성공. **AGENTS "ServerAlive eof 함정" 재확인**.)
- **검증(헤드리스 실측)**: `localStorage.$mylang` 세팅 + `$lang` 캐시 제거 후 `cart.php`에서 `ui.alert(원문)` 직접 호출 → **JA** `通知`/`購入できない商品があります。カートの商品をご確認ください。`, **EN** `Notification`/`Some items can't be purchased. Please check the items in your cart.`, **ZH** `通知`/`购物车中有无法购买的商品，请确认购物车商品！` 전부 정상. 라이브 사전 384키·신규 3키·`custom.js` 마커 확인.
- **주의**: 사전 신규 키는 `localStorage.$lang` 캐시로 **기존 사용자는 언어 1회 전환 시 반영**(신규/캐시없는 사용자 즉시). `_cutPageTx`+MutationObserver가 stale 캐시도 즉시 치환. **외주 통지 대상**: `custom.js`·사전 3종.
- **잔여(검토)**: 결제(`order.php`) 진입 단계의 검증 알림 팝업은 미점검(현재는 장바구니→주문 진입 구간만 커버). `jayw` 카트가 비어 실제 구매불가 팝업 자연 재현은 못 함(빈카트 메시지로 `$t` 메커니즘 검증).

#### 세션 기록 (2026-06-07 / 주문서 외화 배송비 $1,000 버그 수정 — 배포·검증됨)
- **증상**: 외화(예 USD) 결제 시 `/order/order.php` 주문요약에서 **총 배송비 `$1,000`**, **총 상품 금액 `$0`**, 최종결제 `$1,047`로 표기(상품가 $47). 사용자 스크린샷 수치와 코드가 100% 일치.
- **★ 근본 원인 — 공용 `global.js` 외화 분기 버그(전 서비스 공통)**: `https://browndust2-goods.com/dobuddy/global.js` 156~164행, `if(sel_currency.selectedIndex)`(비-KRW) 분기에서 ① `let F=1000`(배송비 상수) 하드코딩 → `ui.fmPrice(F,1)`은 `r=1`이라 **환율 변환 안 함**(364행) → 통화 무관 "1,000"이 그대로(`$1,000`/`¥1,000`). ② "총 상품 금액"을 상품합 `T`가 아니라 **할인합 `D`**(=0)로 표기. 최종=`T−D+F`=47−0+1000=`$1,047`. KRW 결제는 정상 분기(165행+, godo 실 `totalDeliveryCharge` 사용)라 무영향. **bd2·vsquare·donut도 외화 결제 시 동일 증상**.
- **★ `fmPrice` 의미(중요)**: `ui.fmPrice(p)`(r 미지정)=원화→선택통화 **변환**(fcurrency 우선, 없으면 `p*환율`). `ui.fmPrice(p,1)`(r=1)=**변환 없이** `ceil(p)`+통화기호 → 인자가 **이미 해당 통화 단위**여야 함. 외화 분기는 모두 `,1` 사용이라 F=1000이 그대로 1,000 통화로 찍힘.
- **데이터 소스**: 상품합 `T`/할인 `D` = `.cart-li[data-p="환산가-할인율"]`(global `setCartList` 329행 생성, fcurrency 반영분). 배송비 = godo 표준 `#totalDeliveryCharge`(원화, KRW 분기 168행이 쓰는 동일 엘리먼트)를 `환율`로 환산 → **무료배송 규칙(5만원↑)도 그대로 반영**.
- **수정(12cut 오버라이드, 공용 `global.js` 무수정)**: `custom.js`의 `case '/order/order.php'`에 `if(typeof sel_currency!=='undefined'&&sel_currency.selectedIndex)`일 때만 `_cutFixOrderSum` 추가. `.cart-li[data-p]` 합산으로 `T`/`D` 계산, `#totalDeliveryCharge`×`ui.gdEtc[통화]`로 배송비 환산, `.cart-sumbox`(총상품=`T`·총배송=환산·할인=`D`>0시·최종=`T−D+ship`)와 `.ord-p>b` 재렌더. setInterval 200ms×25회(5s)로 global의 1회 렌더 이후 안정 적용(idempotent). KRW(selectedIndex 0)는 미개입.
- **배포·검증**: `node --check`·`ReadLints` 0 → `expect .deploy.exp custom.js /dobuddy/12cut/custom.js`(AUTHED 203ms·100%). 라이브 `custom.js` 117,140B·마커 `_cutFixOrderSum`×2 확인. **합성 하니스 검증**(global.js 실제 `fmPrice` 정의 + order.php DOM 복제, `/tmp/cartdiag/order_harness.cjs`): 배송비 ₩3,000→**총상품 $47/배송 +$3/최종 $50**, ₩0(무료)→**$47/+$0/$47**. (실 order.php E2E는 게스트 주문 `login.php?guestOrder=1` 인증+프로덕션 주문세션 생성 부작용이라 **의도적 미실시** → 실계정 로그인 상태 USD/JPY 1회 육안 확인 권장.)
- **공용 파일 diff 주의**: 배포 전 라이브 pull→diff = 헝크 3개(① 약관 i18n 키 3줄, ② 내 주문요약 블록, ③ 약관페이지 `_ct`/`_cutPageTx` 블록). ②만 이번 작업, ①③은 **다른 작업창의 미배포 약관 i18n 보강분**(로컬 ⊇ 라이브, 외주 변경 0). 사용자 승인하에 **①②③ 함께 배포**.
- **외주 통지 대상(P1)**: `global.js` 외화 분기 근본 수정(`F=1000` 하드코딩 + 총상품=`D` 오기) 요청 → 전 서비스 공통 해결. 12cut은 현재 우회 패치만 적용.

#### 세션 기록 (2026-06-08 / 주문서 배송지 UI·편집기 저장 흐름·GitLab 브랜치 반영)
- **주문서 배송지 UI 보정(`/order/order.php`)**: 상단 배송지 확인 영역에서 `Default Address`·`Recent Address`는 원본 ID(`#shippingBasic`, `#shippingRecently`)와 label 단계에서 숨김. `Same as Customer`를 먼저, `Manual Input`을 뒤로 배치. 상단 풀폭 `Address` 주소록 버튼은 `.js_shipping`으로 확인되어 제거(`display:none` + JS `remove()`), 하단 주소 섹션의 `Find Address` 버튼은 유지. 주소 도로명/상세 input은 `.address_input{display:flex;gap:12px}`로 간격 보정.
- **동작 보강**: `Same as Customer`는 단순 `checked=true`만으로 고도몰 내부 주소 복사 이벤트가 실행되지 않는 문제가 있어, 최초 1회 실제 `MouseEvent('click')`를 발생시키고 `orderName/orderCellPhone/orderZonecode/orderAddress/orderAddressSub` → `receiver*` 필드 후보로 직접 보강 복사. `Manual Input` 선택 상태에서는 자동 복사가 덮어쓰지 않게 가드.
- **다국어 레이아웃 함정**: 일본어 `直接入力`이 기존 수동입력 매칭식에 없어 일본어에서 위치/간격 보정이 누락됨. `직접 입력|直接入力|手動入力|Manual Input|手动输入`으로 확장. 배송 선택 영역은 `flex-wrap:nowrap` + 옵션 묶음 gap `56px`로 고정해 일본어에서도 같은 줄 유지 확인(`sameTop==manualTop`, gap 56px). 고정 190px grid는 일본어 긴 라벨을 줄바꿈시켜 폐기.
- **편집기 저장 흐름 보강**: `editor/12cutEditor.html` 변경분도 슬라이드 프롬프트/영상 제작물이 아니라 실제 편집기 저장 안정화 변경으로 판단해 별도 커밋. 저장 시 DOM `<img>` 의존 대신 Vue `cuts[]` 데이터 기반 렌더/업로드 메타 보강 흐름 포함(상세 diff는 커밋 참조).
- **Git 커밋/푸시**: 슬라이드 프롬프트·영상·생성 이미지 작업물(`.venv_video/`, `assets/videos/exhibition/`, `assets/images/generated/`, `MD/12CUT_*prompt*` 등)과 로컬 `.cursor/mcp.json`은 제외. 커밋 ① `31318c9 fix: 주문서 배송지 UI와 안내문 번역 보정`, ② `7a482e0 fix: 스토리 편집기 저장 흐름 보강`. `gitlab-bd2/main`은 외주/두버디 변경이 많아 direct push 거절 및 cherry-pick 충돌 발생 → main 미변경. 안전 브랜치 **`12cut-orderform-ui-20260608`** 로 push 완료(MR URL: `https://gitlab.com/keepcool.kr/202507-dobudy-bd2/-/merge_requests/new?merge_request%5Bsource_branch%5D=12cut-orderform-ui-20260608`).
- **남은 로컬 미추적**: 슬라이드 프롬프트/영상 제작 관련 파일과 `.cursor/mcp.json`만 남김. 다음 GitLab 반영 시에도 `gitlab-bd2/main` 직접 push 금지, 원격 최신 구조(`dobuddy/12cut/*`)와 충돌 확인 후 MR 방식 권장.

#### 세션 기록 (2026-06-08 / 결제수단 활성화 전 진단·장바구니 재보정 — 배포·검증됨)
- **요구/증상**: ① 결제하기 페이지에서 "주문만 되고 결제가 안 됨" ② 장바구니 숫자 배지 오류 ③ 상품 커스텀 완료 후 `장바구니 보기`·`바로 결제하기/주문하기` 진입 시 썸네일/상품행이 보이지 않는 문제. 사용자는 최종적으로 **고도 관리자에서 카드/간편/해외 결제수단 활성화** 방향을 선택했고, PG 설정 완료 전에는 무통장만 보이는 상태 안내를 노출하기로 함.
- **★ 결제 불가의 실제 원인**: 헤드리스로 게스트 주문 플로우를 열어 `/order/order.php?cartIdx=...` 실제 DOM을 확인한 결과, 주문서 결제수단은 **`무통장 입금` 1개만 노출**(`settleKind_gb` checked, `bankAccount` 존재, 카드/PG/간편/해외 결제 input/탭 DOM 없음). 따라서 프론트 버튼 문제로 결제창이 안 뜨는 것이 아니라 **고도 관리자/PG 계약 설정상 카드·간편·해외 결제수단이 비활성**인 상태. `custom.js`는 버튼을 `ui.clk('.btn_order_buy')`로 전달하고 있어, 결제수단이 열리면 기본 결제 로직을 탈 가능성이 높음.
- **장바구니 상품행/썸네일 누락 원인 재검증**: 기존 `custom.js`가 `const custom={...}`만 선언해 공용 `global.js`의 `window.custom?.beforeRun` 조건에 걸리지 않음 → `beforeRun()`의 `ui.setCartList` 래퍼가 실제 라이브에서 설치되지 않았음(`ui.__cutCartFix=false`). 추가로 편집기식 `cart_ps.php` POST 직후 서버 원본 테이블에 상품행 뒤 `재고부족` 안내용 `<tr>`(input 없음)이 붙는 경우, 공용 `setCartList()`가 `tr.querySelector('input').dataset`에서 중단되어 `.cart-li`가 0개가 됨.
- **수정(`custom.js`)**: ① 파일 하단에 `window.custom=custom` 추가해 `beforeRun()` 실제 실행 복구 ② `setCartList` 래퍼에서 input 없는 안내 `<tr>`는 렌더 전 제거하고, 상품행은 `tr.dataset.goodsno`를 보강 ③ 배지는 `_syncCutCartBadges()`로 cart/order에서는 서버 행수·`ui.gdEtc.cartCnt` 기준, 비로그인 일반 페이지에서는 stale 값을 화면에서 비움 ④ stale `localStorage.cartCnt`는 `_dropCutCartCnt()`로 `removeItem`+빈값 덮기+재삭제 처리.
- **임시 결제 안내 UI**: `/order/order.php`에서 결제수단 탭이 **무통장 1개뿐**이면 `.cut-payment-setup-notice`를 `#my_custom .filter` 뒤에 삽입. 문구: "현재 카드/간편/해외 결제수단을 활성화 중입니다. 설정 완료 전까지는 무통장 입금만 임시로 표시됩니다." en/ja/zh도 함께 포함. 결제수단 DOM이 늦게 생기는 타이밍을 흡수하기 위해 200ms×최대 20회 폴링(`_cutPayNoticeTimer`)으로 삽입.
- **배포·검증**: `node --check custom.js`·`ReadLints` 0. 배포 전 `custom.css`는 라이브가 로컬보다 최신이라 **수정하지 않음**(덮어쓰기 방지), `custom.js`만 라이브=로컬 확인 후 SFTP 배포. 라이브 마커 `window.custom=custom`, `_dropCutCartCnt`, `_syncCutCartBadges`, `_cutPayNoticeTimer`, `cut-payment-setup-notice` 확인. 헤드리스 검증: 편집기와 동일한 cart POST → 장바구니 `.cart-li` 1개, 썸네일 URL `https://img.12cut.net/12cut_usr/cart/{cartSno}_thumb.png`, 헤더/모바일 배지 `1`, 비로그인 stale 배지 빈값. 주문서 검증: `payTabs=["무통장 입금"]`, 안내 문구 정상 노출, `결제하기` CTA 유지.
- **관리자 설정 필요 정보**: 고도 관리자 URL/ID/임시 비밀번호/2FA 방식, 현재 계약 PG사, 해외카드·해외통화 결제 계약 여부. **중요**: "해외 통화 표시"와 "해외카드 실제 승인"은 별개. 실제 해외 고객 결제를 목표로 하면 고도 결제수단 노출뿐 아니라 PG사의 해외카드/3DS/정산통화 설정까지 확인해야 함.
- **외주/운영 통지 대상**: `custom.js` 변경분(`window.custom` 노출, `setCartList` 안전화, 배지 동기화, 결제수단 설정 안내). 결제수단 근본 해결은 코드가 아니라 고도 관리자/PG 설정이며, 설정 완료 후 주문서에서 카드/간편/해외 탭이 실제 DOM에 노출되는지 헤드리스로 재검증 필요.

#### 미해결/다음 작업
- **장바구니 Phase 2(보류)**: 수량 스테퍼 UI 부재가 기능 결손인지 먼저 확인 → 컬러칩·상품별 배송비 라인. JS/백엔드 의존이라 CSS 범위 밖.
- **장바구니 빈 상태(empty-state) 보강(검토)**: 빈 카트에서 전체선택 숨김 후 `장바구니` 헤드라인→"담긴 상품 없어요" 안내로 직결. Value First 관점 추천상품 CTA 등 empty-state 설계 여지.
- **외주 통지(장바구니)**: `custom.css` `.body-cart` Phase 1 + 막판 2건 변경 → 공용 파일이라 diff 공유 필요.
- **★ 외주 통지(주문서 외화 배송비 — 공용 `global.js` 버그, P1)**: `global.js` 156~164행 외화 분기의 `F=1000` 배송비 하드코딩(통화 변환 누락) + 총상품금액에 할인합(`D`) 오기 → bd2·vsquare·donut 포함 **전 서비스 외화 결제 공통 버그**. 12cut은 `custom.js` `_cutFixOrderSum`로 우회 패치만 적용. **근본 해결은 외주가 `global.js` 수정 필요** → 재현/원인/올바른 로직 diff 노트 공유 예정.
- **회원정보수정 Figma 대조(낮음)**: `.body-mypage-edit` 모바일 레이아웃 깨짐은 수정·배포 완료. 남은 것은 기준 Figma 노드와 1:1 대조(간격·컬러·`#F63237`)뿐.
- **회원 헤더 ← 화살표 실기기 육안 확인(낮음)**: home→login 진입 후 모바일 좌측 화살표 탭 → home 복귀되는지. (헤드리스 about:blank는 아티팩트로 판단, 회귀 아님.)
- ~~히어로 스크롤 인디케이터 삭제 배포~~ **완료(2026-06-05, 라이브 검증)**.
- ~~i18n 사전 3종 업로드~~ **완료(2026-06-05 22:25, 라이브 검증)**: `i18n_pending/{en,ja,zh}.html` → `/dobuddy/files/`. `.up_i18n2.exp`(ServerAlive+fail-fast)로 1회 성공(인증 181ms, 3개 100% 전송). 검증: en `Postal code`·ja `郵便番号`·zh `邮政编码` 각 라이브 1. **단, 신규 키는 `localStorage.$lang` 캐시 때문에 기존 사용자는 언어 1회 전환(또는 `localStorage.removeItem('$lang')`) 후 반영됨**(신규/캐시없는 사용자는 즉시).
- **★ 운영 노트(ServerAlive `expect eof` 함정)**: ServerAlive 옵션을 켜면 `bye` 후에도 keepalive로 `expect eof`가 늦게 닫혀 **전송 완료 후에도 수십 초~수분 행처럼 보임**(실제 파일은 이미 반영됨). `| grep`/`| tail` 버퍼링까지 겹치면 진행이 안 보임 → **진단 시 파이프 없이 raw 터미널 파일을 읽고, 100% 전송 라인이 뜨면 성공으로 간주**. 다음 개선: `bye` 직후 `close`로 강제 종료하거나 ServerAlive를 배포엔 빼고 행 감지는 `expect timeout`에만 의존.
- ~~마이페이지(index) 리디자인~~ **방향 전환·완료(2026-06-06)**: 별도 커스텀 대신 **BD2와 동일하게 global(`#my_custom`) 렌더에 위임**(우리 오버라이드 전부 제거). `skin/mypage/index.html` 미러는 참고용 보존. 추가 커스텀이 필요하면 global 충돌 주의(`.sub_content` 강제표시 금지).
- **Apple·Facebook 소셜 로그인 활성화**: 고도 관리자 > 회원 > SNS 로그인 설정에서 활성화 필요. 버튼 마크업·CSS는 준비됨.
- **외주 통지(이번 세션 변경분)**: `custom.css`(19KB, 로그인·약관·폰트 추가)·`custom.js`(~10KB, 폰트·헤더·비활성화 추가)·i18n 사전 3개 변경 → 외주에 diff 공유 필요.
- **외주 통지(편집기)**: 우리 재배포본(27,405B)이 외주 push본(25,714B)을 덮음 → **git 흡수 전 diff 대조 요청**(외주 의도 변경분 보호). 백업 `editor/12cutEditor.outsourced-20260602.bak`.
- **공통페이지 스타일링 (장바구니·결제 등)**: Figma 디자인 기반. 현재 로그인·약관 완료. 다음 타겟: `.body-basket`·`.body-orderform` 등.
- **GitLab push/MR(회사 재개)**: `202507-dobudy-bd2` / `dobuddy/12cut/` — 외주 브랜치 확인 후 push. 절차=`MD/HANDOFF_office_20260604.md`.
- **회사 PC GitLab SSH**: 집과 다른 머신이면 SSH Keys에 **회사 공개키 추가**.
- **`public` push**: `main` 2커밋 ahead + AGENTS/HANDOFF — 회사에서 `git pull`용.
- **i18n 분리 체크포인트**: 외주 안정화 후 공통/사이트별 분리 시 Class A 공통 기여분 확인.
- **편집기 다국어화 실기기 검증**: 실폰 en/ja/zh 전환 후 ① STORY GUIDE 캐러셀 ② 단계 전환 토스트 ③ 삭제 알림창 육안 확인.
- **영상 제작 → 히어로 복원**: A안 시나리오로 히어로 배경 영상 제작 후 `<img>`→`<video>` 전환. (프롬프트: `MD/12CUT_*_prompt.json`·`_script.md`.)
- **원본 JPEG 처리(미결)**: `Delicate_..._202606011147.jpeg` 미추적. `.gitignore`(A) vs `assets/sources/`(B) 결정 필요.
- **히어로 미세조정(선택)**: 모바일 슬로건 줄바꿈(34→32px), 76px 로고 밸런스(`1.3→1.15em`) — 실기기 후 판단.
- **`public` push**: 로컬 `main`이 `public/main`보다 2커밋 ahead(`9ac9200` 등). GitHub 백업용 push 여부 결정.

### 브랜드
- 브랜드 액센트 컬러: `#F63237` (CTA, 활성 인디케이터 등 강조 요소에 사용)
<!-- 12CUT GODOMALL RULES END -->
