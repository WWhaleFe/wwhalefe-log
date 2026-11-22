import Link from "next/link"
import { CONFIG } from "site.config"
import { formatDate } from "src/libs/utils"
import Tag from "../../../components/Tag"
import { TPost } from "../../../types"
import Image from "next/image"
import Category from "../../../components/Category"
import styled from "@emotion/styled"
import usePostView from "src/hooks/usePostView"
import { handleLinkClick } from "src/libs/utils/viewTransition"

type Props = {
  data: TPost
}

const PostCard: React.FC<Props> = ({ data }) => {
  const category = (data.category && data.category?.[0]) || undefined
  const [view] = usePostView()

  return (
    <StyledWrapper
      href={`/${data.slug}`}
      data-view={view}
      onClick={handleLinkClick}
    >
      <article data-post-id={data.id}>
        {category && (
          <div className="category">
            <Category>{category}</Category>
          </div>
        )}
        {data.thumbnail && (
          <div className="thumbnail">
            <Image
              src={data.thumbnail}
              fill
              unoptimized
              alt={data.title}
              css={{ objectFit: "cover" }}
            />
          </div>
        )}
        <div data-thumb={!!data.thumbnail} data-category={!!category} className="content">
          <header className="top">
            <h2>{data.title}</h2>
          </header>
          <div className="date">
            <div className="content">
              {formatDate(
                data?.date?.start_date || data.createdTime,
                CONFIG.lang
              )}
            </div>
          </div>
          <div className="summary">
            <p>{data.summary}</p>
          </div>
          <div className="tags">
            {data.tags &&
              data.tags.map((tag: string, idx: number) => (
                <Tag key={idx}>{tag}</Tag>
              ))}
          </div>
        </div>
      </article>
    </StyledWrapper>
  )
}

export default PostCard

const StyledWrapper = styled(Link)`
  display: block;
  border-radius: 1.75rem;

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.surfaces.focusRing};
    outline-offset: 2px;
  }

  article {
    overflow: hidden;
    position: relative;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 1.75rem;
    ${({ theme }) => theme.surfaces.clay}
    transition-property: transform, box-shadow;
    transition-timing-function: ${({ theme }) => theme.variables.easing};
    transition-duration: 200ms;

    @media (min-width: 768px) {
      margin-bottom: 1.25rem;
    }

    :hover {
      transform: translateY(-2px);
      ${({ theme }) => theme.surfaces.clayRaised}
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
      :hover {
        transform: none;
      }
    }
    > .category {
      position: absolute;
      top: 1.25rem;
      left: 1.25rem;
      z-index: 10;
    }

    /* 썸네일은 판 안쪽에 한 겹 들어간 칸. 바깥 28 - 안쪽 여백 8 = 20 */
    > .thumbnail {
      position: relative;
      overflow: hidden;
      width: 100%;
      border-radius: 1.25rem;
      ${({ theme }) => theme.surfaces.hatch}
      padding-bottom: 56%;

      @media (min-width: 1024px) {
        padding-bottom: 46%;
      }

      @media (min-width: 1280px) {
        padding-bottom: 40%;
      }
    }
    > .content {
      padding: 1rem 0.75rem 0.75rem;

      &[data-thumb="false"] {
        padding-top: 3.25rem;
      }
      &[data-category="false"] {
        padding-top: 1rem;
      }
      > .top {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        @media (min-width: 768px) {
          flex-direction: row;
          align-items: baseline;
        }
        h2 {
          margin-bottom: 0.375rem;
          font-size: 1.125rem;
          line-height: 1.625rem;
          font-weight: 600;
          color: ${({ theme }) => theme.colors.gray12};
          cursor: pointer;

          @media (min-width: 768px) {
            font-size: 1.25rem;
            line-height: 1.75rem;
          }
        }
      }
      > .date {
        display: flex;
        margin-bottom: 0.75rem;
        gap: 0.5rem;
        align-items: center;
        .content {
          font-family: ${({ theme }) => theme.variables.monoFont};
          font-size: 0.75rem;
          line-height: 1rem;
          font-variant-numeric: tabular-nums;
          color: ${({ theme }) => theme.colors.gray10};
        }
      }
      > .summary {
        margin-bottom: 1rem;
        p {
          display: none;
          margin: 0;
          font-size: 0.9375rem;
          line-height: 1.625rem;
          color: ${({ theme }) => theme.colors.gray11};

          @media (min-width: 768px) {
            display: -webkit-box;
            overflow: hidden;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
          }
        }
      }
      > .tags {
        display: flex;
        flex-wrap: wrap;
        width: fit-content;
        gap: 0.375rem;
      }
    }
  }

  &[data-view="small"] article {
    display: flex;
    margin-bottom: 0.75rem;
    border-radius: 1.5rem;

    > .category {
      top: 1rem;
      left: 1rem;

      @media (max-width: 767px) {
        display: none;
      }
    }

    > .thumbnail {
      flex: 0 0 6.5rem;
      padding-bottom: 0;
      border-radius: 1rem;

      @media (min-width: 768px) {
        flex-basis: 13rem;
      }
    }

    > .content {
      flex: 1;
      min-width: 0;
      padding: 0.5rem 0.75rem;

      @media (min-width: 768px) {
        &[data-thumb="false"][data-category="true"] {
          padding-top: 2.75rem;
        }
      }

      > .top h2 {
        margin-bottom: 0.25rem;
        font-size: 1rem;
        line-height: 1.5rem;
      }

      > .date {
        margin-bottom: 0.5rem;
      }

      > .summary {
        margin-bottom: 0.5rem;

        p {
          font-size: 0.875rem;
          line-height: 1.375rem;

          @media (min-width: 768px) {
            -webkit-line-clamp: 2;
          }
        }
      }
    }
  }
`
