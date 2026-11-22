import { useEffect, useRef } from "react"
import { useRouter } from "next/router"

const useVisitTracker = () => {
  const router = useRouter()
  const lastPath = useRef<string | null>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    const track = () => {
      const path = window.location.pathname
      const first = firstRender.current
      firstRender.current = false
      const notrack = new URLSearchParams(window.location.search).get("notrack")
      let excluded = notrack === "1"
      try {
        if (notrack === "1") localStorage.setItem("wl_notrack", "1")
        if (notrack === "0") localStorage.removeItem("wl_notrack")
        excluded = localStorage.getItem("wl_notrack") === "1"
      } catch {
        // 저장소를 쓸 수 없어도 현재 주소의 제외 설정은 따른다
      }
      if (excluded || lastPath.current === path) return

      let landing = first
      try {
        landing = sessionStorage.getItem("wl_visit_started") !== "1"
        sessionStorage.setItem("wl_visit_started", "1")
      } catch {
        // 저장소 접근 실패 시 첫 렌더에서만 첫 페이지로 보낸다
      }
      const referrer =
        lastPath.current === null
          ? document.referrer
          : window.location.origin + lastPath.current
      lastPath.current = path
      const json = JSON.stringify({ path, referrer, landing })
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            "/api/visit",
            new Blob([json], { type: "application/json" })
          )
        } else {
          void fetch("/api/visit", {
            method: "POST",
            keepalive: true,
            headers: { "Content-Type": "application/json" },
            body: json,
          }).catch(() => {})
        }
      } catch {
        // 방문 기록 전송 실패는 화면에 영향을 주지 않는다
      }
    }

    track()
    router.events.on("routeChangeComplete", track)
    return () => router.events.off("routeChangeComplete", track)
  }, [router.events])
}

export default useVisitTracker
