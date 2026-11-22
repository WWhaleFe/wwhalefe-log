import styled from "@emotion/styled"
import Link from "next/link"
import { handleLinkClick } from "src/libs/utils/viewTransition"

const NavBar: React.FC = () => {
  const links = [{ id: 1, name: "About", to: "/about" }]
  return (
    <StyledWrapper className="">
      <ul>
        {links.map((link) => (
          <li key={link.id}>
            <Link href={link.to} onClick={handleLinkClick}>
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </StyledWrapper>
  )
}

export default NavBar

const StyledWrapper = styled.div`
  flex-shrink: 0;
  ul {
    display: flex;
    flex-direction: row;
    margin: 0;
    li {
      display: block;
      margin-left: 0.25rem;
      a {
        display: block;
        padding: 0.3125rem 0.875rem;
        border: ${({ theme }) => theme.surfaces.dashed};
        border-radius: 9999px;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.gray12};
        transition: background-color 150ms ${({ theme }) => theme.variables.easing};

        :hover {
          ${({ theme }) => theme.surfaces.hover}
        }
        :focus-visible {
          outline: 2px solid ${({ theme }) => theme.surfaces.focusRing};
        }
      }
    }
  }
`
