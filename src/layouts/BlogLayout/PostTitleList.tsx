import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { ReactNode } from "react"
import { CONFIG } from "site.config"
import { Emoji } from "src/components/Emoji"
import { formatDate } from "src/libs/utils"
import { TPost } from "src/types"

type Props = {
  emoji: string
  title: string
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
      <div className="top">
        <Emoji>{emoji}</Emoji> {title}
      </div>
      {control}
      <div className="list">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.slug}`}
            data-active={post.slug === currentSlug}
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
  margin-bottom: 1.5rem;

  .top {
    padding: 0.25rem;
    margin-bottom: 0.75rem;
  }

  .list {
    display: flex;
    padding: 0.5rem;
    flex-direction: column;
    gap: 0.125rem;
    border-radius: 1.5rem;
    ${({ theme }) => theme.surfaces.glass}

    a {
      display: block;
      padding: 0.5rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: ${({ theme }) => theme.colors.gray12};
      cursor: pointer;

      :hover {
        ${({ theme }) => theme.surfaces.hover}
      }
      &[data-active="true"] {
        ${({ theme }) => theme.surfaces.activePill}

        .date {
          color: inherit;
        }
      }
    }

    .title {
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }

    .date {
      display: block;
      margin-top: 0.125rem;
      font-size: 0.75rem;
      line-height: 1rem;
      color: ${({ theme }) => theme.colors.gray11};
    }
  }
`
