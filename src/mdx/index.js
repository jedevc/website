import React from "react"
import { MDXProvider } from "@mdx-js/react"

import * as shortcodes from "./shortcodes"

export default function DefaultMDXProvider({ children }) {
  return (
    <MDXProvider components={shortcodes}>
      {children}
    </MDXProvider>
  )
}