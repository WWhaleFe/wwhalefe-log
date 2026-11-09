import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"

type TOrder = "asc" | "desc"

type Props = {}

const OrderButtons: React.FC<Props> = () => {
  const router = useRouter()

  const currentOrder = `${router.query.order || ``}` || ("desc" as TOrder)

  const handleClickOrderBy = (value: TOrder) => {
    router.push({
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
        Desc
      </a>
      <a
        data-active={currentOrder === "asc"}
        onClick={() => handleClickOrderBy("asc")}
      >
        Asc
      </a>
    </StyledWrapper>
  )
}

export default OrderButtons

const StyledWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  a {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.gray12};
    ${({ theme }) => theme.surfaces.claySoft}

    &[data-active="true"] {
      font-weight: 700;
      ${({ theme }) => theme.surfaces.activePill}
    }
  }
`
