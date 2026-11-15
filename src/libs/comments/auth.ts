import {
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto"
import type { NextApiRequest, NextApiResponse } from "next"

// 서명용 키를 따로 두지 않고 이미 있는 비밀값에서 뽑는다.
// 관리자 비밀번호를 바꾸면 키도 바뀌어 기존 관리자 세션이 모두 풀린다.
const secretKey = () =>
  createHash("sha256")
    .update(
      `wwhalefe-comments:${process.env.NOTION_TOKEN ?? ""}:${
        process.env.COMMENT_ADMIN_PASSWORD ?? ""
      }`
    )
    .digest()

const safeEqual = (a: Buffer, b: Buffer) =>
  a.length === b.length && timingSafeEqual(a, b)

// ---------- 댓글 비밀번호 (작성자가 삭제할 때 쓴다) ----------

export const hashPassword = (password: string) => {
  const salt = randomBytes(16)
  const hash = scryptSync(password, salt, 32)
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`
}

export const verifyPassword = (password: string, stored: string) => {
  const [scheme, salt, hash] = stored.split("$")
  if (scheme !== "scrypt" || !salt || !hash) return false
  const actual = scryptSync(password, Buffer.from(salt, "hex"), 32)
  return safeEqual(actual, Buffer.from(hash, "hex"))
}

// ---------- 작성자 식별 (IP 원문은 저장하지 않는다) ----------

export const clientId = (req: NextApiRequest) => {
  const forwarded = String(req.headers["x-forwarded-for"] ?? "")
  const ip = forwarded.split(",")[0].trim() || req.socket.remoteAddress || ""
  return createHmac("sha256", secretKey())
    .update(ip)
    .digest("hex")
    .slice(0, 24)
}

// ---------- 관리자 세션 ----------

const ADMIN_COOKIE = "wl_admin"
const ADMIN_DAYS = 7

export const adminEnabled = () => !!process.env.COMMENT_ADMIN_PASSWORD

export const checkAdminPassword = (password: string) => {
  const expected = process.env.COMMENT_ADMIN_PASSWORD
  if (!expected) return false
  const digest = (v: string) => createHash("sha256").update(v).digest()
  return safeEqual(digest(password), digest(expected))
}

const sign = (value: string) =>
  createHmac("sha256", secretKey()).update(value).digest("hex")

export const setAdminCookie = (res: NextApiResponse) => {
  const expires = Date.now() + ADMIN_DAYS * 24 * 60 * 60 * 1000
  const value = `${expires}.${sign(String(expires))}`
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_COOKIE}=${value}; Path=/api/comments; HttpOnly; Secure; SameSite=Strict; Max-Age=${
      ADMIN_DAYS * 24 * 60 * 60
    }`
  )
}

export const clearAdminCookie = (res: NextApiResponse) => {
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_COOKIE}=; Path=/api/comments; HttpOnly; Secure; SameSite=Strict; Max-Age=0`
  )
}

export const isAdmin = (req: NextApiRequest) => {
  if (!adminEnabled()) return false
  const [expires, signature] = (req.cookies[ADMIN_COOKIE] ?? "").split(".")
  if (!expires || !signature || Number(expires) < Date.now()) return false
  return safeEqual(Buffer.from(signature), Buffer.from(sign(expires)))
}
