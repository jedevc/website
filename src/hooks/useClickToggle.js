import { useState, useEffect } from "react"

export default function useClickToggle() {
  const [active, setActive] = useState(false)

  const handleClick = event => {
    setActive(!active)
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
  }

  useEffect(() => {
    const handleExternalClick = () => {
      setActive(false)
    }
    document.addEventListener("click", handleExternalClick)
    return () => {
      document.removeEventListener("click", handleExternalClick)
    }
  }, [])

  return [active, handleClick] 
}