import { CONFIG } from "site.config"
import React from "react"
import styled from "@emotion/styled"

const d = new Date()
const y = d.getFullYear()
const from = +CONFIG.since

type Props = {
  className?: string
}

const Footer: React.FC<Props> = ({ className }) => {
  return (
    <StyledWrapper className={className}>
      <a
        href={`https://github.com/${CONFIG.profile.github}`}
        target="_blank"
        rel="noreferrer"
      >
        © {CONFIG.profile.name} {from === y || !from ? y : `${from} - ${y}`}
      </a>
    </StyledWrapper>
  )
}

export default Footer

const StyledWrapper = styled.div`
  a {
    display: block;
    padding: 0 0.25rem;
    font-family: ${({ theme }) => theme.variables.monoFont};
    font-size: 0.75rem;
    line-height: 1rem;
    color: ${({ theme }) => theme.colors.gray10};
  }
`
