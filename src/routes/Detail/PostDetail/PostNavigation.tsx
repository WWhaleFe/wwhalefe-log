import styled from "@emotion/styled"
import Link from "next/link"
import React from "react"
import { CONFIG } from "site.config"
import usePostsQuery from "src/hooks/usePostsQuery"
import { formatDate } from "src/libs/utils"
import { handlePostLinkClick } from "src/libs/utils/viewTransition"
import { TPost } from "src/types"

const RELATED_POST_COUNT = 3
const CATEGORY_WEIGHT = 2

const getRelatedScore = (post: TPost, current: TPost) => {
  const sharedTags =
    post.tags?.filter((tag) => current.tags?.includes(tag)).length ?? 0
  const sameCategory = post.category?.[0] === current.category?.[0]
  return sharedTags + (sameCategory ? CATEGORY_WEIGHT : 0)
}

type Props = {
  data: TPost
}

const PostNavigation: React.FC<Props> = ({ data }) => {
  const posts = usePostsQuery()
  const index = posts.findIndex((post) => post.slug === data.slug)
  const newer = index > 0 ? posts[index - 1] : undefined
  const older = index >= 0 ? posts[index + 1] : undefined

  const related = posts
    .filter((post) => post.slug !== data.slug)
    .map((post) => ({ post, score: getRelatedScore(post, data) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, RELATED_POST_COUNT)
    .map(({ post }) => post)

  return (
    <StyledWrapper>
      {(newer || older) && (
        <div className="pager">
          {older ? (
            <Link href={`/${older.slug}`} onClick={handlePostLinkClick}>
              <span className="label">← Previous</span>
              <span className="title">{older.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {newer ? (
            <Link
              href={`/${newer.slug}`}
              data-align="right"
              onClick={handlePostLinkClick}
            >
              <span className="label">Next →</span>
              <span className="title">{newer.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
      {related.length > 0 && (
        <div className="related">
          <div className="heading">Related Posts</div>
          {related.map((post) => (
            <Link
              key={post.slug}
              href={`/${post.slug}`}
              onClick={handlePostLinkClick}
            >
              <span className="title">{post.title}</span>
              <span className="label">
                {formatDate(
                  post.date?.start_date || post.createdTime,
                  CONFIG.lang
                )}
              </span>
            </Link>
          ))}
        </div>
      )}
    </StyledWrapper>
  )
}

export default PostNavigation

const StyledWrapper = styled.div`
  margin-top: 2.5rem;

  a {
    display: block;
    padding: 0.75rem 1rem;
    border-radius: 1.25rem;
    cursor: pointer;
    ${({ theme }) => theme.surfaces.claySoft}
    transition: transform 150ms ease;

    :hover {
      transform: translateY(-2px);
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
      :hover {
        transform: none;
      }
    }
  }

  .label {
    display: block;
    font-size: 0.75rem;
    line-height: 1rem;
    color: ${({ theme }) => theme.colors.gray11};
  }

  .title {
    display: block;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 600;
  }

  .pager {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.75rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    a[data-align="right"] {
      text-align: right;
    }
  }

  .related {
    display: flex;
    margin-top: 2rem;
    flex-direction: column;
    gap: 0.75rem;

    .heading {
      font-size: 1.125rem;
      line-height: 1.75rem;
      font-weight: 800;
    }
  }
`
