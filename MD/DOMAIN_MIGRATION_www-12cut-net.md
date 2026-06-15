# 공식 도메인 전환 계획 — `12cut.co.kr` → `www.12cut.net`

작성: 2026-06-12 / 결정 사항: **대표(canonical) = `www.12cut.net`**, **`12cut.co.kr`은 301 리다이렉트로 존치(SEO 자산 이전)**.

> 핵심 전제: "공식 도메인"의 실제 제어 지점은 **이 레포가 아니라 ① DNS ② 고도몰 관리자 ③ SSL ④ 검색엔진**이다.
> 코드 레포는 도메인을 가리키는 **하드코딩 참조**만 보유 → 인프라 전환이 먼저, 코드 치환은 마지막.

---

## 0. AS-IS vs TO-BE

| 구분 | AS-IS | TO-BE |
|------|-------|-------|
| 대표 도메인 | `12cut.co.kr` (고도몰 G5, mall_id `1142341`) | `www.12cut.net` |
| 구 도메인 | — | `12cut.co.kr` → `www.12cut.net` **301** |
| 미디어/API | `img.12cut.net` (nginx, 별도 서브) | **변경 없음**(영향 0, 같은 zone) |
| 코드 참조 | 절대 URL `https://12cut.co.kr/...` 다수 | **상대경로 전환**(도메인 비종속) 권장 |
| pages.dev | `12cut.co.kr`로 301 | (폐기 예정, 일관성만 정리) |

---

## 1. Phase 0 — 사전 확보 (Blocker, 코드 밖)

전환 시작 전 반드시 확정해야 진행 가능. **이 항목들은 코드로 해결 불가.**

1. **`12cut.net` DNS 관리 위치 확인** — `img.12cut.net`이 이미 떠 있으므로 zone은 어딘가(Cloudflare/가비아/회사 DNS)에서 관리 중. `www` 레코드를 추가할 권한·콘솔 확보.
2. **고도몰 관리자 접근** — 대표 도메인 변경 권한 계정(URL/ID/PW/2FA).
3. **NHN Commerce 외부 도메인 연결 정책 확인** — G5는 도메인 연결 + SSL 무료 발급 지원. 연결 도메인 수 제한·요금 여부 확인.
4. **이메일 영향 확인** — `@12cut.co.kr` 메일 사용 중이면 MX는 별개 이슈(도메인 전환과 분리 관리).
5. **SEO 영향 합의** — `.co.kr`→`.net` 대표 전환은 어소리티 리셋·순위 회복 수주~수개월 소요. 합의됨(301 존치로 완화).

---

## 2. Phase 1 — DNS + 고도몰 도메인 연결 (인프라)

> 순서 중요: **고도몰에 도메인 등록 → 고도몰이 안내하는 CNAME 타겟 확인 → DNS 등록**. 임의 CNAME(예: `gdadmin-*.godomall.com`) 직접 연결은 NHN Commerce가 거부할 수 있음.

1. 고도몰 관리자 → **도메인 설정**(G5 기준 대략 `상점관리/기본설정 > 도메인`, 버전에 따라 메뉴명 상이 → 관리자에서 "도메인" 검색)에서 `www.12cut.net` **추가 등록**.
2. 고도몰이 안내하는 **연결 방식(CNAME 타겟 또는 A 레코드 IP)** 확보.
3. `12cut.net` DNS에 `www` 레코드 추가(고도몰 안내값).
4. **SSL 발급** — 고도몰 자동 발급(Let's Encrypt) 트리거. 발급 완료까지 대기(수십 분~수시간).
5. **연결 검증**: `https://www.12cut.net/` 접속 시 고도몰 사이트가 정상 렌더되는지 확인.

```bash
# DNS 전파 확인
dig www.12cut.net +short
curl -sI "https://www.12cut.net/?z=$RANDOM" | head -n 5
```

---

## 3. Phase 2 — 대표 도메인 전환 + 301

1. 고도몰 관리자에서 **대표 도메인 = `www.12cut.net`** 으로 변경.
2. `12cut.co.kr` 연결은 **삭제하지 말고 존치** → 고도몰은 대표 도메인 외 연결 도메인을 **대표로 자동 301**(canonical 통합) 처리. 이 동작 여부를 응답 헤더로 검증.
3. 양방향 검증:

```bash
# 구 도메인 → 신 도메인 301 확인
curl -sI "https://12cut.co.kr/?z=$RANDOM" | grep -iE "HTTP/|location"
# 기대: 301 + location: https://www.12cut.net/
```

> ⚠️ 고도몰이 자동 301을 안 해주면(연결 도메인을 그대로 200 서빙) **중복 콘텐츠(SEO 패널티)** 발생 → 이 경우 고도몰 측 리다이렉트 옵션 또는 별도 처리 필요. 헤더로 반드시 확인.

---

## 4. Phase 3 — 코드/스킨 참조 치환 (이 레포 + SFTP)

> **TO-BE 핵심: 절대 URL → 상대경로 전환.** 같은 고도몰 내부 이동이므로 `https://12cut.co.kr/goods/...` → `/goods/...` 로 바꾸면 도메인 비종속 → 앞으로 도메인이 또 바뀌어도 코드 무수정. (자동 301에도 의존하지 않아 리다이렉트 1홉 절약.)

### 4.1 라이브 배포 대상(SFTP, 신중)

| 파일 | 라인 | AS-IS | TO-BE(권장) | 배포 경로 |
|------|------|-------|------|-----------|
| `skin/main/index.html` | 91 | `https://12cut.co.kr/goods/goods_view.php?goodsNo=1000000000` (hero CTA) | `/goods/goods_view.php?goodsNo=1000000000` | `/data/skin/front/moment/main/index.html` |
| `skin/main/index.html` | 400 | 동일(pricing CTA) | 동일 상대경로 | 〃 |
| `skin/main/index.html` | og:url/canonical | (있으면) `https://12cut.co.kr/` | `https://www.12cut.net/` (OG·canonical은 **절대 URL 유지**) | 〃 |
| `custom.css` | 197 | `url(https://12cut.co.kr/dobuddy/imgs/sns_google.png)` | `url(/dobuddy/imgs/sns_google.png)` | `/dobuddy/12cut/custom.css` |

> 공용 파일(`custom.css`) 배포 전 **라이브 pull→diff**로 외주 변경분 보존(AGENTS 규칙). 배포는 `.deploy.exp` 사용.

### 4.2 레포/레퍼런스(SFTP 불필요, 일관성)

| 파일 | 라인 | 처리 |
|------|------|------|
| `index.html`(루트, 레퍼런스) | 184, 493 | CTA 상대경로화 + OG 절대 URL은 `.net`로 |
| `_redirects` | 4 | catch-all 타겟 `https://12cut.co.kr/` → `https://www.12cut.net/` (pages.dev 폐기 예정이나 일관성) |
| `sitemap.xml` / `robots.txt` | 전체 | 도메인을 `www.12cut.net`으로 갱신 후 검색엔진 재제출 |
| `README.md` / `PROJECT_CONTEXT.md` / `AGENTS.md` | 도메인 서술 | 라이브 기준으로 갱신 |

### 4.3 OG/canonical 원칙
- **CTA·내부 링크 = 상대경로**(도메인 비종속).
- **og:url·canonical·sitemap = 절대 URL(`https://www.12cut.net/...`)** — 크롤러는 절대 URL 요구.

---

## 5. Phase 4 — SEO / 외부 채널

1. **Google Search Console**: `www.12cut.net` 속성 추가 → 소유확인 → **주소 변경 도구(Change of Address)** 로 `12cut.co.kr`에서 이전 신고(301 선행 필수).
2. **네이버 서치어드바이저**: `www.12cut.net` 사이트 등록 + 소유확인 + 사이트맵 제출. (네이버는 GSC식 주소변경 도구 부재 → 신규 등록 + 구 도메인 301 유지로 자연 이전.)
3. **sitemap.xml / robots.txt** 신 도메인으로 갱신·재제출.
4. **OG 캐시 강제 갱신**: 카카오(개발자 디버거)·페이스북 Sharing Debugger로 신 도메인 스크랩.
5. **외부 표기 일괄 변경**: SNS 프로필, 명함, 패키지, **전시 QR/스토리보드**(`MD/12CUT_exhibition_rolling_video_storyboard.md`의 `https://12cut.co.kr/` → `www.12cut.net`), 광고 소재.
6. **통계/분석 도메인 설정**: 고도몰 통계(`gd_visit`)·GA·네이버 애널리틱스의 도메인/필터 갱신.

---

## 6. Phase 5 — 최종 검증 체크리스트

- [ ] `https://www.12cut.net/` 200 + 정상 렌더(홈·상품·로그인·장바구니·편집기)
- [ ] `https://12cut.co.kr/...` → `https://www.12cut.net/...` **301**(경로 보존)
- [ ] `https://12cut.net/`(apex) 처리 정책 확정(www로 301 권장)
- [ ] SSL 정상(인증서 CN/SAN에 `www.12cut.net`)
- [ ] CTA 클릭 시 신 도메인으로 이동(리다이렉트 1홉 없이)
- [ ] OG 미리보기(카카오/슬랙) 신 도메인·이미지 정상
- [ ] `img.12cut.net` 영향 0 확인(상품 이미지·영상·주문추적 API)
- [ ] GSC 주소변경 신고 완료 / 네이버 신규 등록 완료
- [ ] 결제·로그인 콜백 URL(소셜 로그인 redirect_uri)에 신 도메인 등록 — **소셜 OAuth 콘솔 확인 필수**

> ⚠️ **소셜 로그인 함정**: 카카오/네이버/구글/페이스북 OAuth 앱의 **허용 redirect URI**에 `www.12cut.net`이 없으면 로그인 실패. Phase 1~2와 함께 각 콘솔에 신 도메인 추가 필요.

---

## 7. 리스크 & 롤백

| 리스크 | 영향 | 완화 |
|--------|------|------|
| SEO 어소리티 리셋 | 순위 일시 하락 | `12cut.co.kr` 301 **영구 존치** + GSC 주소변경 |
| 자동 301 미작동 | 중복 콘텐츠 | Phase 2 헤더 검증, 미작동 시 고도몰 옵션/별도 처리 |
| 소셜 OAuth redirect 누락 | 로그인 전면 실패 | 각 콘솔 신 도메인 사전 등록 |
| apex `12cut.net` 충돌 | 미디어 서버와 혼선 | apex는 www로 301, `img.` 서브는 불변 |
| 이메일 MX | 메일 장애 | 도메인 전환과 분리, MX 불변 확인 |

**롤백**: 고도몰 대표 도메인을 `12cut.co.kr`로 되돌리면 즉시 원복(연결 도메인 유지 시). 코드 치환은 상대경로라 도메인 무관 → 롤백 불필요.

---

## 8. 실행 순서 요약

```
Phase 0 (확보) → Phase 1 (DNS+고도몰 연결) → Phase 2 (대표 전환+301 검증)
   → Phase 3 (코드 상대경로화·OG, SFTP 배포) → Phase 4 (SEO·외부채널) → Phase 5 (검증)
```

- **코드(이 레포)에서 내가 즉시 가능**: Phase 3 전체(상대경로 치환·OG·문서) — 단 라이브 배포는 Phase 1~2 인프라 완료 후가 안전.
- **사람이 해야 함**: Phase 0·1·2·4의 DNS/고도몰/검색엔진/OAuth 콘솔 작업.
