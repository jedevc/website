import React from "react"
import {
  TransitionGroup,
  Transition as ReactTransition,
} from "react-transition-group"

export default function Wrapper({ children, location }) {
  return (
    <div className="full-page-custom">
      <Transistor location={location}>{children}</Transistor>
    </div>
  )
}

const timeout = 400
const defaultStyle = {
  position: "absolute",
  width: "100vw",
  transition: `opacity ${timeout}ms ease-in-out`,
  opacity: 0,
}
const styles = {
  entering: {
    opacity: 1,
  },
  entered: {
    opacity: 1,
  },
  exiting: {
    opacity: 0.01,
  },
  exited: {
    opacity: 0.01,
  },
}

const Transistor = ({ children, location }) => (
  <TransitionGroup>
    <ReactTransition key={location.pathname} timeout={timeout}>
      {status => (
        <div style={{ ...defaultStyle, ...styles[status] }}>{children}</div>
      )}
    </ReactTransition>
  </TransitionGroup>
)
