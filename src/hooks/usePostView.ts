import { useQuery, useQueryClient } from "@tanstack/react-query"
import { setCookie } from "cookies-next"
import { queryKey } from "src/constants/queryKey"

export type PostView = "large" | "small"

export const POST_VIEW_COOKIE = "post-view"

const COOKIE_MAX_AGE = 60 * 60 * 24 * 365

const usePostView = (): [PostView, (view: PostView) => void] => {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: queryKey.postView(),
    enabled: false,
    initialData: "large" as PostView,
  })

  const setPostView = (view: PostView) => {
    setCookie(POST_VIEW_COOKIE, view, { maxAge: COOKIE_MAX_AGE })
    queryClient.setQueryData(queryKey.postView(), view)
  }

  return [data, setPostView]
}

export default usePostView
