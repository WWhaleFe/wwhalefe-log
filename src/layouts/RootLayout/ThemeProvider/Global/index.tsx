import { Global as _Global, css, useTheme } from "@emotion/react"

import { ThemeProvider as _ThemeProvider } from "@emotion/react"
import { pretendard } from "src/assets"

const SPRING_EASING = "cubic-bezier(0.34, 1.3, 0.64, 1)"

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

        ::view-transition-group(*) {
          animation-duration: 0.4s;
          animation-timing-function: ${SPRING_EASING};
        }

        ::view-transition-old(*),
        ::view-transition-new(*) {
          animation-duration: 0.3s;
        }

        ::view-transition-old(root),
        ::view-transition-new(root) {
          animation-duration: 0.2s;
        }

        ::view-transition-group(post-box),
        ::view-transition-group(post-thumb),
        ::view-transition-group(profile-box),
        ::view-transition-group(text-list-panel),
        ::view-transition-group(.post-card),
        ::view-transition-group(.post-card-thumb) {
          overflow: clip;
          border-radius: 1.5rem;
        }

        ::view-transition-old(.post-card-thumb),
        ::view-transition-new(.post-card-thumb),
        ::view-transition-old(post-thumb),
        ::view-transition-new(post-thumb) {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @keyframes view-pop-in {
          from {
            opacity: 0;
            transform: translateY(1.5rem) scale(0.88);
          }
        }

        @keyframes view-pop-out {
          to {
            opacity: 0;
            transform: translateY(1.5rem) scale(0.88);
          }
        }

        @keyframes view-slide-in {
          from {
            opacity: 0;
            transform: translateX(-1.25rem);
          }
        }

        @keyframes view-slide-out {
          to {
            opacity: 0;
            transform: translateX(-1.25rem);
          }
        }

        ::view-transition-new(post-box):only-child,
        ::view-transition-new(.post-card):only-child,
        ::view-transition-new(.side-section):only-child {
          animation: view-pop-in 0.4s ${SPRING_EASING} both;
        }

        ::view-transition-old(post-box):only-child,
        ::view-transition-old(.post-card):only-child,
        ::view-transition-old(.side-section):only-child {
          animation: view-pop-out 0.25s ease-in both;
        }

        ::view-transition-new(.text-post):only-child {
          animation: view-slide-in 0.35s ease-out both;
        }

        ::view-transition-old(.text-post):only-child {
          animation: view-slide-out 0.2s ease-in both;
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
