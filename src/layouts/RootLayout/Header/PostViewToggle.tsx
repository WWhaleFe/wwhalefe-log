import { getCookie } from "cookies-next"
import React, { useEffect } from "react"
import { MdViewAgenda, MdViewList } from "react-icons/md"
import usePostView, { POST_VIEW_COOKIE } from "src/hooks/usePostView"
import { animateFeedUpdate } from "src/libs/utils/viewTransition"
import HeaderIconButton from "./HeaderIconButton"

type Props = {}

const PostViewToggle: React.FC<Props> = () => {
  const [view, setView] = usePostView()
  const nextLabel =
    view === "large" ? "Show small thumbnails" : "Show large thumbnails"

  useEffect(() => {
    if (getCookie(POST_VIEW_COOKIE) === "small") setView("small")
  }, [])

  return (
    <HeaderIconButton
      type="button"
      aria-label={nextLabel}
      title={nextLabel}
      onClick={() =>
        animateFeedUpdate(() => setView(view === "large" ? "small" : "large"))
      }
    >
      {view === "large" ? <MdViewAgenda /> : <MdViewList />}
    </HeaderIconButton>
  )
}

export default PostViewToggle
