import React from "react"

function make_message(classes) {
  return function Message({ children }) {
    return (
      <div className={`message is-small ${classes ? classes : ""}`}>
        <div className="message-body">{children}</div>
      </div>
    )
  }
}

export const Message = make_message()
export const MessagePrimary = make_message("is-primary")
export const MessageLink = make_message("is-link")
export const MessageInfo = make_message("is-info")
export const MessageSuccess = make_message("is-success")
export const MessageWarning = make_message("is-warning")
export const MessageDanger = make_message("is-danger")
