import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ExtendedRecordMap } from "notion-types"
import useScheme from "src/hooks/useScheme"

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css"

// used for rendering equations (optional)

import "katex/dist/katex.min.css"
import { FC } from "react"
import styled from "@emotion/styled"

// 본문을 서버에서 그려야 검색엔진이 HTML 만으로 글 내용을 읽는다
const _NotionRenderer = dynamic(() =>
  import("react-notion-x").then((m) => m.NotionRenderer)
)

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => m.Code)
)

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
)

const mapPageUrl = (id: string) => {
  return "https://www.notion.so/" + id.replace(/-/g, "")
}

type Props = {
  recordMap: ExtendedRecordMap
}

const NotionRenderer: FC<Props> = ({ recordMap }) => {
  const [scheme] = useScheme()
  return (
    <StyledWrapper>
      <_NotionRenderer
        darkMode={scheme === "dark"}
        recordMap={recordMap}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          nextImage: Image,
          nextLink: Link,
        }}
        mapPageUrl={mapPageUrl}
      />
    </StyledWrapper>
  )
}

export default NotionRenderer

const StyledWrapper = styled.div`
  /* // TODO: why render? */
  .notion-collection-page-properties {
    display: none !important;
  }
  .notion-page {
    width: 100%;
    padding: 0;
  }
  .notion-list {
    width: 100%;
  }
  .notion-inline-code,
  .notion-link {
    overflow-wrap: anywhere;
  }
  .notion-file-info,
  .notion-file-title {
    min-width: 0;
  }
  .notion-link {
    color: ${({ theme }) => theme.surfaces.link};
    border-bottom-color: ${({ theme }) => theme.surfaces.link};
  }
  .notion-callout {
    border: none;
    border-radius: 1.25rem;
    ${({ theme }) => theme.surfaces.claySoft}
  }
  .notion-code {
    border-radius: 1.25rem;
  }
  .notion-asset-wrapper img {
    border-radius: 1rem;
  }
  /* Images added without a width in Notion (e.g. through the API) span the
     whole column, so tall screenshots fill the screen. Cap the width and the
     height, keep the aspect ratio, and centre them. Smaller ones are unchanged. */
  .notion-asset-wrapper-image > div {
    max-width: min(100%, 720px) !important;
  }
  .notion-asset-wrapper-image > div > img {
    width: auto !important;
    max-width: 100%;
    max-height: min(70vh, 600px);
    align-self: center;
    object-fit: contain !important;
  }
  .notion-simple-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
    border-radius: 1rem;
    border: 1px solid ${({ theme }) => theme.surfaces.tableLine};
  }
  .notion-simple-table td {
    width: auto !important;
    border: none;
    border-bottom: 1px solid ${({ theme }) => theme.surfaces.tableLine};
    overflow-wrap: anywhere;
  }
  .notion-simple-table tr:last-of-type td {
    border-bottom: none;
  }
  .notion-simple-table-header-row td {
    background: ${({ theme }) => theme.surfaces.tableHead};
  }
`
