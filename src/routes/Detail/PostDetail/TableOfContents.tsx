import styled from "@emotion/styled"
import { PageBlock } from "notion-types"
import { getPageTableOfContents } from "notion-utils"
import React from "react"
import SectionTitle from "src/components/SectionTitle"
import { stripLeadingEmoji } from "src/libs/utils"
import usePostQuery from "src/hooks/usePostQuery"

const MIN_HEADINGS = 2

const TableOfContents: React.FC = () => {
  const data = usePostQuery()
  if (!data) return null

  const page = Object.values(data.recordMap.block)[0]?.value as PageBlock
  const headings = getPageTableOfContents(page, data.recordMap)
  if (headings.length < MIN_HEADINGS) return null

  return (
    <StyledWrapper aria-label="On this page">
      <SectionTitle>On this page</SectionTitle>
      <div className="list">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id.replace(/-/g, "")}`}
            style={{ paddingLeft: `${0.75 + heading.indentLevel * 0.75}rem` }}
          >
            {stripLeadingEmoji(heading.text)}
          </a>
        ))}
      </div>
    </StyledWrapper>
  )
}

export default TableOfContents

const StyledWrapper = styled.nav`
  margin-bottom: 2.25rem;

  .list {
    display: flex;
    padding: 0.5rem;
    flex-direction: column;
    gap: 0.125rem;
    border-radius: 1.5rem;
    ${({ theme }) => theme.surfaces.glass}

    a {
      display: block;
      padding: 0.375rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.8125rem;
      line-height: 1.125rem;
      color: ${({ theme }) => theme.colors.gray12};
      cursor: pointer;
      transition: background-color 150ms ${({ theme }) => theme.variables.easing};

      :hover {
        ${({ theme }) => theme.surfaces.hover}
      }
    }
  }
`
