import Link from "next/link"
import { useEffect, useState } from "react"
import { CONFIG } from "site.config"
import styled from "@emotion/styled"
import { handleLinkClick } from "src/libs/utils/viewTransition"

const SCROLL_TOP_THRESHOLD = 8

const Logo = () => {
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY < SCROLL_TOP_THRESHOLD)

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <StyledWrapper
      href="/"
      aria-label={CONFIG.blog.title}
      data-at-top={isAtTop}
      onClick={handleLinkClick}
    >
      <span className="mark" aria-hidden />
      {CONFIG.blog.title}
    </StyledWrapper>
  )
}

export default Logo

const StyledWrapper = styled(Link)`
  view-transition-name: site-logo;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.gray12};
  transition: font-size 0.2s ${({ theme }) => theme.variables.easing};

  /* 로고 앞 라임 표시등: 사이트 전체에서 라임은 이 점과 개수 배지에만 쓴다 */
  .mark {
    flex: 0 0 auto;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 9999px;
    background: ${({ theme }) => theme.surfaces.accent};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.surfaces.hairline};
  }

  &[data-at-top="true"] {
    font-size: 1.125rem;

    @media (min-width: 768px) {
      font-size: 1.375rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
