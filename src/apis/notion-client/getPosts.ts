import { CONFIG } from "site.config"

import { customMapImageUrl } from "src/libs/utils/notion/customMapImageUrl"
import { TPost, TPosts } from "src/types"
import { getFileUrl, notionRequest, stripFileSignature } from "./notionApi"

const plainText = (prop: any): string =>
  (prop?.title ?? prop?.rich_text ?? [])
    .map((item: any) => item.plain_text)
    .join("")

const selectName = (prop: any): string[] | undefined =>
  prop?.select?.name ? [prop.select.name] : undefined

const toPost = (page: any): TPost => {
  const props = page.properties
  const post: any = {
    id: page.id,
    title: plainText(props.title),
    slug: plainText(props.slug),
    summary: plainText(props.summary),
    createdTime: new Date(page.created_time).toString(),
    fullWidth: false,
  }

  const startDate = props.date?.date?.start
  if (startDate) post.date = { start_date: startDate }

  const status = selectName(props.status)
  if (status) post.status = status
  const type = selectName(props.type)
  if (type) post.type = type
  const category = selectName(props.category)
  if (category) post.category = category

  const tags = (props.tags?.multi_select ?? []).map((tag: any) => tag.name)
  if (tags.length) post.tags = tags

  const people = props.author?.people ?? []
  if (people.length) {
    post.author = people.map((user: any) => ({
      id: user.id,
      name: user.name || CONFIG.profile.name,
      profile_photo: user.avatar_url || null,
    }))
  }

  const thumbnailUrl = getFileUrl(props.thumbnail?.files?.[0])
  if (thumbnailUrl) {
    post.thumbnail = customMapImageUrl(stripFileSignature(thumbnailUrl), {
      id: page.id,
      parent_table: "block",
    } as any)
  }

  return post
}

export const getPosts = async (): Promise<TPosts> => {
  const pages: any[] = []
  let cursor: string | undefined

  do {
    const res: any = await notionRequest(
      `data_sources/${CONFIG.notionConfig.dataSourceId}/query`,
      {
        page_size: 100,
        start_cursor: cursor,
        // Private 글은 사이트로 아예 가져오지 않는다
        filter: {
          or: [
            { property: "status", select: { equals: "Public" } },
            { property: "status", select: { equals: "PublicOnDetail" } },
          ],
        },
      }
    )
    pages.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)

  return pages.map(toPost).sort((a, b) => {
    const dateA = new Date(a.date?.start_date || a.createdTime).getTime()
    const dateB = new Date(b.date?.start_date || b.createdTime).getTime()
    return dateB - dateA
  })
}
