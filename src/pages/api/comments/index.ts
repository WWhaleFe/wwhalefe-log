import { NextApiRequest, NextApiResponse } from "next"
import { CONFIG } from "site.config"
import { getPosts } from "src/apis"
import { clientId, hashPassword, isAdmin } from "src/libs/comments/auth"
import { checkByAI, checkByRules } from "src/libs/comments/moderate"
import {
  createComment,
  isBanned,
  listComments,
  postedRecently,
  StoredComment,
} from "src/libs/comments/store"
import { LIMITS, PublicComment } from "src/libs/comments/types"

const RESERVED_NAMES = [CONFIG.profile.name, "관리자", "admin", "운영자"].map(
  (n) => n.toLowerCase()
)

const toPublic = (c: StoredComment, admin: boolean): PublicComment => ({
  id: c.id,
  name: c.name,
  body: c.secret && !admin ? null : c.body,
  secret: c.secret,
  admin: c.admin,
  parentId: c.parentId,
  createdAt: c.createdAt,
  ...(admin && { status: c.status, reason: c.reason }),
})

async function list(req: NextApiRequest, res: NextApiResponse) {
  const slug = String(req.query.slug ?? "")
  if (!slug) return res.status(400).json({ message: "slug 가 필요합니다." })
  const admin = isAdmin(req)

  const all = await listComments(slug)
  const shown = all.filter((c) =>
    admin ? c.status !== "Deleted" : c.status === "Visible"
  )
  const comments = shown.map((c) => toPublic(c, admin))

  // 부모가 지워졌어도 답글은 남긴다. 부모 자리에는 "삭제된 댓글" 표시만 둔다
  const ids = new Set(comments.map((c) => c.id))
  for (const parentId of new Set(comments.map((c) => c.parentId))) {
    if (!parentId || ids.has(parentId)) continue
    const parent = all.find((c) => c.id === parentId)
    comments.push({
      id: parentId,
      name: "",
      body: null,
      secret: false,
      admin: false,
      parentId: null,
      createdAt: parent?.createdAt ?? "",
      removed: true,
    })
  }

  res.setHeader(
    "Cache-Control",
    admin ? "private, no-store" : "public, s-maxage=20, stale-while-revalidate=60"
  )
  res.json({ comments, admin })
}

async function create(req: NextApiRequest, res: NextApiResponse) {
  const admin = isAdmin(req)
  const b = req.body ?? {}
  const slug = String(b.slug ?? "")
  const body = String(b.body ?? "").trim()
  const name = admin ? CONFIG.profile.name : String(b.name ?? "").trim()
  const password = String(b.password ?? "")
  const secret = !!b.secret
  const parentId = b.parentId ? String(b.parentId) : null

  // 사람에게는 보이지 않는 칸(website)을 채웠거나 너무 빨리 보낸 요청은 봇으로 본다
  const typedMs = Date.now() - Number(b.startedAt ?? 0)
  if (b.website || !(typedMs >= LIMITS.minTypingMs)) {
    return res.status(400).json({ message: "잠시 후 다시 시도해 주세요." })
  }
  if (!body || body.length > LIMITS.body) {
    return res
      .status(400)
      .json({ message: `내용은 1~${LIMITS.body}자로 써 주세요.` })
  }
  if (!admin) {
    if (!name || name.length > LIMITS.name) {
      return res
        .status(400)
        .json({ message: `닉네임은 1~${LIMITS.name}자로 써 주세요.` })
    }
    if (RESERVED_NAMES.includes(name.toLowerCase())) {
      return res.status(400).json({ message: "쓸 수 없는 닉네임입니다." })
    }
    const { min, max } = LIMITS.password
    if (password.length < min || password.length > max) {
      return res
        .status(400)
        .json({ message: `비밀번호는 ${min}~${max}자로 정해 주세요.` })
    }
  }

  const posts = await getPosts()
  if (!posts.some((p) => p.slug === slug)) {
    return res.status(404).json({ message: "없는 글입니다." })
  }
  if (parentId) {
    const siblings = await listComments(slug)
    const parent = siblings.find((c) => c.id === parentId)
    if (!parent || parent.parentId) {
      return res.status(400).json({ message: "답글을 달 수 없는 댓글입니다." })
    }
  }

  const client = clientId(req)
  if (!admin) {
    if (await isBanned(client)) {
      return res.status(403).json({ message: "댓글 작성이 제한되었습니다." })
    }
    if (await postedRecently(client, LIMITS.cooldown)) {
      return res
        .status(429)
        .json({ message: `${LIMITS.cooldown}초 뒤에 다시 써 주세요.` })
    }
  }

  const verdict = admin
    ? null
    : checkByRules(`${name}\n${body}`) ?? (await checkByAI(body))
  const stored = await createComment({
    slug,
    name,
    body,
    secret,
    admin,
    parentId,
    status: verdict ? "Spam" : "Visible",
    reason: verdict?.rule ?? "",
    password: admin ? "" : hashPassword(password),
    client,
  })

  if (verdict) {
    // 관리자가 Notion 에서 확인하고 Visible 로 되살릴 수 있게 기록만 남긴다
    return res.status(422).json({
      message:
        verdict.category === "spam"
          ? "광고성 내용으로 판단되어 등록되지 않았습니다."
          : "부적절한 표현이 있어 등록되지 않았습니다.",
    })
  }
  res.status(201).json({ comment: toPublic(stored, admin) })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!CONFIG.comments.enable) return res.status(404).end()
  try {
    if (req.method === "GET") return await list(req, res)
    if (req.method === "POST") return await create(req, res)
    res.setHeader("Allow", "GET, POST")
    res.status(405).end()
  } catch (e) {
    console.error("comments api failed", e)
    res.status(500).json({ message: "댓글을 처리하지 못했습니다. 잠시 후 다시 시도해 주세요." })
  }
}
