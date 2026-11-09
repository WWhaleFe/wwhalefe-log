import { useState } from "react"

import SearchInput from "./SearchInput"
import { FeedHeader } from "./FeedHeader"
import Footer from "./Footer"
import TagList from "./TagList"
import MobileProfileCard from "./MobileProfileCard"
import PostList from "./PostList"
import PinnedPosts from "./PostList/PinnedPosts"
import BlogLayout from "src/layouts/BlogLayout"

type Props = {}

const Feed: React.FC<Props> = () => {
  const [q, setQ] = useState("")

  return (
    <BlogLayout>
      <MobileProfileCard />
      <PinnedPosts q={q} />
      <SearchInput value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="tags">
        <TagList />
      </div>
      <FeedHeader />
      <PostList q={q} />
      <div className="footer">
        <Footer />
      </div>
    </BlogLayout>
  )
}

export default Feed
