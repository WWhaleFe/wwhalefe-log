import { getPosts } from "../apis/notion-client/getPosts"
import { filterPosts } from "src/libs/utils/notion"
import { CONFIG } from "site.config"
import { getServerSideSitemap, ISitemapField } from "next-sitemap"
import { GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // 목록에 보이는 글만 싣는다. PublicOnDetail 은 링크로만 공유하는 글이라 뺀다
  const posts = filterPosts(await getPosts(), {
    acceptStatus: ["Public"],
    acceptType: ["Post", "Paper", "Page"],
  })

  const fields: ISitemapField[] = posts.map((post) => ({
    loc: `${CONFIG.link}/${encodeURIComponent(post.slug)}`,
    lastmod: new Date(
      post.updatedTime || post.date?.start_date || post.createdTime
    ).toISOString(),
    priority: 0.7,
    changefreq: "weekly",
  }))

  const latestLastmod = fields.reduce(
    (latest, field) => Math.max(latest, new Date(field.lastmod!).getTime()),
    0
  )

  // 홈에도 공개글 중 가장 최근 수정 시각을 사용한다
  fields.unshift({
    loc: CONFIG.link,
    lastmod: new Date(posts.length ? latestLastmod : Date.now()).toISOString(),
    priority: 1.0,
    changefreq: "daily",
  })

  ctx.res.setHeader(
    "Cache-Control",
    "public, s-maxage=600, stale-while-revalidate=3600"
  )

  return getServerSideSitemap(ctx, fields)
}

// 페이지 기본 내보내기를 제공한다
export default () => {}
