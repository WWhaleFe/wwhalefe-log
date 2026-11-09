import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React, {
  ChangeEventHandler,
  FormEvent,
  ReactNode,
  useState,
} from "react"
import usePostsQuery from "src/hooks/usePostsQuery"
import ContactCard from "src/routes/Feed/ContactCard"
import Footer from "src/routes/Feed/Footer"
import ProfileCard from "src/routes/Feed/ProfileCard"
import SearchInput from "src/routes/Feed/SearchInput"
import ServiceCard from "src/routes/Feed/ServiceCard"
import TagList from "src/routes/Feed/TagList"
import PostTitleList from "./PostTitleList"
import AllPostsList from "./AllPostsList"

const HEADER_HEIGHT = 73
const RECENT_POST_COUNT = 5

type Props = {
  children: ReactNode
  showMobilePostLists?: boolean
  rightTop?: ReactNode
  search?: {
    value: string
    onChange: ChangeEventHandler<HTMLInputElement>
  }
}

const BlogLayout: React.FC<Props> = ({
  children,
  showMobilePostLists = false,
  rightTop,
  search,
}) => {
  const router = useRouter()
  const posts = usePostsQuery()
  const [keyword, setKeyword] = useState("")

  // 메인에서는 목록이 바로 걸러지고, 글 상세에서는 Enter로 메인 검색 결과로 이동한다
  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (search) return
    router.push(keyword ? `/?q=${encodeURIComponent(keyword)}` : "/")
  }

  const recentPosts = (
    <PostTitleList
      emoji="🆕"
      title="Recent Posts"
      posts={posts.slice(0, RECENT_POST_COUNT)}
      showDate
    />
  )
  const allPosts = <AllPostsList />

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
        <form className="search" onSubmit={handleSearchSubmit}>
          <SearchInput
            value={search?.value ?? keyword}
            onChange={search?.onChange ?? ((e) => setKeyword(e.target.value))}
          />
        </form>
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

  > .rt .search {
    padding-top: 1rem;
  }

  > .rt .footer {
    padding-top: 1rem;
  }
`
