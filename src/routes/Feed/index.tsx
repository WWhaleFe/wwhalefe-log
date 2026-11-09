import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import SearchInput from "./SearchInput"
import { FeedHeader } from "./FeedHeader"
import Footer from "./Footer"
import TagList from "./TagList"
import MobileProfileCard from "./MobileProfileCard"
import PostList from "./PostList"
import PinnedPosts from "./PostList/PinnedPosts"
import BlogLayout from "src/layouts/BlogLayout"
import AllPostsList from "src/layouts/BlogLayout/AllPostsList"

type Props = {}

const Feed: React.FC<Props> = () => {
  const router = useRouter()
  const [q, setQ] = useState("")

  // 글 상세의 검색창에서 넘어온 키워드를 적용한다
  useEffect(() => {
    if (typeof router.query.q === "string") setQ(router.query.q)
  }, [router.query.q])

  return (
    <BlogLayout search={{ value: q, onChange: (e) => setQ(e.target.value) }}>
      <MobileProfileCard />
      <PinnedPosts q={q} />
      <SearchInput value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="tags">
        <TagList />
      </div>
      <FeedHeader />
      <PostList q={q} />
      <div className="mobile-lists">
        <AllPostsList />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </BlogLayout>
  )
}

export default Feed
