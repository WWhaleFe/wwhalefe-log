import Router from "next/router"
import { useEffect } from "react"
import {
  canAnimateTransition,
  handlePopState,
} from "src/libs/utils/viewTransition"

const useViewTransitionEffect = () => {
  useEffect(() => {
    if (!canAnimateTransition()) return

    // 뒤로 가기의 스크롤은 전환 안에서 직접 복원한다
    const restoreDefaultScroll = () => {
      window.history.scrollRestoration = "auto"
    }

    window.history.scrollRestoration = "manual"
    Router.beforePopState(handlePopState)
    window.addEventListener("pagehide", restoreDefaultScroll)

    return () => {
      restoreDefaultScroll()
      Router.beforePopState(() => true)
      window.removeEventListener("pagehide", restoreDefaultScroll)
    }
  }, [])
}

export default useViewTransitionEffect
