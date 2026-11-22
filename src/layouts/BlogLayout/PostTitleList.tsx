import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { ReactNode } from "react"
import { CONFIG } from "site.config"
import SectionTitle from "src/components/SectionTitle"
import { formatDate } from "src/libs/utils"
import { handleLinkClick } from "src/libs/utils/viewTransition"
import { TPost } from "src/types"

type Props = {
  emoji?: string
  title?: string
  posts: TPost[]
  showDate?: boolean
  control?: ReactNode
}

const PostTitleList: React.FC<Props> = ({
  emoji,
  title,
  posts,
  showDate = false,
  control,
}) => {
  const router = useRouter()
  const currentSlug = router.query.slug

  if (posts.length === 0) return null

  return (
    <StyledWrapper>
      {title && <SectionTitle>{title}</SectionTitle>}
      {control}
      <div className="list" data-text-list={control ? true : undefined}>
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.slug}`}
            data-active={post.slug === currentSlug}
            data-post-id={post.id}
            onClick={handleLinkClick}
          >
            <span className="title">{post.title}</span>
            {showDate && (
              <span className="date">
                {formatDate(
                  post.date?.start_date || post.createdTime,
                  CONFIG.lang
                )}
              </span>
            )}
          </Link>
        ))}
      </div>
    </StyledWrapper>
  )
}

export default PostTitleList

const StyledWrapper = styled.div`
  margin-bottom: 2rem;

  .list {
    display: flex;
    padding: 0.5rem;
    flex-direction: column;
    gap: 0.375rem;
    border-radius: 1.5rem;
    ${({ theme }) => theme.surfaces.glass}

    a {
      display: block;
      padding: 0.625rem 0.75rem;
      border: 1px solid transparent;
      border-radius: 1rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: ${({ theme }) => theme.colors.gray12};
      cursor: pointer;
      transition-property: background-color, border-color, box-shadow;
      transition-duration: 150ms;
      transition-timing-function: ${({ theme }) => theme.variables.easing};

      :hover {
        ${({ theme }) => theme.surfaces.claySoft}
      }

      :focus-visible {
        outline: 2px solid ${({ theme }) => theme.surfaces.focusRing};
        outline-offset: 1px;
      }

      &[data-active="true"] {
        ${({ theme }) => theme.surfaces.claySoft}
        box-shadow: 0 0 0 2px ${({ theme }) => theme.surfaces.accent};
      }
    }

    /* 최근 글처럼 짧은 목록은 대기열 카드처럼 사선 무늬 칸으로 보인다 */
    &:not([data-text-list]) a:not(:hover):not([data-active="true"]) {
      ${({ theme }) => theme.surfaces.hatch}
    }

    .title {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .date {
      display: block;
      margin-top: 0.25rem;
      font-family: ${({ theme }) => theme.variables.monoFont};
      font-size: 0.75rem;
      line-height: 1rem;
      font-variant-numeric: tabular-nums;
      color: ${({ theme }) => theme.colors.gray10};
    }
  }
`
