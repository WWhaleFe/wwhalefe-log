import styled from "@emotion/styled"
import React, { useCallback, useEffect, useState } from "react"
import { FiLock } from "react-icons/fi"
import { PublicComment } from "src/libs/comments/types"
import CommentForm from "./CommentForm"

type Props = {
  slug: string
}

const STATUS_LABEL: Record<string, string> = {
  Hidden: "숨김",
  Spam: "자동 차단",
  Banned: "작성자 차단",
}

const formatTime = (iso: string) => {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`
}

const Comments: React.FC<Props> = ({ slug }) => {
  const [comments, setComments] = useState<PublicComment[]>([])
  const [loaded, setLoaded] = useState(false)
  const [admin, setAdmin] = useState(false)
  const [adminEnabled, setAdminEnabled] = useState(false)
  const [replyTo, setReplyTo] = useState<string | null>(null)

  // 글을 쓰거나 지운 직후에는 CDN 캐시를 건너뛰도록 주소를 바꿔 다시 읽는다
  const load = useCallback(
    async (fresh = false) => {
      const qs = new URLSearchParams({ slug })
      if (fresh) qs.set("t", String(Date.now()))
      if (admin) qs.set("admin", "1")
      const res = await fetch(`/api/comments?${qs}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments)
      }
      setLoaded(true)
    },
    [slug, admin]
  )

  useEffect(() => {
    fetch("/api/comments/admin")
      .then((r) => r.json())
      .then((d) => {
        setAdmin(!!d.admin)
        setAdminEnabled(!!d.enabled)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    setReplyTo(null)
    load()
  }, [load])

  const roots = comments.filter((c) => !c.parentId)
  const repliesOf = (id: string) => comments.filter((c) => c.parentId === id)
  const count = comments.filter((c) => !c.removed).length

  const item = (c: PublicComment) => (
    <CommentItem
      key={c.id}
      comment={c}
      admin={admin}
      canReply={!c.parentId && !c.removed}
      onReply={() => setReplyTo(replyTo === c.id ? null : c.id)}
      onChanged={() => load(true)}
    />
  )

  return (
    <StyledWrapper id="comments">
      <h2 className="heading">
        댓글 <span className="count">{loaded ? count : ""}</span>
      </h2>
      <CommentForm slug={slug} admin={admin} onPosted={() => load(true)} />

      <ul className="list">
        {roots.map((c) => (
          <li key={c.id}>
            {item(c)}
            {(repliesOf(c.id).length > 0 || replyTo === c.id) && (
              <ul className="replies">
                {repliesOf(c.id).map((r) => (
                  <li key={r.id}>{item(r)}</li>
                ))}
                {replyTo === c.id && (
                  <li>
                    <CommentForm
                      slug={slug}
                      admin={admin}
                      parentId={c.id}
                      onPosted={() => {
                        setReplyTo(null)
                        load(true)
                      }}
                      onCancel={() => setReplyTo(null)}
                    />
                  </li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {loaded && roots.length === 0 && (
        <p className="empty">첫 댓글을 남겨 주세요.</p>
      )}

      <AdminBar
        enabled={adminEnabled}
        admin={admin}
        onChange={(v) => setAdmin(v)}
      />
    </StyledWrapper>
  )
}

export default Comments

// ---------- 댓글 하나 ----------

type ItemProps = {
  comment: PublicComment
  admin: boolean
  canReply: boolean
  onReply: () => void
  onChanged: () => void
}

const CommentItem: React.FC<ItemProps> = ({
  comment: c,
  admin,
  canReply,
  onReply,
  onChanged,
}) => {
  const [deleting, setDeleting] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  if (c.removed) {
    return <StyledItem data-removed>삭제된 댓글입니다.</StyledItem>
  }

  const call = async (method: "DELETE" | "PATCH", payload: object) => {
    setBusy(true)
    setError("")
    try {
      const res = await fetch(`/api/comments/${c.id}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) return setError(data.message ?? "처리하지 못했습니다.")
      setDeleting(false)
      onChanged()
    } finally {
      setBusy(false)
    }
  }

  const status = c.status && c.status !== "Visible" ? c.status : null

  return (
    <StyledItem data-dim={!!status}>
      <div className="meta">
        <span className="name">{c.name}</span>
        {c.admin && <span className="badge">관리자</span>}
        {c.secret && <span className="tag">
            <FiLock className="lock" aria-hidden />
            비밀
          </span>}
        {status && <span className="tag warn">{STATUS_LABEL[status]}</span>}
        <time dateTime={c.createdAt}>{formatTime(c.createdAt)}</time>
      </div>

      <p className="body">
        {c.body ?? "관리자만 볼 수 있는 비밀 댓글입니다."}
      </p>
      {admin && c.reason && <p className="reason">근거: {c.reason}</p>}

      <div className="actions">
        {canReply && (
          <button type="button" onClick={onReply}>
            답글
          </button>
        )}
        {(admin || !c.admin) && (
          <button type="button" onClick={() => setDeleting((v) => !v)}>
            삭제
          </button>
        )}
        {admin &&
          (status ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => call("PATCH", { status: "Visible" })}
            >
              복구
            </button>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => call("PATCH", { status: "Hidden" })}
            >
              숨김
            </button>
          ))}
        {admin && !c.admin && status !== "Banned" && (
          <button
            type="button"
            disabled={busy}
            onClick={() => call("PATCH", { status: "Banned" })}
          >
            작성자 차단
          </button>
        )}
      </div>

      {deleting && (
        <form
          className="confirm"
          onSubmit={(e) => {
            e.preventDefault()
            call("DELETE", { password })
          }}
        >
          {admin ? (
            <span>이 댓글을 지울까요?</span>
          ) : (
            <input
              type="password"
              aria-label="댓글 비밀번호"
              placeholder="작성할 때 정한 비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />
          )}
          <button type="submit" className="danger" disabled={busy}>
            삭제
          </button>
          <button type="button" onClick={() => setDeleting(false)}>
            취소
          </button>
        </form>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </StyledItem>
  )
}

// ---------- 관리자 로그인 ----------

type AdminBarProps = {
  enabled: boolean
  admin: boolean
  onChange: (admin: boolean) => void
}

const AdminBar: React.FC<AdminBarProps> = ({ enabled, admin, onChange }) => {
  const [open, setOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  if (!enabled) return null

  if (admin) {
    return (
      <div className="admin">
        관리자 모드 ·{" "}
        <button
          type="button"
          onClick={async () => {
            await fetch("/api/comments/admin", { method: "DELETE" })
            onChange(false)
          }}
        >
          로그아웃
        </button>
      </div>
    )
  }

  return (
    <div className="admin">
      {open ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setError("")
            const res = await fetch("/api/comments/admin", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ password }),
            })
            if (!res.ok) return setError("비밀번호가 맞지 않습니다.")
            setPassword("")
            setOpen(false)
            onChange(true)
          }}
        >
          <input
            type="password"
            aria-label="관리자 비밀번호"
            placeholder="관리자 비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus
            required
          />
          <button type="submit">로그인</button>
          <button type="button" onClick={() => setOpen(false)}>
            취소
          </button>
          {error && <span className="error">{error}</span>}
        </form>
      ) : (
        <button type="button" onClick={() => setOpen(true)}>
          관리자
        </button>
      )}
    </div>
  )
}

// ---------- 스타일 ----------

const StyledWrapper = styled.section`
  margin-top: 2.5rem;

  .heading {
    margin-bottom: 0.75rem;
    font-size: 1.125rem;
    line-height: 1.75rem;
    font-weight: 800;

    .count {
      background: ${({ theme }) => theme.surfaces.brandText};
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }

  .list,
  .replies {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .list {
    margin-top: 1rem;
  }
  .replies {
    margin-top: 0.75rem;
    margin-left: 1rem;
    padding-left: 1rem;
    border-left: 2px solid ${({ theme }) => theme.surfaces.tableLine};
  }

  .empty {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.gray11};
  }

  .admin {
    margin-top: 1.25rem;
    font-size: 0.75rem;
    text-align: right;
    color: ${({ theme }) => theme.colors.gray11};

    form {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    input {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      ${({ theme }) => theme.surfaces.glass}
    }
    button {
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .error {
      color: ${({ theme }) => theme.colors.red11};
    }
  }
`

const StyledItem = styled.div`
  padding: 0.875rem 1rem;
  border-radius: 1.25rem;
  ${({ theme }) => theme.surfaces.claySoft}

  &[data-removed] {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.colors.gray11};
  }
  &[data-dim="true"] {
    opacity: 0.6;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;

    .name {
      font-weight: 700;
    }
    time {
      margin-left: auto;
      color: ${({ theme }) => theme.colors.gray11};
      font-variant-numeric: tabular-nums;
    }
  }

  .badge,
  .tag {
    display: inline-flex;
    padding: 0 0.5rem;
    gap: 0.25rem;
    align-items: center;
    border-radius: 9999px;
    font-size: 0.75rem;
    line-height: 1.25rem;

    .lock {
      width: 0.75rem;
      height: 0.75rem;
    }
  }
  .badge {
    ${({ theme }) => theme.surfaces.activePill}
  }
  .tag {
    ${({ theme }) => theme.surfaces.glass}
  }
  .tag.warn {
    color: ${({ theme }) => theme.colors.red11};
  }

  .body {
    margin-top: 0.375rem;
    font-size: 0.9375rem;
    line-height: 1.5rem;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
  .reason {
    margin-top: 0.25rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.gray11};
  }

  .actions,
  .confirm {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.gray11};

    button:hover {
      color: ${({ theme }) => theme.surfaces.link};
    }
    button:disabled {
      opacity: 0.5;
    }
  }
  .confirm {
    input {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      ${({ theme }) => theme.surfaces.glass}
    }
    .danger {
      color: ${({ theme }) => theme.colors.red11};
      font-weight: 600;
    }
  }
  .error {
    margin-top: 0.375rem;
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.red11};
  }
`
