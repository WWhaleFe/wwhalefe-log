import styled from "@emotion/styled"
import React, { ReactNode } from "react"
import usePostsQuery from "src/hooks/usePostsQuery"
import ContactCard from "src/routes/Feed/ContactCard"
import Footer from "src/routes/Feed/Footer"
import ProfileCard from "src/routes/Feed/ProfileCard"
import ServiceCard from "src/routes/Feed/ServiceCard"
import TagList from "src/routes/Feed/TagList"
import PostTitleList from "./PostTitleList"

const HEADER_HEIGHT = 73
const RECENT_POST_COUNT = 5

type Props = {
  children: ReactNode
  showMobilePostLists?: boolean
  rightTop?: ReactNode
}

const BlogLayout: React.FC<Props> = ({
  children,
  showMobilePostLists = false,
  rightTop,
}) => {
  const posts = usePostsQuery()

  const recentPosts = (
    <PostTitleList
      emoji="🆕"
      title="Recent Posts"
      posts={posts.slice(0, RECENT_POST_COUNT)}
      showDate
    />
  )
  const allPosts = <PostTitleList emoji="📚" title="All Posts" posts={posts} />

  return (
    <StyledWrapper>
      <aside
        className="lt"
        css={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        {recentPosts}
        <TagList />
        {allPosts}
      </aside>
      <div className="mid">
        {children}
        {showMobilePostLists && (
          <div className="mobile-lists">
            {recentPosts}
            {allPosts}
          </div>
        )}
      </div>
      <aside
        className="rt"
        css={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        {rightTop}
        <ProfileCard />
        <ServiceCard />
        <ContactCard />
        <div className="footer">
          <Footer />
        </div>
      </aside>
    </StyledWrapper>
  )
}

export default BlogLayout

const StyledWrapper = styled.div`
  padding: 0.5rem 0;

  @media (min-width: 768px) {
    padding: 2rem 0;
  }

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 200px minmax(0, 1fr) 200px;
    gap: 1.5rem;
  }

  @media (min-width: 1280px) {
    grid-template-columns: 250px minmax(0, 1fr) 250px;
  }

  > .lt,
  > .rt {
    display: none;
    overflow: scroll;
    position: sticky;
    padding: 0.25rem 1.25rem 2rem;
    margin: 0 -1.25rem;
    top: ${HEADER_HEIGHT - 10}px;

    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }

    @media (min-width: 1024px) {
      display: block;
    }
  }

  > .mid {
    min-width: 0;

    > .tags {
      display: block;

      @media (min-width: 1024px) {
        display: none;
      }
    }

    > .footer {
      padding-bottom: 2rem;
      @media (min-width: 1024px) {
        display: none;
      }
    }

    > .mobile-lists {
      margin-top: 1.5rem;

      @media (min-width: 1024px) {
        display: none;
      }
    }
  }

  > .rt .footer {
    padding-top: 1rem;
  }
`
