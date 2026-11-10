import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React, { useEffect, useRef, useState } from "react"
import usePostsQuery from "src/hooks/usePostsQuery"
import { ALL_TAG } from "src/constants"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import { animateUpdate } from "src/libs/utils/viewTransition"
import PostTitleList from "./PostTitleList"

const ALL_TAGS = ""

// 메인과 글 상세는 레이아웃이 새로 그려지므로 고른 태그를 여기에 남겨 둔다
let lastSelectedTag = ALL_TAGS

type Props = {}

const AllPostsList: React.FC<Props> = () => {
  const router = useRouter()
  const posts = usePostsQuery()
  const tags = useTagsQuery()
  const [selected, setSelected] = useState(lastSelectedTag)

  const select = (tag: string) => {
    lastSelectedTag = tag
    setSelected(tag)
  }

  // 메인에서 태그 칩을 고르거나 해제하면 드롭다운도 함께 바꾼다
  const currentTag = `${router.query.tag || ``}`
  const prevTag = useRef(ALL_TAGS)
  useEffect(() => {
    if (prevTag.current === currentTag) return
    prevTag.current = currentTag
    select(currentTag)
  }, [currentTag])

  const tagNames = Object.keys(tags).filter((tag) => tag !== ALL_TAG)
  const selectedTag = tagNames.includes(selected) ? selected : ALL_TAGS
  const visiblePosts = selectedTag
    ? posts.filter((post) => post.tags?.includes(selectedTag))
    : posts

  return (
    <PostTitleList
      posts={visiblePosts}
      control={
        <StyledSelect
          aria-label="Filter posts by tag"
          value={selectedTag}
          onChange={(e) => {
            const tag = e.target.value
            animateUpdate(() => select(tag))
          }}
        >
          <option value={ALL_TAGS}>All tags ({posts.length})</option>
          {tagNames.map((tag) => (
            <option key={tag} value={tag}>
              {tag} ({tags[tag]})
            </option>
          ))}
        </StyledSelect>
      }
    />
  )
}

export default AllPostsList

const StyledSelect = styled.select`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.colors.gray12};
  cursor: pointer;
  ${({ theme }) => theme.surfaces.glass}

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.surfaces.focusRing};
  }

  option {
    color: ${({ theme }) => theme.colors.gray12};
    background: ${({ theme }) => theme.surfaces.pageColor};
  }
`
