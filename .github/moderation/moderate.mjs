// 블로그 댓글(giscus → GitHub Discussions) 자동 검열.
// comment-moderation.yml 이 새 댓글·수정된 댓글마다 실행한다.
//
//   node moderate.mjs                 워크플로 이벤트(GITHUB_EVENT_PATH)를 검사
//   node moderate.mjs --test "문장"    규칙 판정만 출력 (API 호출 없음)
//
// 환경변수
//   GITHUB_TOKEN       댓글 삭제·숨김 (워크플로 기본 토큰, discussions: write)
//   MODERATION_TOKEN   (선택) 작성자 차단용 개인 토큰. 없으면 차단은 건너뛴다
//   ANTHROPIC_API_KEY  (선택) rules.json 의 ai.enabled \uac00 true 일 때 AI 판정에 쓴다

import { readFileSync, appendFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const rules = JSON.parse(readFileSync(join(here, "rules.json"), "utf8"))

// ---------- 판정 ----------

const ZERO_WIDTH = /[\u200b-\u200f\u2060\ufeff]/g

// NFKC 는 'ㅅ' 같은 호환 자모를 조합용 자모로 바꿔 버려서 쓰지 않는다. 전각 영숫자만 반각으로 접는다
const normalize = (text) =>
  text
    .normalize("NFC")
    .replace(/[\uff01-\uff5e]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0xfee0))
    .replace(ZERO_WIDTH, "")
    .toLowerCase()

// "씨1발", "ㅅ.ㅂ" 같은 우회를 잡으려고 한글·영문만 남긴다
const lettersOnly = (text) => text.replace(/[^a-z\uac00-\ud7a3\u3131-\u318e]/g, "")

// 단어를 통째로 붙이면 "질병 신고"\uac00 "병신"이 되므로, 한 글자씩 띄운 구간("병 신", "카 지 노")만 붙인다
const tokens = (text, clean = (t) => t) => {
  const out = []
  let run = ""
  for (const t of text.split(/\s+/).map(clean).filter(Boolean)) {
    if ([...t].length === 1) {
      run += t
      continue
    }
    if (run) out.push(run)
    run = ""
    out.push(t)
  }
  if (run) out.push(run)
  return out
}

const countLinks = (text, allowDomains) => {
  const urls = text.match(/(https?:\/\/|www\.)[^\s)\]]+/g) ?? []
  return urls.filter((url) => {
    const host = url.replace(/^https?:\/\//, "").split(/[/?#]/)[0]
    return !allowDomains.some((d) => host === d || host.endsWith(`.${d}`))
  }).length
}

export function checkByRules(body, login = "") {
  if (rules.blockedUsers.map((u) => u.toLowerCase()).includes(login.toLowerCase())) {
    return { category: "blockedUser", rule: "차단 목록의 사용자" }
  }

  const text = normalize(body)
  const joined = tokens(text).join(" ")

  const links = countLinks(text, rules.spam.allowDomains ?? [])
  if (links > rules.spam.maxLinks) {
    return { category: "spam", rule: `외부 링크 ${links}개` }
  }
  for (const pattern of rules.spam.patterns) {
    const re = new RegExp(pattern, "i")
    if (re.test(text) || re.test(joined)) {
      return { category: "spam", rule: `광고 패턴 /${pattern}/` }
    }
  }

  const allow = rules.abuse.allowPhrases.map((p) => lettersOnly(normalize(p)))
  const words = tokens(text, lettersOnly).map((t) =>
    allow.reduce((acc, p) => acc.split(p).join(""), t)
  )
  for (const word of rules.abuse.words) {
    const needle = lettersOnly(normalize(word))
    if (needle && words.some((w) => w.includes(needle))) {
      return { category: "abuse", rule: "금칙어" }
    }
  }
  return null
}

async function checkByAI(body) {
  if (!rules.ai?.enabled || !process.env.ANTHROPIC_API_KEY) return null
  // AI 판정을 켰을 때만 워크플로\uac00 SDK 를 설치한다
  const { default: Anthropic } = await import("@anthropic-ai/sdk")
  const client = new Anthropic()
  const response = await client.messages.create({
    model: rules.ai.model,
    max_tokens: 1024,
    output_config: {
      effort: "low",
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            verdict: { type: "string", enum: ["ok", "spam", "abuse"] },
            reason: { type: "string" },
          },
          required: ["verdict", "reason"],
          additionalProperties: false,
        },
      },
    },
    system:
      "You moderate comments on a Korean IT infrastructure blog. " +
      "spam = advertising, gambling, adult, loans, scams, or contact-solicitation. " +
      "abuse = insults, harassment, hate, or profanity aimed at people. " +
      "Criticism of a post, disagreement, bug reports, and casual language are ok. " +
      "When unsure, answer ok. Write reason in Korean, under 60 characters.",
    messages: [{ role: "user", content: `<comment>\n${body}\n</comment>` }],
  })
  if (response.stop_reason === "refusal") return null
  const text = response.content.find((b) => b.type === "text")?.text
  if (!text) return null
  const { verdict, reason } = JSON.parse(text)
  return verdict === "ok" ? null : { category: verdict, rule: `AI: ${reason}` }
}

// ---------- GitHub ----------

async function graphql(query, variables, token = process.env.GITHUB_TOKEN) {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { authorization: `bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
  })
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data
}

const ACTIONS = {
  delete: (c) =>
    graphql(
      "mutation($id:ID!){deleteDiscussionComment(input:{id:$id}){comment{id}}}",
      { id: c.id }
    ),
  minimize: (c, verdict) =>
    graphql(
      "mutation($id:ID!,$why:ReportedContentClassifiers!){minimizeComment(input:{subjectId:$id,classifier:$why}){minimizedComment{isMinimized}}}",
      { id: c.id, why: verdict.category === "spam" ? "SPAM" : "ABUSE" }
    ),
  block: async (c) => {
    const token = process.env.MODERATION_TOKEN
    if (!token) return "건너뜀(MODERATION_TOKEN 없음)"
    const res = await fetch(`https://api.github.com/user/blocks/${c.login}`, {
      method: "PUT",
      headers: { authorization: `bearer ${token}`, accept: "application/vnd.github+json" },
    })
    if (!res.ok && res.status !== 422) throw new Error(`block ${res.status}`)
  },
}

// 이벤트 페이로드나 수동 실행 입력에서 검사할 댓글을 꺼낸다
async function loadComment() {
  const manualId = process.env.INPUT_COMMENT_ID
  if (manualId) {
    const data = await graphql(
      `query($id:ID!){node(id:$id){... on DiscussionComment{
        id body authorAssociation author{login}
        discussion{title category{name}}}}}`,
      { id: manualId }
    )
    const n = data.node
    return {
      id: n.id,
      body: n.body,
      login: n.author?.login ?? "",
      association: n.authorAssociation,
      category: n.discussion.category.name,
      post: n.discussion.title,
      manual: true,
    }
  }
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, "utf8"))
  return {
    id: event.comment.node_id,
    body: event.comment.body ?? "",
    login: event.comment.user?.login ?? "",
    association: event.comment.author_association,
    category: event.discussion.category?.name,
    post: event.discussion.title,
    manual: false,
  }
}

const summary = (line) => {
  console.log(line)
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n`)
}

async function main() {
  const testIdx = process.argv.indexOf("--test")
  if (testIdx !== -1) {
    const body = process.argv[testIdx + 1] ?? ""
    console.log(JSON.stringify(checkByRules(body) ?? { category: "ok" }))
    return
  }

  const c = await loadComment()
  if (!rules.categories.includes(c.category)) return summary(`검사 제외: ${c.category} 카테고리`)
  // 블로그 주인·협업자 댓글은 건드리지 않는다 (수동 실행은 시험용이라 예외)
  const trusted = ["OWNER", "MEMBER", "COLLABORATOR"].includes(c.association)
  if (!c.manual && (trusted || rules.allowUsers.includes(c.login))) {
    return summary(`검사 제외: 신뢰 사용자 ${c.login}`)
  }

  let verdict = checkByRules(c.body, c.login)
  if (!verdict) {
    try {
      verdict = await checkByAI(c.body)
    } catch (e) {
      // AI \uac00 실패해도 댓글은 그대로 둔다
      console.warn(`AI 판정 실패: ${e.message}`)
    }
  }
  if (!verdict) return summary(`통과: ${c.post} · @${c.login}`)

  // 공개 저장소라 실행 기록도 공개된다. 댓글 본문은 남기지 않는다
  summary(`### 검열: ${verdict.category}\n- 글: ${c.post}\n- 작성자: @${c.login}\n- 근거: ${verdict.rule}`)
  if (rules.dryRun) return summary("- dryRun 이라 조치하지 않음")

  for (const name of rules.actions[verdict.category] ?? ["delete"]) {
    const result = await ACTIONS[name](c, verdict)
    summary(`- ${name}: ${typeof result === "string" ? result : "완료"}`)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e)
    process.exit(1)
  })
}
