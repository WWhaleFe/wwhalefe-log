import React from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import PostNavigation from "./PostNavigation"
import CommentBox from "./CommentBox"
import Category from "src/components/Category"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"

type Props = {}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()

  if (!data) return null

  const category = (data.category && data.category?.[0]) || undefined

  return (
    <StyledWrapper data-post-box>
      <article>
        {category && (
          <div
            data-post-part
            css={{
              marginBottom: "0.5rem",
              width: "fit-content",
              viewTransitionName: "post-chip",
            }}
          >
            <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
              {category}
            </Category>
          </div>
        )}
        {data.type[0] === "Post" && <PostHeader data={data} />}
        <div>
          <NotionRenderer recordMap={data.recordMap} />
        </div>
        {data.type[0] === "Post" && (
          <>
            <PostNavigation data={data} />
            <Footer />
            <CommentBox data={data} />
          </>
        )}
      </article>
    </StyledWrapper>
  )
}

export default PostDetail

const StyledWrapper = styled.div`
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-top: 2.5rem;
  padding-bottom: 2.5rem;
  border-radius: 2.25rem;
  view-transition-name: post-box;
  ${({ theme }) => theme.surfaces.clay}
  margin: 0 auto;
  > article {
    margin: 0 auto;
  }
`
