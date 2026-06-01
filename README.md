# 12CUT

12CUT 제품 랜딩 정적 페이지. Cloudflare Pages + GitHub 저장소 배포 모델.

## 스택

- HTML · CSS · JavaScript (빌드 도구 없음)

## 진입점

| 경로 | 설명 |
|------|------|
| `index.html` | 마케팅 랜딩 |
| `domain-report.html` | 도메인 전략 리포트(내부용, 검색 차단 헤더) |
| [`MD/CONTEXT.md`](./MD/CONTEXT.md) | 디자인·배포·협업 통합 레퍼런스 |

## 배포

- **Production(실 운영)**: [12cut.co.kr](https://12cut.co.kr) — 고도몰 스킨(`moment`)에 랜딩을 네이티브 이식한 홈. 자세한 구조는 `AGENTS.md` 참고.
- **`12cut.pages.dev`(폐기)**: 과거 standalone 랜딩(루트 `index.html`)을 서빙하던 Cloudflare Pages. 단일소스 전환 후 **co.kr로 301 리다이렉트**(`_redirects`). 루트 `index.html`은 스킨 이식 원본/레퍼런스로만 보관.
- **내부 리포트 URL**: `/domain-report.html` (pages.dev에서 유지, `_redirects` catch-all 제외)

## 로컬 미리보기

[Wrangler 설치](https://developers.cloudflare.com/workers/wrangler/install-and-update/) 후 저장소 루트에서:

```bash
wrangler pages dev .
```

설정은 `wrangler.toml` (`pages_build_output_dir = "."`).

## 에이전트

리포트 루트의 `AGENTS.md` 참고(MCP/외부 도구용 가이드).
