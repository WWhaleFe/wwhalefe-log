import NavBar from "./NavBar"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"
import PostViewToggle from "./PostViewToggle"
import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { zIndexes } from "src/styles/zIndexes"

type Props = {
  fullWidth: boolean
}

const Header: React.FC<Props> = ({ fullWidth }) => {
  const router = useRouter()

  return (
    <StyledWrapper>
      <div data-full-width={fullWidth} className="container">
        <Logo />
        <div className="nav">
          <ThemeToggle />
          {router.pathname === "/" && <PostViewToggle />}
          <NavBar />
        </div>
      </div>
    </StyledWrapper>
  )
}

export default Header

const StyledWrapper = styled.div`
  z-index: ${zIndexes.header};
  position: sticky;
  top: 0.75rem;
  width: calc(100% - 2rem);
  max-width: 1680px;
  margin: 0.75rem auto 0;
  border-radius: 1.5rem;
  ${({ theme }) => theme.surfaces.glass}

  .container {
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1680px;
    height: 3rem;
    margin: 0 auto;
    &[data-full-width="true"] {
      @media (min-width: 768px) {
        padding-left: 6rem;
        padding-right: 6rem;
      }
    }
    .nav {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
  }
`
