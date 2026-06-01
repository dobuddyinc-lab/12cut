# skin/ — 고도몰 스킨(moment) 원본 미러

12cut.co.kr(실 운영)의 고도몰 스킨 `moment` 파일을 **버전관리하기 위한 미러**.
서버 경로 `/data/skin/front/moment/` 하위를 그대로 반영한다.

| 레포 경로 | 서버 경로 (SFTP) | 설명 |
|-----------|------------------|------|
| `skin/main/index.html` | `/data/skin/front/moment/main/index.html` | **운영 홈**(랜딩 네이티브 이식, 고도 토큰 `{*** ***}` 포함) |
| `skin/css/custom.css` | `/data/skin/front/moment/css/custom.css` | 스킨 custom.css(현재 스텁/주석만, 실제 오버라이드는 `/dobuddy/12cut/custom.css`) |

## 받기/올리기 (SFTP)
- 받기: `expect .skin_get.exp` (→ `._skin.html`) 또는 루트 SFTP 스크립트 참고.
- **인증 주의**: 반드시 **패스워드 인증 강제** 옵션 필요(`-o PubkeyAuthentication=no -o PreferredAuthentications=password`). 안 그러면 공개키 선시도가 거부돼 `Permission denied`. 자세한 내용은 `AGENTS.md`의 SFTP 섹션 참고.

## 주의
- 이 파일들은 **서버가 source-of-truth**. 편집 후 SFTP로 올려야 라이브 반영됨.
- 라이브가 외주에 의해 바뀌면 이 미러는 stale → 변경 회신 수신 시 다시 받아 동기화할 것.
