import { createHash, createHmac } from "crypto"
import type { NextApiRequest } from "next"
import { CONFIG } from "site.config"
import { getPosts } from "src/apis"
import { notionRequest } from "src/apis/notion-client/notionApi"

const TITLE_CACHE_MS = 10 * 60 * 1000
let titleCache: { titles: Map<string, string>; expires: number } | undefined
let titleLoading: Promise<Map<string, string>> | undefined

export const getKstDate = (date: Date): string =>
  new Date(date.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10)

export const classifyReferrer = (referrer: string, siteHost: string) => {
  if (!referrer) return { source: "직접 방문", hostname: "" }
  try {
    const url = new URL(referrer)
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { source: "기타 사이트", hostname: "" }
    }
    const hostname = url.hostname
    if (url.host === siteHost) return { source: "블로그 내부", hostname: "" }
    if (hostname.includes("google.")) return { source: "Google", hostname }
    if (/bing\.|naver\.|daum\.|duckduckgo\.|yahoo\.|search\.brave/.test(hostname)) {
      return { source: "기타 검색", hostname }
    }
    return { source: "기타 사이트", hostname }
  } catch {
    return { source: "기타 사이트", hostname: "" }
  }
}

export const resolveVisitPath = (path: string, titles: Map<string, string>) => {
  const pathname = path.split(/[?#]/)[0]
  if (pathname === "/") return { path: "/", title: "홈" }
  if (!/^\/[^/]+$/.test(pathname)) return null
  try {
    const slug = decodeURIComponent(pathname.slice(1))
    if (
      slug === "api" ||
      slug === "." ||
      slug === ".." ||
      /[/\\?#]/.test(slug)
    ) {
      return null
    }
    const title = titles.get(slug)
    return title === undefined ? null : { path: `/${slug}`, title }
  } catch {
    return null
  }
}

const getTitles = async () => {
  if (titleCache && titleCache.expires > Date.now()) return titleCache.titles
  // 동시에 들어온 요청은 같은 글 목록 조회를 기다린다
  if (!titleLoading) {
    titleLoading = getPosts()
      .then((posts) => {
        const titles = new Map(posts.map((post) => [post.slug, post.title]))
        titleCache = { titles, expires: Date.now() + TITLE_CACHE_MS }
        return titles
      })
      .finally(() => {
        titleLoading = undefined
      })
  }
  return titleLoading
}

export const findVisitPage = async (path: string) => {
  // 홈과 잘못된 경로는 글 목록을 조회하지 않아도 판정할 수 있다
  const page = resolveVisitPath(path, new Map())
  if (page || !/^\/[^/?#]+$/.test(path.split(/[?#]/)[0])) return page
  return resolveVisitPath(path, await getTitles())
}

export const visitClientId = (req: NextApiRequest, date: string) => {
  const forwarded = String(req.headers["x-forwarded-for"] ?? "")
  const ip = forwarded.split(",")[0].trim() || req.socket.remoteAddress || ""
  const userAgent = String(req.headers["user-agent"] ?? "")
  const key = createHash("sha256")
    .update(`wwhalefe-visits:${process.env.NOTION_TOKEN}`)
    .digest()
  return createHmac("sha256", key)
    .update(`${ip}|${userAgent}|${date}`)
    .digest("hex")
    .slice(0, 12)
}

const rt = (content: string) => [{ type: "text", text: { content } }]

export const recordVisit = (
  req: NextApiRequest,
  page: { path: string; title: string },
  visit: { date: string; client: string; referrer: string; landing: boolean }
) => {
  const referral = classifyReferrer(visit.referrer, new URL(CONFIG.link).host)
  return notionRequest("pages", {
    parent: { type: "data_source_id", data_source_id: CONFIG.visits.dataSourceId },
    properties: {
      글: { title: rt(page.title) },
      날짜: { date: { start: visit.date } },
      경로: { rich_text: rt(page.path) },
      방문자: { rich_text: rt(visit.client) },
      "첫 페이지": { checkbox: visit.landing },
      유입: { select: { name: referral.source } },
      "유입 주소": { rich_text: rt(referral.hostname) },
      기기: {
        select: {
          name: /Mobi|Android|iPhone|iPad/i.test(
            String(req.headers["user-agent"] ?? "")
          )
            ? "모바일"
            : "PC",
        },
      },
      국가: { rich_text: rt(String(req.headers["x-vercel-ip-country"] ?? "")) },
    },
  })
}
