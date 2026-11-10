import styled from "@emotion/styled"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { MdChevronLeft, MdChevronRight, MdHome } from "react-icons/md"
import usePostsQuery from "src/hooks/usePostsQuery"
import { handleLinkClick } from "src/libs/utils/viewTransition"
import { zIndexes } from "src/styles/zIndexes"
import { TPost } from "src/types"
import { getAdjacentPosts } from "./PostNavigation"

type Props = {
  data: TPost
}

const FloatingPostNav: React.FC<Props> = ({ data }) => {
  const posts = usePostsQuery()
  const { older, newer } = getAdjacentPosts(posts, data.slug)
  const [isPagerVisible, setIsPagerVisible] = useState(false)

  // 본문 끝의 이전·다음 글이 보이면 겹치지 않게 숨긴다
  useEffect(() => {
    const pager = document.querySelector("[data-post-pager]")
    if (!pager) return

    const observer = new IntersectionObserver(([entry]) =>
      setIsPagerVisible(entry.isIntersecting)
    )
    observer.observe(pager)
    return () => observer.disconnect()
  }, [data.slug])

  return (
    <StyledWrapper aria-label="Post navigation" data-hidden={isPagerVisible}>
      {older ? (
        <Link href={`/${older.slug}`} onClick={handleLinkClick}>
          <MdChevronLeft aria-hidden />
          <span className="text">
            <span className="label">Previous</span>
            <span className="title">{older.title}</span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      <Link
        href="/"
        className="home"
        aria-label="Blog home"
        title="Blog home"
        onClick={handleLinkClick}
      >
        <MdHome aria-hidden />
      </Link>
      {newer ? (
        <Link
          href={`/${newer.slug}`}
          data-align="right"
          onClick={handleLinkClick}
        >
          <span className="text">
            <span className="label">Next</span>
            <span className="title">{newer.title}</span>
          </span>
          <MdChevronRight aria-hidden />
        </Link>
      ) : (
        <span />
      )}
    </StyledWrapper>
  )
}

export default FloatingPostNav

const StyledWrapper = styled.nav`
  view-transition-name: post-floating-nav;
  position: fixed;
  left: 50%;
  bottom: calc(1rem + env(safe-area-inset-bottom));
  z-index: ${zIndexes.header};
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: 0.25rem;
  width: min(40rem, calc(100% - 2rem));
  padding: 0.375rem;
  border-radius: 9999px;
  transform: translateX(-50%);
  transition: opacity 0.2s ease, transform 0.2s ease;
  ${({ theme }) => theme.surfaces.glassStrong}

  &[data-hidden="true"] {
    opacity: 0;
    transform: translate(-50%, 1rem);
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  a {
    display: flex;
    min-width: 0;
    padding: 0.375rem 0.75rem;
    gap: 0.375rem;
    align-items: center;
    border-radius: 9999px;
    color: ${({ theme }) => theme.colors.gray12};
    cursor: pointer;

    :hover {
      ${({ theme }) => theme.surfaces.hover}
    }

    &[data-align="right"] {
      justify-content: flex-end;
      text-align: right;
    }

    svg {
      flex-shrink: 0;
      font-size: 1.375rem;
    }
  }

  a.home {
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    justify-content: center;
    ${({ theme }) => theme.surfaces.claySoft}

    svg {
      font-size: 1.25rem;
    }
  }

  .text {
    display: flex;
    min-width: 0;
    flex-direction: column;
  }

  .label {
    font-size: 0.6875rem;
    line-height: 0.875rem;
    color: ${({ theme }) => theme.colors.gray11};
  }

  /* 제목은 끝을 흐리게 잘라 살짝만 보이게 한다 */
  .title {
    overflow: hidden;
    font-size: 0.8125rem;
    line-height: 1.125rem;
    font-weight: 600;
    white-space: nowrap;
    -webkit-mask-image: linear-gradient(90deg, #000 70%, transparent);
    mask-image: linear-gradient(90deg, #000 70%, transparent);
  }
`
