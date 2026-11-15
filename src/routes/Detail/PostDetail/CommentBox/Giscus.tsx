import { CONFIG } from "site.config"
import { useEffect } from "react"
import styled from "@emotion/styled"
import useScheme from "src/hooks/useScheme"

type Props = {
  term: string
}

// 글마다 slug 이름의 Discussion 하나에 댓글이 모인다.
// strict 로 두어 slug 가 비슷한 글끼리 댓글이 섞이지 않게 한다.
const Giscus: React.FC<Props> = ({ term }) => {
  const [scheme] = useScheme()

  useEffect(() => {
    const anchor = document.getElementById("comments")
    if (!anchor) return

    const { repo, repoId, category, categoryId } = CONFIG.giscus.config
    const attrs: Record<string, string> = {
      src: "https://giscus.app/client.js",
      "data-repo": repo,
      "data-repo-id": repoId,
      "data-category": category,
      "data-category-id": categoryId,
      "data-mapping": "specific",
      "data-term": term,
      "data-strict": "1",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": scheme === "dark" ? "dark" : "light",
      "data-lang": "ko",
      "data-loading": "lazy",
      crossorigin: "anonymous",
      async: "true",
    }
    const script = document.createElement("script")
    Object.entries(attrs).forEach(([key, value]) =>
      script.setAttribute(key, value)
    )
    anchor.appendChild(script)
    return () => {
      anchor.innerHTML = ""
    }
  }, [scheme, term])

  return <StyledWrapper id="comments" />
}

export default Giscus

const StyledWrapper = styled.div`
  margin-top: 2.5rem;
`
