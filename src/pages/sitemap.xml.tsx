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
    lastmod: new Date(post.date?.start_date || post.createdTime).toISOString(),
    priority: 0.7,
    changefreq: "weekly",
  }))

  // Include the site root separately
  fields.unshift({
    loc: CONFIG.link,
    lastmod: new Date().toISOString(),
    priority: 1.0,
    changefreq: "daily",
  })

  return getServerSideSitemap(ctx, fields)
}

// Default export to prevent next.js errors
export default () => {}
