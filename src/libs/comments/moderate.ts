import rules from "./rules.json"

export type Verdict = { category: "spam" | "abuse"; rule: string }

const ZERO_WIDTH = /[\u200b-\u200f\u2060\ufeff]/g

// NFKC 는 'ㅅ' 같은 호환 자모를 조합용 자모로 바꿔 버려서 쓰지 않는다. 전각 영숫자만 반각으로 접는다
const normalize = (text: string) =>
  text
    .normalize("NFC")
    .replace(/[\uff01-\uff5e]/g, (ch) =>
      String.fromCharCode(ch.charCodeAt(0) - 0xfee0)
    )
    .replace(ZERO_WIDTH, "")
    .toLowerCase()

// "씨1발", "ㅅ.ㅂ" 같은 우회를 잡으려고 한글·영문만 남긴다
const lettersOnly = (text: string) =>
  text.replace(/[^a-z\uac00-\ud7a3\u3131-\u318e]/g, "")

// 단어를 통째로 붙이면 "질병 신고"가 "병신"이 되므로, 한 글자씩 띄운 구간("병 신", "카 지 노")만 붙인다
const tokens = (text: string, clean = (t: string) => t) => {
  const out: string[] = []
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

const countLinks = (text: string) => {
  const urls = text.match(/(https?:\/\/|www\.)[^\s)\]]+/g) ?? []
  return urls.filter((url) => {
    const host = url.replace(/^https?:\/\//, "").split(/[/?#]/)[0]
    return !rules.spam.allowDomains.some(
      (d) => host === d || host.endsWith(`.${d}`)
    )
  }).length
}

export function checkByRules(body: string): Verdict | null {
  const text = normalize(body)
  const joined = tokens(text).join(" ")

  const links = countLinks(text)
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
      return { category: "abuse", rule: `금칙어 ${word}` }
    }
  }
  return null
}

// 규칙에 걸리지 않은 댓글만 Claude 로 한 번 더 본다. 꺼져 있거나 실패하면 통과시킨다
export async function checkByAI(body: string): Promise<Verdict | null> {
  if (!rules.ai.enabled || !process.env.ANTHROPIC_API_KEY) return null
  try {
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
    const block = response.content.find((b) => b.type === "text")
    if (!block || block.type !== "text") return null
    const { verdict, reason } = JSON.parse(block.text)
    return verdict === "spam" || verdict === "abuse"
      ? { category: verdict, rule: `AI: ${reason}` }
      : null
  } catch (e) {
    console.warn("AI moderation failed", e)
    return null
  }
}
