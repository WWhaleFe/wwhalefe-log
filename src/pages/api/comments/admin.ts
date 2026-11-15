import { NextApiRequest, NextApiResponse } from "next"
import {
  adminEnabled,
  checkAdminPassword,
  clearAdminCookie,
  isAdmin,
  setAdminCookie,
} from "src/libs/comments/auth"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// 관리자 로그인. 비밀번호는 Vercel 환경변수 COMMENT_ADMIN_PASSWORD 로만 정한다
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Cache-Control", "private, no-store")
  if (req.method === "GET") {
    return res.json({ enabled: adminEnabled(), admin: isAdmin(req) })
  }
  if (req.method === "POST") {
    if (!checkAdminPassword(String(req.body?.password ?? ""))) {
      // 무작위 대입을 늦춘다
      await sleep(1500)
      return res.status(403).json({ message: "비밀번호가 맞지 않습니다." })
    }
    setAdminCookie(res)
    return res.json({ admin: true })
  }
  if (req.method === "DELETE") {
    clearAdminCookie(res)
    return res.json({ admin: false })
  }
  res.setHeader("Allow", "GET, POST, DELETE")
  res.status(405).end()
}
