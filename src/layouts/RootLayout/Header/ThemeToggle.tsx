import React from "react"
import { MdDarkMode, MdLightMode } from "react-icons/md"
import useScheme from "src/hooks/useScheme"
import HeaderIconButton from "./HeaderIconButton"


type Props = {}

const ThemeToggle: React.FC<Props> = () => {
  const [scheme, setScheme] = useScheme()
  const nextLabel =
    scheme === "light" ? "Switch to dark theme" : "Switch to light theme"

  const handleClick = () => {
    setScheme(scheme === "light" ? "dark" : "light")
  }

  return (
    <HeaderIconButton
      type="button"
      aria-label={nextLabel}
      title={nextLabel}
      onClick={handleClick}
    >
      {scheme === "light" ? (
        <MdLightMode />
      ) : (
        <MdDarkMode />
      )}
    </HeaderIconButton>
  )
}

export default ThemeToggle
