import styled from "@emotion/styled"
import React, { useEffect, useRef, useState } from "react"
import { LIMITS } from "src/libs/comments/types"

type Props = {
  slug: string
  admin: boolean
  parentId?: string
  onPosted: () => void
  onCancel?: () => void
}

// 닉네임은 다음에 쓸 때 다시 채워 준다. 비밀번호는 저장하지 않는다
const NAME_KEY = "comment-name"

const CommentForm: React.FC<Props> = ({
  slug,
  admin,
  parentId,
  onPosted,
  onCancel,
}) => {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [body, setBody] = useState("")
  const [secret, setSecret] = useState(false)
  const [website, setWebsite] = useState("")
  const [error, setError] = useState("")
  const [sending, setSending] = useState(false)
  const startedAt = useRef(Date.now())

  useEffect(() => {
    try {
      setName(localStorage.getItem(NAME_KEY) ?? "")
    } catch {}
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSending(true)
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          name,
          password,
          body,
          secret,
          parentId,
          website,
          startedAt: startedAt.current,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.message ?? "등록하지 못했습니다.")
        return
      }
      try {
        if (!admin) localStorage.setItem(NAME_KEY, name)
      } catch {}
      setBody("")
      setPassword("")
      setSecret(false)
      startedAt.current = Date.now()
      onPosted()
    } finally {
      setSending(false)
    }
  }

  return (
    <StyledForm onSubmit={submit} data-reply={!!parentId}>
      {!admin && (
        <div className="who">
          <input
            aria-label="닉네임"
            placeholder="닉네임"
            value={name}
            maxLength={LIMITS.name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            aria-label="비밀번호"
            type="password"
            placeholder="비밀번호 (삭제할 때 필요)"
            value={password}
            minLength={LIMITS.password.min}
            maxLength={LIMITS.password.max}
            autoComplete="new-password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      )}
      {/* 사람에게는 보이지 않는 칸. 봇이 채우면 거른다 */}
      <input
        className="trap"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <textarea
        aria-label="댓글 내용"
        placeholder={
          parentId ? "답글을 남겨 주세요" : "궁금한 점이나 의견을 남겨 주세요"
        }
        value={body}
        maxLength={LIMITS.body}
        rows={parentId ? 3 : 4}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <div className="actions">
        <button
          type="button"
          className="toggle"
          aria-pressed={secret}
          onClick={() => setSecret((v) => !v)}
        >
          <span className="box">{secret ? "✓" : ""}</span>
          비밀 댓글
        </button>
        <span className="count">
          {body.length}/{LIMITS.body}
        </span>
        {onCancel && (
          <button type="button" className="ghost" onClick={onCancel}>
            취소
          </button>
        )}
        <button type="submit" className="primary" disabled={sending}>
          {sending ? "등록 중…" : admin ? "관리자로 등록" : "등록"}
        </button>
      </div>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
    </StyledForm>
  )
}

export default CommentForm

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  padding: 1rem;
  border-radius: 1.25rem;
  ${({ theme }) => theme.surfaces.claySoft}

  &[data-reply="true"] {
    margin-top: 0.75rem;
  }

  .who {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.625rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  input,
  textarea {
    width: 100%;
    padding: 0.625rem 1rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    ${({ theme }) => theme.surfaces.glass}

    ::placeholder {
      color: ${({ theme }) => theme.colors.gray11};
    }
    :focus {
      box-shadow: 0 0 0 3px ${({ theme }) => theme.surfaces.focusRing};
    }
  }
  input {
    border-radius: 9999px;
  }
  textarea {
    box-sizing: border-box;
    border-radius: 1rem;
    resize: vertical;
    min-height: 5rem;
  }

  .trap {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.8125rem;
  }

  .toggle {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    color: ${({ theme }) => theme.colors.gray11};

    .box {
      display: inline-flex;
      width: 1rem;
      height: 1rem;
      align-items: center;
      justify-content: center;
      font-size: 0.6875rem;
      border-radius: 0.3125rem;
      ${({ theme }) => theme.surfaces.glass}
    }
    &[aria-pressed="true"] {
      color: ${({ theme }) => theme.colors.gray12};
      .box {
        ${({ theme }) => theme.surfaces.activePill}
      }
    }
  }

  .count {
    margin-left: auto;
    color: ${({ theme }) => theme.colors.gray11};
    font-variant-numeric: tabular-nums;
  }

  .primary,
  .ghost {
    padding: 0.375rem 1rem;
    border-radius: 9999px;
    font-weight: 600;
  }
  .primary {
    ${({ theme }) => theme.surfaces.activePill}
    :disabled {
      opacity: 0.6;
      cursor: default;
    }
  }
  .ghost {
    ${({ theme }) => theme.surfaces.glass}
  }

  .error {
    font-size: 0.8125rem;
    color: ${({ theme }) => theme.colors.red11};
  }
`
