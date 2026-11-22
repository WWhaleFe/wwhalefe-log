import useDropdown from "src/hooks/useDropdown"
import { useRouter } from "next/router"
import React from "react"
import { MdExpandMore } from "react-icons/md"
import { DEFAULT_CATEGORY } from "src/constants"
import styled from "@emotion/styled"
import { useCategoriesQuery } from "src/hooks/useCategoriesQuery"
import { navigateWithTransition } from "src/libs/utils/viewTransition"
import { stripLeadingEmoji } from "src/libs/utils"

type Props = {}

const CategorySelect: React.FC<Props> = () => {
  const router = useRouter()
  const data = useCategoriesQuery()
  const [dropdownRef, opened, handleOpen] = useDropdown()

  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY

  const handleOptionClick = (category: string) => {
    navigateWithTransition({
      query: {
        ...router.query,
        category,
      },
    })
  }
  return (
    <StyledWrapper>
      <div ref={dropdownRef} className="wrapper" onClick={handleOpen}>
        <span className="name">{stripLeadingEmoji(currentCategory)} Posts</span>
        <span className="badge">{data[currentCategory] ?? 0}</span>
        <MdExpandMore className="chevron" />
      </div>
      {opened && (
        <div className="content">
          {Object.keys(data).map((key, idx) => (
            <div
              className="item"
              data-active={key === currentCategory}
              key={idx}
              onClick={() => handleOptionClick(key)}
            >
              <span>{stripLeadingEmoji(key)}</span>
              <span className="n">{data[key]}</span>
            </div>
          ))}
        </div>
      )}
    </StyledWrapper>
  )
}

export default CategorySelect

const StyledWrapper = styled.div`
  position: relative;
  > .wrapper {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    cursor: pointer;

    .name {
      font-size: 1.5rem;
      line-height: 2rem;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    /* 영상의 "Needs you 3" 처럼 개수 하나만 라임으로 띄운다 */
    .badge {
      display: inline-flex;
      min-width: 1.5rem;
      height: 1.5rem;
      padding: 0 0.4375rem;
      justify-content: center;
      align-items: center;
      border-radius: 9999px;
      font-family: ${({ theme }) => theme.variables.monoFont};
      font-size: 0.75rem;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: ${({ theme }) => theme.surfaces.accentText};
      background: ${({ theme }) => theme.surfaces.accent};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.surfaces.hairline};
    }

    .chevron {
      width: 1.25rem;
      height: 1.25rem;
      color: ${({ theme }) => theme.colors.gray10};
    }
  }
  > .content {
    position: absolute;
    top: calc(100% + 0.5rem);
    z-index: 40;
    min-width: 13rem;
    padding: 0.375rem;
    border-radius: 1.25rem;
    color: ${({ theme }) => theme.colors.gray12};
    ${({ theme }) => theme.surfaces.glassStrong}
    > .item {
      display: flex;
      padding: 0.5rem 0.75rem;
      gap: 1rem;
      justify-content: space-between;
      align-items: center;
      border-radius: 0.875rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      white-space: nowrap;
      cursor: pointer;

      .n {
        font-family: ${({ theme }) => theme.variables.monoFont};
        font-size: 0.75rem;
        font-variant-numeric: tabular-nums;
        color: ${({ theme }) => theme.colors.gray10};
      }

      :hover {
        ${({ theme }) => theme.surfaces.hover}
      }
      &[data-active="true"] {
        font-weight: 600;
      }
    }
  }
`
