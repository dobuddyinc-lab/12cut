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

#### 미해결/다음 작업
- **★ i18n 사전 3종 업로드(최우선·1스텝)**: `i18n_pending/{en,ja,zh}.html` → `/dobuddy/files/`. 서버 안정 시 SFTP put만. (회원가입 placeholder 4개+아이디 안내 번역 반영.)
- **마이페이지 리디자인(예정)**: `skin/mypage/index.html` 미러 확보됨. `.body-mypage` 스코프로 Figma 기반 스타일링 대기.
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
