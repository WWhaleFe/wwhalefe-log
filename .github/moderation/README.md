# 댓글 자동 검열

블로그 댓글은 [giscus](https://giscus.app)로 이 저장소의 Discussions 「Comments」 카테고리에 저장된다.
댓글이 새로 달리거나 수정될 때마다 `.github/workflows/comment-moderation.yml` 이 `moderate.mjs` 를 실행해 `rules.json` 규칙으로 검사한다.

## 판정과 조치

| 분류 | 기준 | 기본 조치 |
|------|------|-----------|
| `blockedUser` | `blockedUsers` 에 있는 사용자 | 삭제 |
| `spam` | 외부 링크가 `maxLinks` 보다 많음, 또는 `spam.patterns` 정규식에 걸림 | 삭제 + 작성자 차단 |
| `abuse` | `abuse.words` 금칙어 (띄어쓰기·숫자·기호로 쪼갠 것도 잡음) | 삭제 |

- 조치는 `actions` 에서 바꾼다. `delete`(삭제) · `minimize`(숨김, 되돌릴 수 있음) · `block`(작성자 차단).
- 저장소 주인·협업자의 댓글은 검사하지 않는다. 믿을 만한 사용자는 `allowUsers` 에 넣는다.
- 오탐이 나는 표현은 `abuse.allowPhrases` 에 넣는다(예: 시발점).
- 처음 규칙을 크게 바꿀 때는 `dryRun: true` 로 두면 판정만 기록하고 조치는 하지 않는다.
- 실행 기록(Actions 요약)에는 글·작성자·근거만 남기고 댓글 본문은 남기지 않는다. 공개 저장소라 기록도 공개된다.

규칙 시험(로컬, API 호출 없음):

```bash
node .github/moderation/moderate.mjs --test "카 지 노 홍보합니다"
```

## 작성자 차단 켜기 (선택)

`block` 은 GitHub 계정 단위 차단이라 워크플로 기본 토큰으로는 할 수 없다.
fine-grained 개인 토큰을 만들고 Account permissions → **Block another user: Read and write** 만 준 뒤,
저장소 Secret `MODERATION_TOKEN` 으로 등록한다. 없으면 차단 단계는 건너뛰고 삭제만 한다.

## AI 판정 켜기 (선택)

규칙에 걸리지 않은 댓글을 Claude(`ai.model`, 기본 `claude-haiku-5-5`)가 한 번 더 판정한다.

1. 저장소 Secret `ANTHROPIC_API_KEY` 등록
2. `rules.json` 의 `ai.enabled` 를 `true` 로 바꿔 main 에 푸시

AI 호출이 실패하면 댓글은 그대로 둔다. 애매하면 통과시키도록 지시해 두었다.

## 수동으로 지우기·재검사

- 지우기: 블로그 관리 폴더에서 `./blog.py comments` 로 목록을 보고 `./blog.py comments rm <id>`.
  GitHub Discussions 화면에서 직접 지워도 된다.
- 재검사: Actions → Comment moderation → Run workflow 에 댓글 id(`DC_…`)를 넣는다. 수동 실행은 주인 댓글도 검사한다.
