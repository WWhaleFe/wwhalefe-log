import Router from "next/router"
import { MouseEvent } from "react"

type ViewTransition = {
  ready: Promise<void>
  finished: Promise<void>
}

type TransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => ViewTransition
}

const POST_BOX = "post-box"
const POST_THUMB = "post-thumb"
const NAME_PROPERTY = "view-transition-name"
const PREFETCH_TIMEOUT = 1000
const MAX_MORPH_SCROLL = 200

const scrollPositions = new Map<string, number>()
const styledElements = new Set<HTMLElement>()

export const canAnimateTransition = () =>
  !!(document as TransitionDocument).startViewTransition &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches

const setStyle = (element: HTMLElement, property: string, value: string) => {
  element.style.setProperty(property, value)
  styledElements.add(element)
}

const clearStyles = () => {
  styledElements.forEach((element) => {
    element.style.removeProperty(NAME_PROPERTY)
    element.style.removeProperty("max-height")
    element.style.removeProperty("overflow")
  })
  styledElements.clear()
}

const getPostBox = () => document.querySelector<HTMLElement>("[data-post-box]")

const findPostCard = (path: string) =>
  Array.from(document.querySelectorAll<HTMLElement>(".mid a[href]"))
    .find((link) => link.getAttribute("href") === path)
    ?.querySelector<HTMLElement>("article")

const nameAsPostBox = (element?: HTMLElement | null) => {
  if (!element) return
  setStyle(element, NAME_PROPERTY, POST_BOX)

  const thumbnail = element.querySelector<HTMLElement>(".thumbnail")
  if (thumbnail) setStyle(thumbnail, NAME_PROPERTY, POST_THUMB)
}

// 긴 글은 화면에 보이는 높이까지만 변형되도록 전환 동안 박스를 잘라 둔다
const clampPostBox = () => {
  const box = getPostBox()
  if (!box) return
  setStyle(box, "max-height", `${window.innerHeight + window.scrollY}px`)
  setStyle(box, "overflow", "hidden")
}

// 많이 내려 읽던 글은 변형 없이 사라지게 한다
const prepareLeavingPost = () => {
  const box = getPostBox()
  if (!box) return
  if (window.scrollY <= MAX_MORPH_SCROLL) {
    clampPostBox()
    return
  }

  setStyle(box, NAME_PROPERTY, "none")
  const thumbnail = box.querySelector<HTMLElement>(".thumbnail")
  if (thumbnail) setStyle(thumbnail, NAME_PROPERTY, "none")
}

const waitForRoute = (navigate: () => void) =>
  new Promise<void>((resolve) => {
    const finish = () => {
      Router.events.off("routeChangeComplete", finish)
      Router.events.off("routeChangeError", finish)
      resolve()
    }

    Router.events.on("routeChangeComplete", finish)
    Router.events.on("routeChangeError", finish)
    navigate()
  })

const runTransition = (
  prepare: () => void,
  navigate: () => void,
  arrive: () => void
) => {
  const startViewTransition = (document as TransitionDocument)
    .startViewTransition
  if (!startViewTransition) return

  prepare()
  const transition = startViewTransition.call(document, async () => {
    await waitForRoute(navigate)
    clearStyles()
    arrive()
  })

  transition.ready.catch(() => {})
  transition.finished.catch(() => {}).finally(clearStyles)
}

const goToPost = async (href: string, source: HTMLElement) => {
  // 데이터를 먼저 받아 두어 전환 중 화면이 멈춰 있는 시간을 줄인다
  await Promise.race([
    Router.prefetch(href).catch(() => {}),
    new Promise((resolve) => setTimeout(resolve, PREFETCH_TIMEOUT)),
  ])

  scrollPositions.set(Router.asPath, window.scrollY)
  runTransition(
    () =>
      Router.pathname === "/" ? nameAsPostBox(source) : prepareLeavingPost(),
    () => Router.push(href),
    clampPostBox
  )
}

export const handlePostLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  if (!canAnimateTransition()) return

  const link = e.currentTarget
  const href = link.getAttribute("href")
  if (!href) return

  e.preventDefault()
  goToPost(href, link.querySelector<HTMLElement>("article") ?? link)
}

const getPath = (url: string) => url.split(/[?#]/)[0]

type PopStateHandler = Parameters<typeof Router.beforePopState>[0]

export const handlePopState: PopStateHandler = ({ url, as, options }) => {
  const fromPath = getPath(Router.asPath)
  const toPath = getPath(as)
  if (fromPath === toPath || !canAnimateTransition()) return true

  const isLeavingFeed = Router.pathname === "/"
  scrollPositions.set(Router.asPath, window.scrollY)
  runTransition(
    () =>
      isLeavingFeed
        ? nameAsPostBox(findPostCard(toPath))
        : prepareLeavingPost(),
    () => Router.replace(url, as, { ...options, scroll: false }),
    () => {
      window.scrollTo(0, scrollPositions.get(as) ?? 0)
      if (Router.pathname === "/") nameAsPostBox(findPostCard(fromPath))
      else clampPostBox()
    }
  )

  return false
}
