/** @type {import('next').NextConfig} */
const nextConfig = {
  // giscus 가 댓글 테마 CSS 를 교차 출처(crossorigin)로 읽는다
  async headers() {
    return [
      {
        source: "/giscus/:file*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.notion.so',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // accept all subdomains of googleusercontent.com
      },
      {
        protocol: 'https',
        hostname: 's3-us-west-2.amazonaws.com',
      },
    ],
  },
}

module.exports = nextConfig
