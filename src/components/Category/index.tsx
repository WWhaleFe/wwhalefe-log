import React, { MouseEvent } from "react"
import { navigateWithTransition } from "src/libs/utils/viewTransition"
import { COLOR_SET } from "./constants"
import styled from "@emotion/styled"
import { colors } from "src/styles"

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
      css={{
        backgroundColor: getColorClassByName(children),
        cursor: readOnly ? "default" : "pointer",
      }}
    >
      {children}
    </StyledWrapper>
  )
}

export default Category

const StyledWrapper = styled.div`
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  border-radius: 9999px;
  width: fit-content;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: ${colors.dark.gray1};
  ${({ theme }) => theme.surfaces.chipShadow}
`
