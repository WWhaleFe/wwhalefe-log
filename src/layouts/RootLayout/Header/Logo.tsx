import Link from "next/link"
import { CONFIG } from "site.config"
import styled from "@emotion/styled"

const Logo = () => {
  return (
    <StyledWrapper href="/" aria-label={CONFIG.blog.title}>
      {CONFIG.blog.title}
    </StyledWrapper>
  )
}

export default Logo

const StyledWrapper = styled(Link)`
  font-weight: 800;
  background: ${({ theme }) => theme.surfaces.brandText};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`
