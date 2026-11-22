import styled from "@emotion/styled"
import React, { ReactNode } from "react"

type Props = {
  children: ReactNode
  // 제목 옆에 붙는 개수. 모노 글꼴로 조용히 보여 준다
  count?: number
  className?: string
}

// 사이드 판 위의 작은 제목. 이모지 대신 글자와 개수만 둔다
const SectionTitle: React.FC<Props> = ({ children, count, className }) => (
  <StyledWrapper className={className}>
    <span className="label">{children}</span>
    {typeof count === "number" && <span className="count">{count}</span>}
  </StyledWrapper>
)

export default SectionTitle

const StyledWrapper = styled.div`
  display: flex;
  padding: 0 0.25rem;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
  align-items: center;

  .label {
    font-size: 0.9375rem;
    line-height: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray12};
  }

  .count {
    font-family: ${({ theme }) => theme.variables.monoFont};
    font-size: 0.75rem;
    line-height: 1rem;
    font-variant-numeric: tabular-nums;
    color: ${({ theme }) => theme.colors.gray10};
  }
`
