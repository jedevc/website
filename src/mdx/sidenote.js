import React from "react"

import * as message from "./message"

export function make_sidenote(Parent) {
  return function ({ children }) {
    return (
      <div className="sidebar">
        <Parent>{children}</Parent>
      </div>
    )
  }
}

export const Sidenote = make_sidenote(message.Message)
export const SidenotePrimary = make_sidenote(message.MessagePrimary)
export const SidenoteLink = make_sidenote(message.MessageLink)
export const SidenoteInfo = make_sidenote(message.MessageInfo)
export const SidenoteSuccess = make_sidenote(message.MessageSuccess)
export const SidenoteWarning = make_sidenote(message.MessageWarning)
export const SidenoteDanger = make_sidenote(message.MessageDanger)
