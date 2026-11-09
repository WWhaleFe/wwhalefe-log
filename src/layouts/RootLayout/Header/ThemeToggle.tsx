import React from "react"
import { MdDarkMode, MdLightMode } from "react-icons/md"
import useScheme from "src/hooks/useScheme"
import HeaderIconButton from "./HeaderIconButton"

const SUN_COLOR = "#f5a524"
const MOON_COLOR = "#ffd84d"

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
        <MdLightMode color={SUN_COLOR} />
      ) : (
        <MdDarkMode color={MOON_COLOR} />
      )}
    </HeaderIconButton>
  )
}

export default ThemeToggle
