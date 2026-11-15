import { CONFIG } from "site.config"
import { notionRequest } from "src/apis/notion-client/notionApi"

// Notion 「💬 블로그 댓글」 DB. 관리자는 Notion 에서 status 만 바꾸면 된다
export type CommentStatus = "Visible" | "Hidden" | "Spam" | "Banned" | "Deleted"

export type StoredComment = {
  id: string
  name: string
  body: string
  slug: string
  status: CommentStatus
  secret: boolean
  admin: boolean
  parentId: string | null
  reason: string
  password: string
  client: string
  createdAt: string
}

const DS = () => `data_sources/${CONFIG.comments.dataSourceId}/query`

const text = (prop: any): string =>
  (prop?.title ?? prop?.rich_text ?? []).map((t: any) => t.plain_text).join("")

const rt = (content: string) => [{ type: "text", text: { content } }]

const toComment = (page: any): StoredComment => {
  const p = page.properties
  return {
    id: page.id,
    name: text(p.name),
    body: text(p.body),
    slug: text(p.slug),
    status: (p.status?.select?.name ?? "Hidden") as CommentStatus,
    secret: !!p.secret?.checkbox,
    admin: !!p.admin?.checkbox,
    parentId: text(p.parent) || null,
    reason: text(p.reason),
    password: text(p.password),
    client: text(p.client),
    createdAt: p.created?.created_time ?? page.created_time,
  }
}

const queryAll = async (filter: unknown) => {
  const pages: any[] = []
  let cursor: string | undefined
  do {
    const res: any = await notionRequest(DS(), {
      page_size: 100,
      start_cursor: cursor,
      filter,
      sorts: [{ property: "created", direction: "ascending" }],
    })
    pages.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return pages.map(toComment)
}

export const listComments = (slug: string) =>
  queryAll({ property: "slug", rich_text: { equals: slug } })

// id 는 요청에서 온 값이라, 댓글 DB 의 페이지가 아니면(예: 블로그 글) 없는 것으로 본다
export const getComment = async (id: string) => {
  if (!/^[0-9a-f-]{32,36}$/i.test(id)) return null
  const page: any = await notionRequest(`pages/${id}`).catch(() => null)
  if (!page || page.archived || page.in_trash) return null
  if (page.parent?.data_source_id !== CONFIG.comments.dataSourceId) return null
  return toComment(page)
}

export const createComment = async (c: Omit<StoredComment, "id" | "createdAt">) => {
  const page: any = await notionRequest("pages", {
    parent: { type: "data_source_id", data_source_id: CONFIG.comments.dataSourceId },
    properties: {
      name: { title: rt(c.name) },
      body: { rich_text: rt(c.body) },
      slug: { rich_text: rt(c.slug) },
      status: { select: { name: c.status } },
      secret: { checkbox: c.secret },
      admin: { checkbox: c.admin },
      parent: { rich_text: rt(c.parentId ?? "") },
      reason: { rich_text: rt(c.reason) },
      password: { rich_text: rt(c.password) },
      client: { rich_text: rt(c.client) },
    },
  })
  return toComment(page)
}

export const setStatus = (id: string, status: CommentStatus, reason?: string) =>
  notionRequest(
    `pages/${id}`,
    {
      properties: {
        status: { select: { name: status } },
        ...(reason !== undefined && { reason: { rich_text: rt(reason) } }),
      },
    },
    "PATCH"
  )

// 관리자가 Banned 로 표시한 댓글이 하나라도 있는 작성자는 더 쓸 수 없다
export const isBanned = async (client: string) => {
  const res: any = await notionRequest(DS(), {
    page_size: 1,
    filter: {
      and: [
        { property: "client", rich_text: { equals: client } },
        { property: "status", select: { equals: "Banned" } },
      ],
    },
  })
  return res.results.length > 0
}

export const postedRecently = async (client: string, seconds: number) => {
  const since = new Date(Date.now() - seconds * 1000).toISOString()
  const res: any = await notionRequest(DS(), {
    page_size: 1,
    filter: {
      and: [
        { property: "client", rich_text: { equals: client } },
        { property: "created", created_time: { on_or_after: since } },
      ],
    },
  })
  return res.results.length > 0
}
