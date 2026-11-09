import Router from "next/router"
import { MouseEvent } from "react"

type ViewTransition = {
  ready: Promise<void>
  finished: Promise<void>
}

type TransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void>) => ViewTransition
}

type Url = Parameters<typeof Router.push>[0]
type PopStateHandler = Parameters<typeof Router.beforePopState>[0]

type RouteTransition = {
  navigate: () => Promise<unknown>
  targetPath: string
  source?: HTMLElement | null
  restoreScrollOf?: string
}

const FEED_PATH = "/"
const POST_BOX = "post-box"
const POST_THUMB = "post-thumb"
const POST_PARTS = [
  [".category", "post-chip"],
  ["h2", "post-title"],
  [".date .content", "post-date"],
  [".tags", "post-tags"],
]
const POST_CARD = "post-card"
const TEXT_LIST = "text-list-panel"
const TEXT_POST = "text-post"
const NAME_PROPERTY = "view-transition-name"
const CLASS_PROPERTY = "view-transition-class"
const PREFETCH_TIMEOUT = 1000
const NAVIGATION_TIMEOUT = 3000
const RENDER_SETTLE_TIME = 20
const MAX_MORPH_SCROLL = 200
const HEADER_OFFSET = 80

const scrollPositions = new Map<string, number>()
const styledElements = new Set<HTMLElement>()

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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
    element.style.removeProperty(CLASS_PROPERTY)
    element.style.removeProperty("max-height")
    element.style.removeProperty("overflow")
  })
  styledElements.clear()
}

const getPostBox = () => document.querySelector<HTMLElement>("[data-post-box]")

const getFeedCards = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>(".mid article[data-post-id]")
  )

const findPostCard = (path: string) =>
  Array.from(document.querySelectorAll<HTMLElement>(".mid a[href]"))
    .find((link) => link.getAttribute("href") === path)
    ?.querySelector<HTMLElement>("article")

const findVisiblePostCard = (path: string) => {
  const card = findPostCard(path)
  if (!card) return undefined
  const { top, bottom } = card.getBoundingClientRect()
  return bottom > 0 && top < window.innerHeight ? card : undefined
}

const nameAsPostBox = (element?: HTMLElement | null) => {
  if (!element) return
  setStyle(element, NAME_PROPERTY, POST_BOX)

  const thumbnail = element.querySelector<HTMLElement>(".thumbnail")
  if (thumbnail) setStyle(thumbnail, NAME_PROPERTY, POST_THUMB)

  POST_PARTS.forEach(([selector, name]) => {
    const part = element.querySelector<HTMLElement>(selector)
    if (part) setStyle(part, NAME_PROPERTY, name)
  })
}

// 화면 근처의 카드만 각자 움직이게 해서 글이 많아도 전환이 무거워지지 않게 한다
const nameFeedCards = () => {
  const names = new Set<string>()

  getFeedCards().forEach((card) => {
    const id = card.dataset.postId
    const { top, bottom } = card.getBoundingClientRect()
    const isNearViewport =
      bottom > -window.innerHeight && top < window.innerHeight * 2
    if (!id || names.has(id) || !isNearViewport) return

    names.add(id)
    setStyle(card, NAME_PROPERTY, `${POST_CARD}-${id}`)
    setStyle(card, CLASS_PROPERTY, POST_CARD)

    const category = card.querySelector<HTMLElement>(".category")
    if (category) setStyle(category, NAME_PROPERTY, `${POST_CARD}-chip-${id}`)

    const thumbnail = card.querySelector<HTMLElement>(".thumbnail")
    if (!thumbnail) return
    setStyle(thumbnail, NAME_PROPERTY, `${POST_CARD}-thumb-${id}`)
    setStyle(thumbnail, CLASS_PROPERTY, `${POST_CARD}-thumb`)
  })
}

// 화면에 보이는 글 제목만 각자 움직이게 하고 나머지는 패널과 함께 바뀌게 둔다
const nameTextList = () => {
  const list = Array.from(
    document.querySelectorAll<HTMLElement>("[data-text-list]")
  ).find((element) => element.getClientRects().length > 0)
  if (!list) return

  setStyle(list, NAME_PROPERTY, TEXT_LIST)
  list.querySelectorAll<HTMLElement>("a[data-post-id]").forEach((link) => {
    const { top, bottom } = link.getBoundingClientRect()
    if (bottom < 0 || top > window.innerHeight) return

    setStyle(link, NAME_PROPERTY, `${TEXT_POST}-${link.dataset.postId}`)
    setStyle(link, CLASS_PROPERTY, TEXT_POST)
  })
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
  box
    .querySelectorAll<HTMLElement>(".thumbnail, [data-post-part]")
    .forEach((part) => setStyle(part, NAME_PROPERTY, "none"))
}

const runTransition = (
  prepare: () => void,
  update: () => unknown,
  arrive: () => void
) => {
  const startViewTransition = (document as TransitionDocument)
    .startViewTransition
  if (!startViewTransition) return

  prepare()
  const transition = startViewTransition.call(document, async () => {
    await Promise.race([update(), delay(NAVIGATION_TIMEOUT)])
    // 목록 필터와 보기 전환은 라우트 완료 뒤 한 번 더 렌더링된다
    await delay(RENDER_SETTLE_TIME)
    clearStyles()
    arrive()
  })

  transition.ready.catch(() => {})
  transition.finished.catch(() => {}).finally(clearStyles)
}

const getPath = (url: string) => url.split(/[?#]/)[0]

const transitionRoute = ({
  navigate,
  targetPath,
  source,
  restoreScrollOf,
}: RouteTransition) => {
  const fromPath = getPath(Router.asPath)
  const wasOnFeed = Router.pathname === FEED_PATH
  const staysOnFeed = wasOnFeed && targetPath === FEED_PATH

  scrollPositions.set(Router.asPath, window.scrollY)
  runTransition(
    () => {
      nameTextList()
      if (wasOnFeed) nameFeedCards()
      if (wasOnFeed && !staysOnFeed)
        nameAsPostBox(source ?? findPostCard(targetPath))
      if (!wasOnFeed) prepareLeavingPost()
    },
    navigate,
    () => {
      if (restoreScrollOf !== undefined) {
        window.scrollTo(0, scrollPositions.get(restoreScrollOf) ?? 0)
      }

      nameTextList()
      const isOnFeed = Router.pathname === FEED_PATH
      if (isOnFeed) nameFeedCards()
      if (isOnFeed && !staysOnFeed) nameAsPostBox(findVisiblePostCard(fromPath))
      if (!isOnFeed) clampPostBox()
    }
  )
}

export const navigateWithTransition = async (
  url: Url,
  source?: HTMLElement | null
) => {
  if (!canAnimateTransition()) {
    Router.push(url)
    return
  }

  const targetPath =
    typeof url === "string"
      ? getPath(url)
      : url.pathname ?? getPath(Router.asPath)

  // 데이터를 먼저 받아 두어 전환 중 화면이 멈춰 있는 시간을 줄인다
  if (typeof url === "string" && targetPath !== getPath(Router.asPath)) {
    await Promise.race([
      Router.prefetch(url).catch(() => {}),
      delay(PREFETCH_TIMEOUT),
    ])
  }

  transitionRoute({ navigate: () => Router.push(url), targetPath, source })
}

export const handleLinkClick = (e: MouseEvent<HTMLAnchorElement>) => {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
  if (!canAnimateTransition()) return

  const link = e.currentTarget
  const href = link.getAttribute("href")
  if (!href) return

  e.preventDefault()
  navigateWithTransition(
    href,
    link.querySelector<HTMLElement>("article") ?? link
  )
}

export const handlePopState: PopStateHandler = ({ url, as, options }) => {
  const staysOnSamePost =
    Router.pathname !== FEED_PATH && getPath(Router.asPath) === getPath(as)
  if (staysOnSamePost || !canAnimateTransition()) return true

  transitionRoute({
    navigate: () => Router.replace(url, as, { ...options, scroll: false }),
    targetPath: getPath(as),
    restoreScrollOf: as,
  })

  return false
}

export const animateUpdate = (update: () => void) => {
  if (!canAnimateTransition()) {
    update()
    return
  }

  runTransition(nameTextList, update, nameTextList)
}

export const animateFeedUpdate = (update: () => void) => {
  if (!canAnimateTransition()) {
    update()
    return
  }

  // 카드 높이가 바뀌어도 보고 있던 글이 같은 자리에 남도록 스크롤을 맞춘다
  const anchor = getFeedCards().find(
    (card) => card.getBoundingClientRect().bottom > HEADER_OFFSET
  )
  const anchorTop = anchor?.getBoundingClientRect().top

  runTransition(nameFeedCards, update, () => {
    if (anchor && anchorTop !== undefined) {
      window.scrollBy(0, anchor.getBoundingClientRect().top - anchorTop)
    }
    nameFeedCards()
  })
}
