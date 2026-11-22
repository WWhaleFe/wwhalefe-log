import styled from "@emotion/styled"
import React from "react"

type Props = {}

const CustomError: React.FC<Props> = () => {
  return (
    <StyledWrapper>
      <div className="wrapper">
        <div className="top">404</div>
        <div className="text">글을 찾을 수 없습니다</div>
      </div>
    </StyledWrapper>
  )
}

export default CustomError

const StyledWrapper = styled.div`
  margin: 0 auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 3rem;
  padding-bottom: 3rem;
  border-radius: 1.5rem;
  max-width: 56rem;
  .wrapper {
    display: flex;
    padding-top: 5rem;
    padding-bottom: 5rem;
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    > .top {
      padding: 1.5rem 2.5rem;
      border: ${({ theme }) => theme.surfaces.dashed};
      border-radius: 1.75rem;
      font-family: ${({ theme }) => theme.variables.monoFont};
      font-size: 3.75rem;
      line-height: 1;
      letter-spacing: 0.04em;
      color: ${({ theme }) => theme.colors.gray12};
      ${({ theme }) => theme.surfaces.hatch}
    }
    > .text {
      font-size: 1.25rem;
      line-height: 1.75rem;
      color: ${({ theme }) => theme.colors.gray11};
    }
  }
`
