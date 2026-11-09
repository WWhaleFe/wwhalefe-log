import styled from "@emotion/styled"
import { getCookie } from "cookies-next"
import React, { useEffect } from "react"
import { MdViewAgenda, MdViewList } from "react-icons/md"
import usePostView, { POST_VIEW_COOKIE } from "src/hooks/usePostView"
import { animateFeedUpdate } from "src/libs/utils/viewTransition"

type Props = {}

const PostViewToggle: React.FC<Props> = () => {
  const [view, setView] = usePostView()
  const nextLabel =
    view === "large" ? "Show small thumbnails" : "Show large thumbnails"

  useEffect(() => {
    if (getCookie(POST_VIEW_COOKIE) === "small") setView("small")
  }, [])

  return (
    <StyledWrapper
      type="button"
      aria-label={nextLabel}
      title={nextLabel}
      onClick={() =>
        animateFeedUpdate(() => setView(view === "large" ? "small" : "large"))
      }
    >
      {view === "large" ? <MdViewAgenda /> : <MdViewList />}
    </StyledWrapper>
  )
}

export default PostViewToggle

const StyledWrapper = styled.button`
  display: flex;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  font-size: 1.125rem;
  color: ${({ theme }) => theme.colors.gray12};
  ${({ theme }) => theme.surfaces.claySoft}
  cursor: pointer;

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.surfaces.focusRing};
  }
`
