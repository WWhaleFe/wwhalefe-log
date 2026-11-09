export const queryKey = {
  scheme: () => ["scheme"],
  postView: () => ["postView"],
  posts: () => ["posts"],
  tags: () => ["tags"],
  categories: () => ["categories"],
  post: (slug: string) => ["post", slug],
}
