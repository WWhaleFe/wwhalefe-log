import type { CommentStatus } from "./store"

// 브라우저로 내보내는 댓글. 비밀번호 해시·작성자 식별값은 절대 넣지 않는다
export type PublicComment = {
  id: string
  name: string
  // 비밀 댓글을 관리자가 아닌 사람이 볼 때, 또는 지워진 부모 자리일 때 null
  body: string | null
  secret: boolean
  admin: boolean
  parentId: string | null
  createdAt: string
  removed?: boolean
  // 관리자에게만 내려준다
  status?: CommentStatus
  reason?: string
}

export const LIMITS = {
  name: 20,
  password: { min: 4, max: 64 },
  body: 2000,
  // 같은 사람이 연달아 쓰는 간격(초)
  cooldown: 15,
  // 화면을 연 뒤 이 시간(ms)보다 빨리 제출하면 봇으로 본다
  minTypingMs: 3000,
}
