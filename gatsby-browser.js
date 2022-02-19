import "./src/styles/global.scss"

export const onRouteUpdateDelayed = () => {
  let event = new Event("_loading")
  window.dispatchEvent(event)
}

export const onPreRouteUpdate = ({ location, prevLocation }) => {
  if (prevLocation === null || location.href !== prevLocation.href) {
    // skip sending event if it's the same page!
    let event = new Event("_loaded")
    window.dispatchEvent(event)
  }
}
