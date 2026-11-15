import { CONFIG } from "site.config"
import { useEffect } from "react"
import styled from "@emotion/styled"
import useScheme from "src/hooks/useScheme"

type Props = {
  term: string
}

// 글마다 slug 이름의 Discussion 하나에 댓글이 모인다.
// strict 로 두어 slug 가 비슷한 글끼리 댓글이 섞이지 않게 한다.
// 테마는 public/giscus/*.css (블로그 clay 스타일). giscus 가 교차 출처로 읽으므로
// 운영 주소의 파일을 쓰고, 바꿀 때는 THEME_VERSION 을 올려 캐시를 비운다.
const THEME_VERSION = 1
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
      "data-theme": `${CONFIG.link}/giscus/${scheme}.css?v=${THEME_VERSION}`,
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

  return (
    <StyledWrapper>
      <div id="comments" />
      <p className="hint">
        내가 쓴 댓글을 고치거나 지우려면 댓글의 작성 시각을 눌러 GitHub 에서
        ··· 메뉴를 쓰세요.
      </p>
    </StyledWrapper>
  )
}

export default Giscus

const StyledWrapper = styled.div`
  margin-top: 2.5rem;

  .hint {
    margin-top: 0.75rem;
    font-size: 0.75rem;
    line-height: 1rem;
    color: ${({ theme }) => theme.colors.gray11};
  }
`
