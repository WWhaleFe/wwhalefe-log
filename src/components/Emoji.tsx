import React, { ReactNode } from "react"
import { Noto_Color_Emoji } from "next/font/google"

const notoColorEmoji = Noto_Color_Emoji({
  weight: ["400"],
  subsets: ["emoji"],
  fallback: ["Apple Color Emoji"],
})

type Props = {
  className?: string
  children?: ReactNode
}

export const Emoji = ({ className, children }: Props) => {
  return (
    <span
      className={className}
      css={{
        // Safari 는 Noto 컬러 이모지 웹폰트를 제대로 그리지 못해 기기 이모지를 먼저 쓴다
        fontFamily: `"Apple Color Emoji", "Segoe UI Emoji", ${notoColorEmoji.style.fontFamily}`,
      }}
    >
      {children}
    </span>
  )
}
