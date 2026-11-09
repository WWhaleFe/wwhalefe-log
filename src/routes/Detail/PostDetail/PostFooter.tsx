import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"

type Props = {}

const Footer: React.FC<Props> = () => {
  const router = useRouter()
  return (
    <StyledWrapper>
      <a onClick={() => router.push("/")}>← Back</a>
      <a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        ↑ Top
      </a>
    </StyledWrapper>
  )
}

export default Footer

const StyledWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray12};
  a {
    margin-top: 1rem;
    padding: 0.375rem 1rem;
    border-radius: 9999px;
    cursor: pointer;
    ${({ theme }) => theme.surfaces.claySoft}

    :hover {
      ${({ theme }) => theme.surfaces.activePill}
    }
  }
`
