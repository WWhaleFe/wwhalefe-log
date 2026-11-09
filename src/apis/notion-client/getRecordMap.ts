import { ExtendedRecordMap } from "notion-types"
import { CONFIG } from "site.config"
import { getFileUrl, notionRequest, stripFileSignature } from "./notionApi"

// 공식 API 블록을 react-notion-x 가 쓰는 recordMap 형식으로 변환한다

const TEXT_TYPES: Record<string, string> = {
  paragraph: "text",
  heading_1: "header",
  heading_2: "sub_header",
  heading_3: "sub_sub_header",
  bulleted_list_item: "bulleted_list",
  numbered_list_item: "numbered_list",
  toggle: "toggle",
  quote: "quote",
}

const EMBED_FORMAT = {
  block_width: 720,
  block_height: 480,
  block_preserve_scale: true,
}

const decorate = (richText: any[] = []) =>
  richText.map((item) => {
    if (item.type === "equation") {
      return ["⁍", [["e", item.equation.expression]]]
    }
    const { bold, italic, strikethrough, underline, code, color } =
      item.annotations ?? {}
    const marks: any[] = []
    if (bold) marks.push(["b"])
    if (italic) marks.push(["i"])
    if (strikethrough) marks.push(["s"])
    if (underline) marks.push(["_"])
    if (code) marks.push(["c"])
    if (color && color !== "default") marks.push(["h", color])
    if (item.href) marks.push(["a", item.href])
    return marks.length ? [item.plain_text, marks] : [item.plain_text]
  })

const withCaption = (data: any, properties: any = {}) =>
  data.caption?.length
    ? { ...properties, caption: decorate(data.caption) }
    : properties

const withColor = (data: any, format: any = {}) =>
  data.color && data.color !== "default"
    ? { ...format, block_color: data.color }
    : format

const convertBlock = (block: any) => {
  const data = block[block.type] ?? {}

  if (TEXT_TYPES[block.type]) {
    return {
      type: TEXT_TYPES[block.type],
      properties: data.rich_text?.length
        ? { title: decorate(data.rich_text) }
        : undefined,
      format: withColor(
        data,
        data.is_toggleable ? { toggleable: true } : {}
      ),
    }
  }

  switch (block.type) {
    case "to_do":
      return {
        type: "to_do",
        properties: {
          title: decorate(data.rich_text),
          checked: [[data.checked ? "Yes" : "No"]],
        },
        format: withColor(data),
      }
    case "callout": {
      const icon = data.icon?.emoji ?? stripIconUrl(data.icon)
      return {
        type: "callout",
        properties: { title: decorate(data.rich_text) },
        format: withColor(data, icon ? { page_icon: icon } : {}),
      }
    }
    case "code":
      return {
        type: "code",
        properties: withCaption(data, {
          title: decorate(data.rich_text),
          language: [[data.language]],
        }),
      }
    case "equation":
      return { type: "equation", properties: { title: [[data.expression]] } }
    case "divider":
      return { type: "divider" }
    case "table_of_contents":
      return { type: "table_of_contents", format: withColor(data) }
    case "bookmark":
    case "link_preview":
      return {
        type: "bookmark",
        properties: withCaption(data, { link: [[data.url]] }),
      }
    case "image": {
      const url = stripFileSignature(getFileUrl(data) ?? "")
      return {
        type: "image",
        properties: withCaption(data, { source: [[url]] }),
        format: { display_source: url, block_preserve_scale: true },
      }
    }
    case "video":
    case "embed":
    case "pdf":
    case "audio": {
      const url = getFileUrl(data) ?? data.url
      return {
        type: block.type,
        properties: withCaption(data, { source: [[url]] }),
        format: { ...EMBED_FORMAT, display_source: url },
      }
    }
    case "file":
      return {
        type: "file",
        properties: withCaption(data, {
          title: [[data.name || "File"]],
          source: [[getFileUrl(data)]],
        }),
      }
    case "table":
      return {
        type: "table",
        format: {
          table_block_column_order: Array.from(
            { length: data.table_width },
            (_, i) => `col${i}`
          ),
          table_block_column_header: data.has_column_header,
          table_block_row_header: data.has_row_header,
        },
      }
    case "table_row":
      return {
        type: "table_row",
        properties: Object.fromEntries(
          data.cells.map((cell: any[], i: number) => [
            `col${i}`,
            decorate(cell),
          ])
        ),
      }
    case "column_list":
      return { type: "column_list" }
    case "column":
      return { type: "column" }
    case "synced_block":
      return { type: "transclusion_container" }
    default:
      return null
  }
}

const stripIconUrl = (icon: any) => {
  const url = getFileUrl(icon)
  return url ? stripFileSignature(url) : undefined
}

const listChildren = async (blockId: string) => {
  const blocks: any[] = []
  let cursor: string | undefined
  do {
    const query = cursor ? `&start_cursor=${cursor}` : ""
    const res: any = await notionRequest(
      `blocks/${blockId}/children?page_size=100${query}`
    )
    blocks.push(...res.results)
    cursor = res.has_more ? res.next_cursor : undefined
  } while (cursor)
  return blocks
}

const collectChildren = async (
  parentId: string,
  recordBlocks: Record<string, any>
) => {
  const childIds: string[] = []

  for (const block of await listChildren(parentId)) {
    const converted = convertBlock(block)
    if (!converted) continue

    childIds.push(block.id)
    const content = block.has_children
      ? await collectChildren(block.id, recordBlocks)
      : []

    recordBlocks[block.id] = {
      role: "reader",
      value: {
        ...converted,
        id: block.id,
        content,
        parent_id: parentId,
        parent_table: "block",
        alive: true,
        version: 1,
        created_time: Date.parse(block.created_time),
        last_edited_time: Date.parse(block.last_edited_time),
      },
    }

    if (converted.type === "column_list") {
      content.forEach((columnId: string) => {
        recordBlocks[columnId].value.format = {
          column_ratio: 1 / content.length,
        }
      })
    }
  }

  return childIds
}

export const getRecordMap = async (
  pageId: string
): Promise<ExtendedRecordMap> => {
  const page: any = await notionRequest(`pages/${pageId}`)

  // react-notion-x 는 block 의 첫 키를 루트 페이지로 본다
  const block: Record<string, any> = { [page.id]: null }
  const content = await collectChildren(page.id, block)

  block[page.id] = {
    role: "reader",
    value: {
      id: page.id,
      type: "page",
      properties: { title: decorate(page.properties.title?.title) },
      content,
      format: {},
      parent_id: CONFIG.notionConfig.dataSourceId,
      parent_table: "collection",
      alive: true,
      version: 1,
      created_time: Date.parse(page.created_time),
      last_edited_time: Date.parse(page.last_edited_time),
    },
  }

  // getStaticProps 는 undefined 를 직렬화하지 못한다
  return JSON.parse(
    JSON.stringify({
      block,
      collection: {},
      collection_view: {},
      collection_query: {},
      notion_user: {},
      signed_urls: {},
    })
  )
}
