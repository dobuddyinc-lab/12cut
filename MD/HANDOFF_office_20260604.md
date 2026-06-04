# 회사 작업 핸드오프 (2026-06-04)

집 세션에서 완료한 **로그인·약관 리디자인**, **전 페이지 폰트**, **GitLab 연동** 정리.  
회사 PC에서 이어서 작업할 때 이 문서 + `AGENTS.md`를 먼저 읽을 것.

---

## 1. 한 줄 요약

| 항목 | 내용 |
|------|------|
| **라이브 반영** | SFTP → `12cut.co.kr` **이미 배포됨** (`custom.js`·`custom.css`·i18n 사전) |
| **Git SSOT** | **`202507-dobudy-bd2`** → 경로 **`dobuddy/12cut/`** |
| **잘못된 repo** | `202503-dobudy-12cut` — `custom.js` 없음, push 금지 |
| **로컬 커밋** | `9ac9200` (main, **public에 push 안 함**) |
| **GitLab push** | **미실행** — 외주 브랜치/MR 합의 후 |

---

## 2. GitLab — 반드시 숙지

### 2.1 두 repo 구분

| GitLab 프로젝트 | Clone URL | 용도 |
|-----------------|-----------|------|
| **`202507-dobudy-bd2`** ✅ | `git@gitlab.com:keepcool.kr/202507-dobudy-bd2.git` | **통합 SSOT**. `dobuddy/12cut/`, `dobuddy/bd2/`, `global.js` 등 |
| ~~`202503-dobudy-12cut`~~ ❌ | `git@gitlab.com:keepcool.kr/202503-dobudy-12cut.git` | 구 스냅샷. `12cut_editor/`만 있고 **`custom.js` 없음** |

### 2.2 12cut 파일 경로 (SFTP = GitLab)

| 라이브 (SFTP) | GitLab (`202507` / `main`) | 로컬 레포 (루트) |
|---------------|---------------------------|------------------|
| `/dobuddy/12cut/custom.js` | `dobuddy/12cut/custom.js` | `custom.js` |
| `/dobuddy/12cut/custom.css` | `dobuddy/12cut/custom.css` | `custom.css` |
| `/dobuddy/12cut/12cutEditor.html` | `dobuddy/12cut/12cutEditor.html` | `editor/12cutEditor.html` |
| `/dobuddy/files/{en,ja,zh}.html` | `dobuddy/files/` (통합 repo) | (서버에서 SFTP get) |

**공용 금지**: `dobuddy/global.js`, `dobuddy/global.css` — 읽기만, 12cut은 `custom.*`로 오버라이드.

### 2.3 GitLab vs 로컬 크기 (2026-06-04 fetch 기준)

| 파일 | GitLab `main` | 로컬·라이브 |
|------|---------------|-------------|
| `custom.js` | 7,579B | **9,910B** |
| `custom.css` | 2,253B | **19,763B** |
| `12cutEditor.html` | 26,859B | **27,405B** |

→ 로컬/SFTP가 GitLab보다 **앞섬**. push 시 외주본 덮어쓰기 인지 필요.

---

## 3. 회사 PC 셋업 (처음 한 번)

### 3.1 코드 가져오기 (택 1)

**A) 외장/동기화 드라이브 (집과 동일)**  
경로 예: `/Volumes/jw/vibecording/12cut` — 그대로 열면 됨.

**B) GitHub `public` (권장·드라이브 없을 때)**

```bash
git clone https://github.com/dobuddyinc-lab/12cut.git
cd 12cut
git pull   # main에 9ac9200 등이 push된 후
```

집에서 먼저: `git push public main` (아직 안 했으면).

**C) GitLab 통합 repo만 clone**

```bash
git clone git@gitlab.com:keepcool.kr/202507-dobudy-bd2.git
cd 202507-dobudy-bd2
# 12cut만 작업 시: dobuddy/12cut/ 만 편집
```

### 3.2 Git remote (로컬 12cut 레포 기준)

```bash
cd <12cut 레포 루트>

git remote add public https://github.com/dobuddyinc-lab/12cut.git 2>/dev/null || true
git remote add gitlab-bd2 git@gitlab.com:keepcool.kr/202507-dobudy-bd2.git 2>/dev/null || true
# 레거시(사용 안 함): gitlab → 202503-dobudy-12cut

git remote -v
git fetch gitlab-bd2
git fetch public
```

### 3.3 SSH 키 (GitLab)

- 집 Mac에 `~/.ssh/id_ed25519` 등록 완료 → 계정 **`@smiletube9`**
- **회사 Mac**: GitLab → Preferences → SSH Keys → **회사 PC 공개키 추가** (`cat ~/.ssh/id_ed25519.pub`)
- 확인: `ssh -T git@gitlab.com` → `Welcome to GitLab, @smiletube9!`

회사에서 **같은 키 파일**을 쓰려면 드라이브/1Password로 `id_ed25519` 이전 (보안 주의).

### 3.4 SFTP (라이브 배포)

| 항목 | 값 |
|------|-----|
| 호스트 | `gdadmin-dobuddy39.godomall.com` |
| 포트 | **17662** |
| 계정 | `dobudd0438` |
| 업로드 | `/dobuddy/12cut/custom.css`, `custom.js`, `/dobuddy/files/*.html`, 스킨은 `/data/skin/front/moment/...` |

비밀번호·expect 스크립트: `AGENTS.md` SFTP 절. **`sshpass` 이 Mac에서 실패** → `expect` 사용.

---

## 4. 이번 세션 완료 작업 (라이브 반영됨)

- 로그인 `.body-login`: 소셜 퍼스트, lumi 영상, ID 토글
- 약관 `.body-join-agreement`: Figma 리스트형, 아코디언, 다음단계 비활성, 경고 스타일
- 헤더 ← : 로그인→`/`, 약관→`/member/login.php`
- 폰트: Pretendard Variable + en/ja/zh 디스플레이 (`@import` + `body.*` + `font-family:inherit`)
- i18n: 약관 헤드라인·전체동의 키 en/ja/zh
- 푸터: `arrow.svg`(404)·`foot_sns.png` 숨김

검증 URL:

- https://12cut.co.kr/member/login.php
- https://12cut.co.kr/member/join_agreement.php?memberFl=personal

---

## 5. 회사에서 할 다음 일 (우선순위)

1. **외주 확인** (카톡/메일 한 줄)  
   - push 대상: `202507-dobudy-bd2` / `dobuddy/12cut/`  
   - `main` 직접 vs `feature/12cut-auth` + MR?

2. **GitLab push** (합의 후) — 예시 workflow

```bash
# 통합 repo를 worktree로 쓸 때 (개념)
git fetch gitlab-bd2
git checkout -b feature/12cut-auth gitlab-bd2/main

# 로컬 12cut 루트 파일을 dobuddy/12cut/에 맞춰 복사 후 커밋
# cp custom.js custom.css → (bd2 clone 내) dobuddy/12cut/
# editor/12cutEditor.html → dobuddy/12cut/12cutEditor.html

git add dobuddy/12cut/custom.js dobuddy/12cut/custom.css dobuddy/12cut/12cutEditor.html
git commit -m "feat(12cut): 로그인·약관·전페이지 폰트"
git push gitlab-bd2 feature/12cut-auth
# GitLab UI에서 MR → main
```

3. **`public` push** (우리 GitHub 백업)

```bash
git add AGENTS.md MD/HANDOFF_office_20260604.md
git commit -m "docs: GitLab SSOT·회사 핸드오프"
git push public main
```

4. **미완**  
   - Apple·Facebook 소셜: 고도 관리자 활성화  
   - 장바구니·결제 `.body-basket` 스타일  
   - 외주 diff 통지 (`custom.js`·`custom.css`·i18n)

---

## 6. 집 Mac 기준 git 상태 (2026-06-04)

```
branch: main (public/main ahead 2)
commit: 9ac9200 feat: 로그인·약관 리디자인 + 전 페이지 언어별 폰트 시스템
uncommitted: AGENTS.md (GitLab 섹션 갱신), 이 HANDOFF 파일
remotes: public, gitlab (202503 레거시), gitlab-bd2 (202507 ✅)
```

---

## 7. 함정 체크리스트

- [ ] `202503-dobudy-12cut`에 push 하지 않았는가?
- [ ] `global.js` / `global.css` 수정하지 않았는가?
- [ ] GitLab push 전 외주 MR 규칙 확인했는가?
- [ ] 라이브 검증은 SFTP 후 `curl ?z=$RANDOM` 또는 실폰?
- [ ] i18n 사전 변경 후 `localStorage.$lang` 캐시(언어 1회 전환)?

---

## 8. 참고 문서

- `AGENTS.md` — 고도몰 규칙·SFTP·캐시·세션 기록 전체
- `MD/HANDOFF_i18n_editor.md` — 편집기·사전 공유 구조
