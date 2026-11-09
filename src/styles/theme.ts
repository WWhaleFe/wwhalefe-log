import { Theme } from "@emotion/react"
import { Colors, colors } from "./colors"
import { Surfaces, surfaces } from "./surfaces"
import { variables } from "./variables"
import { zIndexes } from "./zIndexes"
import { SchemeType } from "src/types"

declare module "@emotion/react" {
  export interface Theme {
    scheme: SchemeType
    colors: Colors
    surfaces: Surfaces
    zIndexes: typeof zIndexes
    variables: typeof variables
  }
}

type Options = {
  scheme: SchemeType
}

export const createTheme = (options: Options): Theme => ({
  scheme: options.scheme,
  colors: colors[options.scheme],
  surfaces: surfaces[options.scheme],
  variables: variables,
  zIndexes: zIndexes,
})
