import React from "react"
import {
  TransitionGroup,
  Transition as ReactTransition,
} from "react-transition-group"

export default function Wrapper({ children, location }) {
  return <Transistor location={location}>{children}</Transistor>
}

const Transistor = ({ children, location }) => (
  <TransitionGroup>
    <ReactTransition key={location.pathname} timeout={timeout}>
      {status => {
        const className = `transistor ${status} full-page-custom`
        const style = { ...defaultStyle, ...styles[status] }
        return (
          <div className={className} style={style}>
            {children}
          </div>
        )
      }}
    </ReactTransition>
  </TransitionGroup>
)

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
