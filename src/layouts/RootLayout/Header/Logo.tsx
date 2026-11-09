import Link from "next/link"
import { useEffect, useState } from "react"
import { CONFIG } from "site.config"
import styled from "@emotion/styled"

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
    >
      {CONFIG.blog.title}
    </StyledWrapper>
  )
}

export default Logo

const StyledWrapper = styled(Link)`
  font-size: 1rem;
  font-weight: 800;
  background: ${({ theme }) => theme.surfaces.brandText};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: font-size 0.2s ease;

  &[data-at-top="true"] {
    font-size: 1.125rem;

    @media (min-width: 380px) {
      font-size: 1.25rem;
    }

    @media (min-width: 768px) {
      font-size: 1.75rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`
