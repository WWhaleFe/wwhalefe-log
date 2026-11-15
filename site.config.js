const CONFIG = {
  // profile setting (required)
  profile: {
    name: "WWhaleFe",
    image: "/03d4d607c.png", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "Engineer",
    bio: "Engineer",
    email: "",
    linkedin: "",
    github: "WWhaleFe",
    instagram: "",
  },
  projects: [
    {
      name: `WWhaleFe Apps`,
      href: "https://wwhalefe-apps.vercel.app/",
    },
    {
      name: `WWhaleFe-log`,
      href: "https://github.com/WWhaleFe/WWhaleFe-log",
    },
  ],
  // blog setting (required)
  blog: {
    title: "WWhaleFe-log",
    description:
      "Microsoft 365·Intune·Azure·Windows Server 등 IT 인프라 실무를 정리하는 WWhaleFe의 기술 블로그",
    scheme: "dark", // 'light' | 'dark' | 'system'
  },

  // CONFIG configration (required)
  link: "https://wwhalefe-log.vercel.app",
  since: 2022, // If leave this empty, current year will be used.
  lang: "ko-KR", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  ogImageGenerateURL: "https://og-image-korean.vercel.app", // The link to generate OG image, don't end with a slash

  // notion configuration (required)
  notionConfig: {
    pageId: process.env.NOTION_PAGE_ID,
    dataSourceId: "99d34b7a-9e74-82f0-8bb7-873673763975",
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  // 확인 코드는 Vercel 환경변수로 넣는다. 값이 있을 때만 메타 태그를 출력한다
  googleSearchConsole: {
    enable: !!process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  naverSearchAdvisor: {
    enable: !!process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: false,
    config: {
      repo: process.env.NEXT_PUBLIC_UTTERANCES_REPO || "",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  // 익명 댓글(닉네임+비밀번호). Notion 「💬 블로그 댓글」 DB 에 저장되고 status 로 관리한다
  comments: {
    enable: true,
    dataSourceId: "41934b7a-9e74-81a1-8f2d-000b6b659135",
  },
  cusdis: {
    enable: false,
    config: {
      host: "https://cusdis.com",
      appid: "", // Embed Code -> data-app-id value
    },
  },
  isProd: process.env.VERCEL_ENV === "production", // distinguish between development and production environment (ref: https://vercel.com/docs/environment-variables#system-environment-variables)
  revalidateTime: 60 * 1, // revalidate time for [slug], index
}

module.exports = { CONFIG }
