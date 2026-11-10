import useMermaidEffect from "./hooks/useMermaidEffect"
import PostDetail from "./PostDetail"
import PageDetail from "./PageDetail"
import styled from "@emotion/styled"
import usePostQuery from "src/hooks/usePostQuery"
import BlogLayout from "src/layouts/BlogLayout"
import TableOfContents from "./PostDetail/TableOfContents"
import FloatingPostNav from "./PostDetail/FloatingPostNav"

type Props = {}

const Detail: React.FC<Props> = () => {
  const data = usePostQuery()
  useMermaidEffect()

  if (!data) return null
  return (
    <StyledWrapper data-type={data.type}>
      {data.type[0] === "Page" && <PageDetail />}
      {data.type[0] !== "Page" && (
        <BlogLayout
          showMobilePostLists
          compactProfile
          belowProfile={<TableOfContents />}
        >
          <PostDetail />
        </BlogLayout>
      )}
      {data.type[0] === "Post" && <FloatingPostNav data={data} />}
    </StyledWrapper>
  )
}

export default Detail

const StyledWrapper = styled.div`
  &[data-type="Page"] {
    padding: 2rem 0;
  }
  &[data-type="Post"] {
    padding-bottom: 5rem;
  }
  /** Reference: https://github.com/chriskempson/tomorrow-theme **/
  code[class*="language-mermaid"],
  pre[class*="language-mermaid"] {
    background-color: ${({ theme }) => theme.colors.gray5};
  }
`
