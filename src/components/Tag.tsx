import styled from "@emotion/styled"
import React, { MouseEvent } from "react"
import { navigateWithTransition } from "src/libs/utils/viewTransition"

type Props = {
  children: string
}

const Tag: React.FC<Props> = ({ children }) => {
  // 글 카드 링크 안에 있으므로 카드의 글 이동이 함께 실행되지 않게 막는다
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    navigateWithTransition(`/?tag=${children}`)
  }
  return <StyledWrapper onClick={handleClick}>{children}</StyledWrapper>
}

export default Tag

const StyledWrapper = styled.div`
  padding: 0.1875rem 0.5rem;
  border-radius: 0.5rem;
  font-family: ${({ theme }) => theme.variables.monoFont};
  font-size: 0.75rem;
  line-height: 1rem;
  color: ${({ theme }) => theme.colors.gray11};
  ${({ theme }) => theme.surfaces.claySoft}
  cursor: pointer;
  transition: color 150ms ${({ theme }) => theme.variables.easing};

  ::before {
    content: "#";
    color: ${({ theme }) => theme.colors.gray9};
  }

  :hover {
    color: ${({ theme }) => theme.colors.gray12};
  }
`
