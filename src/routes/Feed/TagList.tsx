import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import { Emoji } from "src/components/Emoji"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import { navigateWithTransition } from "src/libs/utils/viewTransition"

type Props = {}

const TagList: React.FC<Props> = () => {
  const router = useRouter()
  const currentTag = router.query.tag || undefined
  const data = useTagsQuery()

  const handleClickTag = (value: any) => {
    // 글 상세 화면에서는 태그로 걸러진 메인 목록으로 이동한다
    if (router.pathname !== "/") {
      navigateWithTransition(`/?tag=${value}`)
      return
    }

    // delete
    if (currentTag === value) {
      navigateWithTransition({
        query: {
          ...router.query,
          tag: undefined,
        },
      })
    }
    // add
    else {
      navigateWithTransition({
        query: {
          ...router.query,
          tag: value,
        },
      })
    }
  }

  return (
    <StyledWrapper>
      <div className="top">
        <Emoji>🏷️</Emoji> Tags
      </div>
      <div className="list">
        {Object.keys(data).map((key) => (
          <a
            key={key}
            data-active={key === currentTag}
            onClick={() => handleClickTag(key)}
          >
            {key}
          </a>
        ))}
      </div>
    </StyledWrapper>
  )
}

export default TagList

const StyledWrapper = styled.div`
  .top {
    display: none;
    padding: 0.25rem;
    margin-bottom: 0.75rem;

    @media (min-width: 1024px) {
      display: block;
    }
  }

  .list {
    display: flex;
    margin-bottom: 1.5rem;
    gap: 0.5rem;
    padding: 0.25rem 0.25rem 0.75rem;
    overflow: scroll;

    scrollbar-width: none;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    @media (min-width: 1024px) {
      flex-wrap: wrap;
      overflow: visible;
      padding: 0.75rem;
      border-radius: 1.5rem;
      ${({ theme }) => theme.surfaces.glass}
    }

    a {
      display: block;
      padding: 0.25rem;
      padding-left: 1rem;
      padding-right: 1rem;
      margin-top: 0.25rem;
      margin-bottom: 0.25rem;
      border-radius: 0.75rem;
      font-size: 0.875rem;
      line-height: 1.25rem;
      color: ${({ theme }) => theme.colors.gray12};
      flex-shrink: 0;
      cursor: pointer;

      :hover {
        ${({ theme }) => theme.surfaces.hover}
      }
      &[data-active="true"] {
        ${({ theme }) => theme.surfaces.activePill}
      }
    }
  }
`
