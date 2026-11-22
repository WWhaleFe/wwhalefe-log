import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import { navigateWithTransition } from "src/libs/utils/viewTransition"

type TOrder = "asc" | "desc"

type Props = {}

const OrderButtons: React.FC<Props> = () => {
  const router = useRouter()

  const currentOrder = `${router.query.order || ``}` || ("desc" as TOrder)

  const handleClickOrderBy = (value: TOrder) => {
    navigateWithTransition({
      query: {
        ...router.query,
        order: value,
      },
    })
  }
  return (
    <StyledWrapper>
      <a
        data-active={currentOrder === "desc"}
        onClick={() => handleClickOrderBy("desc")}
      >
        Newest
      </a>
      <a
        data-active={currentOrder === "asc"}
        onClick={() => handleClickOrderBy("asc")}
      >
        Oldest
      </a>
    </StyledWrapper>
  )
}

export default OrderButtons

// 영상의 Today·7 days 토글처럼 들어간 홈 위에 고른 칸만 떠 있는 세그먼트
const StyledWrapper = styled.div`
  display: flex;
  padding: 0.1875rem;
  gap: 0.125rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  ${({ theme }) => theme.surfaces.well}
  a {
    padding: 0.25rem 0.75rem;
    border: 1px solid transparent;
    border-radius: 9999px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.gray11};
    transition-property: background-color, color, box-shadow;
    transition-duration: 150ms;
    transition-timing-function: ${({ theme }) => theme.variables.easing};

    :hover {
      color: ${({ theme }) => theme.colors.gray12};
    }

    &[data-active="true"] {
      font-weight: 500;
      color: ${({ theme }) => theme.colors.gray12};
      ${({ theme }) => theme.surfaces.claySoft}
    }
  }
`
