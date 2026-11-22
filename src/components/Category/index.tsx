import React, { MouseEvent } from "react"
import { navigateWithTransition } from "src/libs/utils/viewTransition"
import { stripLeadingEmoji } from "src/libs/utils"
import { COLOR_SET } from "./constants"
import styled from "@emotion/styled"

export const getColorClassByName = (name: string): string => {
  try {
    let sum = 0
    name.split("").forEach((alphabet) => (sum = sum + alphabet.charCodeAt(0)))
    const colorKey = sum
      .toString(16)
      ?.[sum.toString(16).length - 1].toUpperCase()
    return COLOR_SET[colorKey]
  } catch {
    return COLOR_SET[0]
  }
}

type Props = {
  children: string
  readOnly?: boolean
}

const Category: React.FC<Props> = ({ readOnly = false, children }) => {
  // 글 카드 링크 안에 있으므로 카드의 글 이동이 함께 실행되지 않게 막는다
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (readOnly) return
    e.preventDefault()
    e.stopPropagation()
    navigateWithTransition(`/?category=${children}`)
  }
  return (
    <StyledWrapper
      onClick={handleClick}
      css={{ cursor: readOnly ? "default" : "pointer" }}
    >
      <span
        className="dot"
        css={{ backgroundColor: getColorClassByName(children) }}
      />
      {stripLeadingEmoji(children)}
    </StyledWrapper>
  )
}

export default Category

const StyledWrapper = styled.div`
  display: flex;
  height: 1.75rem;
  padding: 0 0.625rem;
  gap: 0.375rem;
  align-items: center;
  width: fit-content;
  border-radius: 9999px;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.gray12};
  ${({ theme }) => theme.surfaces.claySoft}

  .dot {
    flex: 0 0 auto;
    width: 0.4375rem;
    height: 0.4375rem;
    border-radius: 9999px;
  }
`
