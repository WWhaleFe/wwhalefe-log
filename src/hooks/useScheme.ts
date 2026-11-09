import { useQuery, useQueryClient } from "@tanstack/react-query"
import { getCookie, setCookie } from "cookies-next"
import { useEffect } from "react"
import { CONFIG } from "site.config"
import { queryKey } from "src/constants/queryKey"
import { SchemeType } from "src/types"

// 라이트가 기본값이던 때 저장된 쿠키를 무시하려고 이름을 바꿨다
const SCHEME_COOKIE = "blog-scheme"

type SetScheme = (scheme: SchemeType) => void

const useScheme = (): [SchemeType, SetScheme] => {
  const queryClient = useQueryClient()
  const followsSystemTheme = CONFIG.blog.scheme === "system"

  const { data } = useQuery({
    queryKey: queryKey.scheme(),
    enabled: false,
    initialData: followsSystemTheme
      ? "dark"
      : (CONFIG.blog.scheme as SchemeType),
  })

  const setScheme = (scheme: SchemeType) => {
    setCookie(SCHEME_COOKIE, scheme)

    queryClient.setQueryData(queryKey.scheme(), scheme)
  }

  useEffect(() => {
    if (!window) return

    const cachedScheme = getCookie(SCHEME_COOKIE) as SchemeType
    const defaultScheme = followsSystemTheme
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : data
    setScheme(cachedScheme || defaultScheme)
  }, [])

  return [data, setScheme]
}

export default useScheme
