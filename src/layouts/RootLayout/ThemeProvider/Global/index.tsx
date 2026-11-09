import { Global as _Global, css, useTheme } from "@emotion/react"

import { ThemeProvider as _ThemeProvider } from "@emotion/react"
import { pretendard } from "src/assets"

export const Global = () => {
  const theme = useTheme()

  return (
    <_Global
      styles={css`
        body {
          margin: 0;
          padding: 0;
          color: ${theme.colors.gray12};
          background-color: ${theme.surfaces.pageColor};
          font-family: ${pretendard.style.fontFamily};
          font-weight: ${pretendard.style.fontWeight};
          font-style: ${pretendard.style.fontStyle};
          -webkit-user-select: none;
          user-select: none;
        }

        body::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: -1;
          background: ${theme.surfaces.pageGlow};
          pointer-events: none;
        }

        * {
          color-scheme: ${theme.scheme};
          box-sizing: border-box;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 0;
          font-weight: inherit;
          font-style: inherit;
        }

        a {
          all: unset;
          cursor: pointer;
        }

        ul {
          padding: 0;
        }

        // init button
        button {
          all: unset;
          cursor: pointer;
        }

        // init input
        input {
          all: unset;
          box-sizing: border-box;
        }

        // init textarea
        textarea {
          border: none;
          background-color: transparent;
          font-family: inherit;
          padding: 0;
          outline: none;
          resize: none;
          color: inherit;
        }

        input,
        textarea {
          -webkit-user-select: text;
          user-select: text;
        }

        .notion-code-copy {
          display: none !important;
        }

        ::view-transition-group(post-box),
        ::view-transition-group(post-thumb),
        ::view-transition-group(profile-box),
        ::view-transition-group(sidebar-left),
        ::view-transition-group(sidebar-right),
        ::view-transition-group(site-logo) {
          animation-duration: 0.3s;
          animation-timing-function: cubic-bezier(0.2, 0, 0, 1);
        }

        ::view-transition-group(post-box),
        ::view-transition-group(post-thumb),
        ::view-transition-group(profile-box) {
          overflow: clip;
          border-radius: 1.5rem;
        }

        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.2s;
        }

        ::view-transition-old(post-box),
        ::view-transition-new(post-box),
        ::view-transition-old(post-thumb),
        ::view-transition-new(post-thumb),
        ::view-transition-old(profile-box),
        ::view-transition-new(profile-box) {
          animation-duration: 0.3s;
        }

        ::view-transition-old(post-thumb),
        ::view-transition-new(post-thumb) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        hr {
          width: 100%;
          border: none;
          margin: 0;
          border-top: 1px solid ${theme.colors.gray6};
        }
      `}
    />
  )
}
