import type { NextApiRequest, NextApiResponse } from "next"
import { CONFIG } from "site.config"
import {
  findVisitPage,
  getKstDate,
  recordVisit,
  visitClientId,
} from "src/libs/visits/record"

const recentVisits = new Map<string, number>()
const DEDUP_MS = 30 * 60 * 1000
// 요청 제한. 서버 인스턴스마다 따로 센다(최선 노력)
const WINDOW_MS = 60 * 1000
const PER_IP_LIMIT = 20 // 한 IP 가 1분에 보낼 수 있는 기록 요청
const WRITE_LIMIT = 60 // 인스턴스 전체가 1분에 Notion 에 쓸 수 있는 줄 수(댓글용 API 한도 보호)
const ipHits = new Map<string, { start: number; count: number }>()
let writes = { start: 0, count: 0 }

const overIpLimit = (ip: string, now: number) => {
  const hit = ipHits.get(ip)
  if (!hit || now - hit.start >= WINDOW_MS) {
    ipHits.set(ip, { start: now, count: 1 })
    if (ipHits.size > 5000) {
      for (const [key, value] of ipHits) {
        if (now - value.start >= WINDOW_MS) ipHits.delete(key)
      }
    }
    return false
  }
  hit.count += 1
  return hit.count > PER_IP_LIMIT
}

const overWriteLimit = (now: number) => {
  if (now - writes.start >= WINDOW_MS) writes = { start: now, count: 0 }
  writes.count += 1
  return writes.count > WRITE_LIMIT
}

const BOT =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|headless|lighthouse|python|curl|wget/i

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store")
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).end()
  }
  const userAgent = String(req.headers["user-agent"] ?? "").trim()
  if (
    !CONFIG.visits.enable ||
    process.env.VERCEL_ENV !== "production" ||
    !userAgent ||
    BOT.test(userAgent)
  ) {
    return res.status(204).end()
  }
  const forwarded = String(req.headers["x-forwarded-for"] ?? "")
  const ip = forwarded.split(",")[0].trim() || req.socket.remoteAddress || ""
  if (overIpLimit(ip, Date.now())) return res.status(429).end()

  let body = req.body
  if (typeof body === "string") {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(204).end()
    }
  }
  if (
    !body ||
    typeof body.path !== "string" ||
    typeof body.referrer !== "string" ||
    typeof body.landing !== "boolean"
  ) {
    return res.status(204).end()
  }

  let pending: { key: string; time: number } | undefined
  try {
    const page = await findVisitPage(body.path)
    if (!page) return res.status(204).end()
    const now = Date.now()
    const date = getKstDate(new Date(now))
    const client = visitClientId(req, date)
    const key = `${client}|${page.path}`
    const previous = recentVisits.get(key)
    if (previous !== undefined && now - previous < DEDUP_MS) {
      return res.status(204).end()
    }

    // 저장 중인 요청도 중복으로 보며, 실패하면 다시 기록할 수 있게 지운다
    recentVisits.delete(key)
    recentVisits.set(key, now)
    pending = { key, time: now }
    for (const [oldKey, time] of recentVisits) {
      if (now - time < DEDUP_MS && recentVisits.size <= 1000) break
      recentVisits.delete(oldKey)
    }
    if (overWriteLimit(now)) {
      recentVisits.delete(key)
      return res.status(429).end()
    }
    await recordVisit(req, page, {
      date,
      client,
      referrer: body.referrer,
      landing: body.landing,
    })
  } catch (error) {
    if (pending && recentVisits.get(pending.key) === pending.time) {
      recentVisits.delete(pending.key)
    }
    console.error("방문 기록 저장 실패", error)
  }
  return res.status(204).end()
}
