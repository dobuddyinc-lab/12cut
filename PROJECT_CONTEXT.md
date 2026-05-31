# 12컷 프로젝트 컨텍스트

## 1. 아키텍처 개요

```
[사용자 접속: 12cut.co.kr]
        │
        ▼
┌─────────────────────────────────────┐
│  고도몰 (Godo Mall) 플랫폼          │
│  - 도메인: 12cut.co.kr              │
│  - 스킨: moment                     │
│  - 서비스 코드명: dobuddy39          │
├─────────────────────────────────────┤
│  홈페이지 (body-index)              │
│  ┌───────────────────────────────┐  │
│  │  iframe: Cloudflare Pages     │  │
│  │  (12cut.pages.dev)            │  │
│  │  랜딩페이지 로드               │  │
│  └───────────────────────────────┘  │
├─────────────────────────────────────┤
│  상품페이지 (/goods/goods_view.php) │
│  마이페이지 (/mypage/index.php)     │
│  로그인 (/member/login.php)         │
│  → 고도몰 네이티브 페이지            │
└─────────────────────────────────────┘
```

## 2. 두버디(Dobuddy) 서비스 구조

```
/dobuddy/
├── global.js          ← 모든 서비스 공통 JS (vsquare, 12cut, donut 등)
├── global.css         ← 모든 서비스 공통 CSS
├── imgs/              ← 공통 이미지
├── Pretendard-Medium.woff
├── gothamrnd_medium.woff
│
├── vsquare/
│   ├── custom.js      ← vsquare 전용 커스텀 (참고용)
│   ├── custom.css
│   └── ...
│
├── 12cut/
│   ├── custom.js      ← 12컷 전용 커스텀
│   ├── custom.css     ← 12컷 전용 스타일 오버라이드
│   ├── logo.png       ← 12컷 로고 (280x100px, global.js가 동적 설정)
│   └── imgs/
│
└── donutframe/
    ├── custom.js
    ├── custom.css
    └── ...
```

**핵심 원칙:** `global.js/css`는 공유 자산이므로 절대 12컷만을 위해 수정하면 안 됨. 서비스별 커스텀은 반드시 `/dobuddy/12cut/custom.js|css`에서 처리.

## 3. 고도몰 스킨 파일 구조

```
/data/skin/front/moment/
├── outline/
│   ├── header/
│   │   └── standard.html    ← 헤더 HTML (로고 <img class="bd2-logo">)
│   └── _header.html         ← <head> 영역 (스크립트/메타 로드)
├── css/
│   └── layout/
│       └── layout.css       ← 기본 레이아웃 (header_top_cont: 1200px)
└── ...
```

## 4. CSS 캐스케이드 (로고 관련)

```
layout.css (기본)
  └─ .header_top_cont { width:1200px; margin:0 auto }

global.css (공통 오버라이드)
  ├─ --mw: 1360px
  ├─ .header_top_cont { width:min(100vw-60px, 1280px); margin:0 auto }
  ├─ #header .header_top { height:120px }
  ├─ .bd2-logo { height:48px; margin:26px 0 0 0 }
  ├─ .bd2-logo { margin-top:10px }  ← "항상 좁은모양" 오버라이드
  │
  └─ @media (max-width:850px)
       ├─ #header .header_top { height:90px }
       ├─ .bd2-logo { height:39px; margin:9px 0 0 -15px }
       └─ .stick .bd2-logo { margin-top:9px }

custom.css (12컷 전용, 최종 우선)
  ├─ .bd2-logo { filter:brightness(0); height:34px; margin-top:1.3em }
  │
  ├─ @media (max-width:850px)
  │    ├─ #header .header_top { height:56px }
  │    └─ .stick .bd2-logo { margin-top:1.35em }
  │
  └─ @media (min-width:851px)
       └─ .stick .bd2-logo { margin-top:6.2em }
```

**최종 로고 위치 (모바일 ≤850px):**
- 수평: header_top_cont margin(30px) + logo margin-left(-15px) = **15px from viewport**
- 수직: margin-top 1.3em ≈ **20.8px from header top**

**최종 로고 위치 (데스크톱 >850px):**
- 수평: header_top_cont margin (vw<1340: 30px / vw≥1340: (vw-1280)/2)
- 수직: margin-top 1.3em ≈ 20.8px

## 5. 랜딩페이지 (Cloudflare Pages)

- **레포:** https://github.com/dobuddyinc-lab/12cut.git
- **배포:** main 브랜치 push → Cloudflare Pages 자동 빌드 (1-2분)
- **도메인:** 12cut.pages.dev (iframe으로 12cut.co.kr 홈에서 로드)

### 주요 파일
| 파일 | 역할 |
|------|------|
| `index.html` | 메인 랜딩 HTML |
| `style.css` | 전체 스타일 |
| `script.js` | 인터랙션 로직 |
| `assets/images/` | 이미지 (WebP) |
| `assets/videos/hero-bg.mp4` | 히어로 비디오 (faststart, no audio) |
| `_headers` | Cloudflare Cache-Control 설정 |

### Nav 로고 위치 (상품페이지와 동일하게 맞춤)
```css
.nav { padding: 0 max(30px, calc((100vw - 1280px) / 2)); }
@media (max-width: 850px) { .nav { padding: 0 15px; } }
.nav__logo { align-self: flex-start; margin-top: 1.3em; }
.nav__logo-img { height: 34px; }
```

## 6. SFTP 접속 정보

```
호스트: gdadmin-dobuddy39.godomall.com
포트: 17662
계정: dobudd0438
비번: donut583015

접속 명령어:
sshpass -p 'donut583015' sftp -P 17662 \
  -o HostKeyAlgorithms=+ssh-rsa \
  -o PubkeyAcceptedAlgorithms=+ssh-rsa \
  -o StrictHostKeyChecking=no \
  dobudd0438@gdadmin-dobuddy39.godomall.com
```

## 7. CDN 캐싱

- 고도몰 정적 파일: NHN Commerce CDN (`browndust2-goods.com`)
- 캐시 TTL: `max-age=3600` (최대 1시간)
- 캐시 우회: 쿼리스트링 `?v=timestamp` 또는 브라우저 캐시 삭제

## 8. global.js 로고 동작

`global.js`는 페이지 로드 시 `.bd2-logo` img 태그의 `src`를 동적으로 설정:
```
/dobuddy/12cut/logo.png
```
따라서 `standard.html`에서 inline SVG나 다른 src를 직접 넣어도 global.js가 덮어씀. 로고 변경은 반드시 `/dobuddy/12cut/logo.png` 파일 교체로 처리해야 함.

## 9. 상품페이지 CTA 링크

- 히어로 섹션 + 프라이싱 섹션 "Make Your Story" 버튼
- 이동 대상: `https://12cut.co.kr/goods/goods_view.php?goodsNo=1000000000`

## 10. custom.js 주요 기능 (12컷)

- 홈페이지(`body-index`)에서 Cloudflare Pages 랜딩페이지를 iframe으로 로드
- `#header_warp`를 sticky + top:-55px로 설정하여 고도몰 헤더를 거의 숨김
- 페이지별 커스텀 로직 (상품 상세, 마이페이지 등)

## 11. 완료된 작업 이력

| 작업 | 상태 |
|------|------|
| 이미지 WebP 변환 | ✅ |
| 비디오 Safari 호환 (faststart, no audio) | ✅ |
| 폰트 로딩 최적화 (Pretendard 우선, CJK 동적) | ✅ |
| CTA 링크 → 상품페이지 연결 | ✅ |
| 로고 PNG 고해상도 교체 (280x100) | ✅ |
| 랜딩페이지 nav 로고 위치 → 상품페이지 동일화 | ✅ |
| MY 텍스트 제거 (custom.js) | ✅ |
| nav max-width 1280px 통일 | ✅ |
| 로고 클릭 → smooth scroll to top | ✅ |
| _header.html preconnect/dns-prefetch 추가 | ✅ |
| _header.html defer 원복 (mypage 이슈) | ✅ |

## 12. 주의사항

1. `_header.html`의 script에 `defer` 넣지 말 것 → 마이페이지/로그인 폼 깨짐
2. `global.js/css` 수정 금지 → vsquare, donut 등 다른 서비스 영향
3. 고도몰 CDN 캐시 최대 1시간 → 긴급 변경 시 파일명 변경 또는 쿼리스트링
4. Safari 비디오: MOOV atom 앞에 위치 필수, 오디오 트랙 제거 필수
5. 로고 변경은 `/dobuddy/12cut/logo.png` 교체 (global.js가 동적 주입)
