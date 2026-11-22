import styled from "@emotion/styled"
import React, { InputHTMLAttributes } from "react"
import { FiSearch } from "react-icons/fi"
import SectionTitle from "src/components/SectionTitle"

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  // Enter 로 검색 결과로 넘어가는 곳에서만 키캡을 보여 준다
  hint?: string
}

const SearchInput: React.FC<Props> = ({ hint, ...props }) => {
  return (
    <StyledWrapper>
      <SectionTitle>Search</SectionTitle>
      <label className="mid">
        <FiSearch className="icon" aria-hidden />
        <input type="text" placeholder="Search posts" {...props} />
        {hint && <kbd className="key">{hint}</kbd>}
      </label>
    </StyledWrapper>
  )
}

export default SearchInput

const StyledWrapper = styled.div`
  margin-bottom: 1.5rem;

  @media (min-width: 768px) {
    margin-bottom: 2rem;
  }
  > .mid {
    display: flex;
    height: 2.75rem;
    padding: 0 0.375rem 0 1rem;
    gap: 0.625rem;
    align-items: center;
    border-radius: 9999px;
    cursor: text;
    ${({ theme }) => theme.surfaces.well}
    transition: box-shadow 150ms ${({ theme }) => theme.variables.easing};

    .icon {
      flex: 0 0 auto;
      width: 1rem;
      height: 1rem;
      color: ${({ theme }) => theme.colors.gray10};
    }

    input {
      flex: 1;
      min-width: 0;
      height: 100%;
      font-size: 0.875rem;
      color: ${({ theme }) => theme.colors.gray12};
      ::placeholder {
        color: ${({ theme }) => theme.colors.gray10};
      }
    }

    /* 키캡: 영상의 Esc·Enter 칩처럼 단축키를 조용히 알려 준다 */
    .key {
      flex: 0 0 auto;
      padding: 0.25rem 0.5rem;
      border-radius: 0.625rem;
      font-family: ${({ theme }) => theme.variables.monoFont};
      font-size: 0.6875rem;
      line-height: 1rem;
      color: ${({ theme }) => theme.colors.gray11};
      ${({ theme }) => theme.surfaces.claySoft}
    }

    :focus-within {
      box-shadow: 0 0 0 2px ${({ theme }) => theme.surfaces.focusRing};
    }
  }
`
