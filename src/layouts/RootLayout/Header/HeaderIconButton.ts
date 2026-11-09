import styled from "@emotion/styled"

const HeaderIconButton = styled.button`
  display: flex;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  font-size: 1.125rem;
  line-height: 1;
  color: ${({ theme }) => theme.colors.gray12};
  ${({ theme }) => theme.surfaces.claySoft}
  cursor: pointer;

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.surfaces.focusRing};
  }

  svg {
    display: block;
  }
`

export default HeaderIconButton
