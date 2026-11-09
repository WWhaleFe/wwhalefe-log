const API_URL = "https://api.notion.com/v1"
const API_VERSION = "2025-09-03"
const MAX_RETRIES = 4

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const notionRequest = async <T = any>(
  path: string,
  body?: unknown
): Promise<T> => {
  const token = process.env.NOTION_TOKEN
  if (!token) throw new Error("NOTION_TOKEN is not set")

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${API_URL}/${path}`, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Notion-Version": API_VERSION,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (res.ok) return res.json()

    if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
      const retryAfter = Number(res.headers.get("retry-after")) || attempt + 1
      await sleep(retryAfter * 1000)
      continue
    }
    const detail = (await res.text()).slice(0, 300)
    throw new Error(`Notion API ${res.status} on ${path}: ${detail}`)
  }
}

// 서명된 S3 주소는 1시간 뒤 만료되므로 notion.so/image 프록시용으로 서명을 뗀다
export const stripFileSignature = (url: string) => {
  try {
    const u = new URL(url)
    if (
      u.hostname.endsWith(".amazonaws.com") &&
      u.searchParams.has("X-Amz-Signature")
    ) {
      return u.origin + u.pathname
    }
  } catch {
    // ignore invalid urls
  }
  return url
}

export const getFileUrl = (file: any): string | undefined =>
  file?.external?.url ?? file?.file?.url ?? file?.custom_emoji?.url
