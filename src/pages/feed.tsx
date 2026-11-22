import { GetServerSideProps } from "next"
import { CONFIG } from "site.config"
import { getPosts } from "src/apis/notion-client/getPosts"
import { filterPosts } from "src/libs/utils/notion"

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const posts = filterPosts(await getPosts(), {
    acceptStatus: ["Public"],
    acceptType: ["Post", "Paper", "Page"],
  })
  const updatedTimes = posts
    .filter((post) => post.updatedTime)
    .map((post) => new Date(post.updatedTime!).getTime())
  const lastBuildDate = new Date(
    updatedTimes.length ? Math.max(...updatedTimes) : Date.now()
  ).toUTCString()

  // filterPosts가 발행일 최신순으로 정렬한 공개글 중 30개만 싣는다
  const items = posts
    .slice(0, 30)
    .map((post) => {
      const link = escapeXml(`${CONFIG.link}/${encodeURIComponent(post.slug)}`)
      const pubDate = new Date(
        post.date?.start_date || post.createdTime
      ).toUTCString()
      const categories = (post.tags || [])
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("\n")

      return `<item>
<title>${escapeXml(post.title)}</title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<pubDate>${pubDate}</pubDate>
<description>${escapeXml(post.summary || "")}</description>
${categories}
</item>`
    })
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${escapeXml(CONFIG.blog.title)}</title>
<link>${escapeXml(CONFIG.link)}</link>
<description>${escapeXml(CONFIG.blog.description)}</description>
<language>${escapeXml(CONFIG.lang || "ko-KR")}</language>
<lastBuildDate>${lastBuildDate}</lastBuildDate>
<atom:link href="${escapeXml(
    `${CONFIG.link}/feed`
  )}" rel="self" type="application/rss+xml"/>
${items}
</channel>
</rss>`

  ctx.res.setHeader("Content-Type", "application/rss+xml; charset=utf-8")
  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=3600"
  )
  ctx.res.write(xml)
  ctx.res.end()

  return { props: {} }
}

export default function Feed() {
  return null
}
