import { NextApiRequest, NextApiResponse } from "next"
import { CONFIG } from "site.config"
import { isAdmin, verifyPassword } from "src/libs/comments/auth"
import { CommentStatus, getComment, setStatus } from "src/libs/comments/store"

const ADMIN_STATUSES: CommentStatus[] = ["Visible", "Hidden", "Spam", "Banned"]

// DELETE: 작성자는 비밀번호로, 관리자는 그냥 지운다. 실제로는 status=Deleted 로 내려 Notion 에 기록이 남는다
// PATCH : 관리자만. 숨김·복구·차단
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!CONFIG.comments.enable) return res.status(404).end()
  try {
    const comment = await getComment(String(req.query.id))
    if (!comment || comment.status === "Deleted") {
      return res.status(404).json({ message: "이미 지워졌거나 없는 댓글입니다." })
    }
    const admin = isAdmin(req)

    if (req.method === "DELETE") {
      if (admin) {
        await setStatus(comment.id, "Deleted", "관리자 삭제")
        return res.json({ ok: true })
      }
      const password = String(req.body?.password ?? "")
      if (comment.admin || !comment.password || !verifyPassword(password, comment.password)) {
        return res.status(403).json({ message: "비밀번호가 맞지 않습니다." })
      }
      await setStatus(comment.id, "Deleted", "작성자 삭제")
      return res.json({ ok: true })
    }

    if (req.method === "PATCH") {
      if (!admin) return res.status(403).json({ message: "관리자만 할 수 있습니다." })
      const status = String(req.body?.status) as CommentStatus
      if (!ADMIN_STATUSES.includes(status)) {
        return res.status(400).json({ message: "바꿀 수 없는 상태입니다." })
      }
      await setStatus(comment.id, status, status === "Visible" ? "" : "관리자 조치")
      return res.json({ ok: true })
    }

    res.setHeader("Allow", "DELETE, PATCH")
    res.status(405).end()
  } catch (e) {
    console.error("comment api failed", e)
    res.status(500).json({ message: "처리하지 못했습니다. 잠시 후 다시 시도해 주세요." })
  }
}
