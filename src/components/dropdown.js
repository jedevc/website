import React, { useState, useEffect } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { FaAngleDown } from "react-icons/fa"

export default function Dropdown({ path }) {
  const [active, setActive] = useState(false)

  const data = useStaticQuery(graphql`
    query DropDownQuery {
      site {
        siteMetadata {
          github
        }
      }
    }
  `)
  const { github } = data.site.siteMetadata

  let items = []
  if (github && path) {
    // Craft the url to the github path
    // This is annoyingly difficult as we might be provided with slashes in the
    // "wrong" places. So, we just pretend that no slashes are included, and
    // then remove duplicated ones later.
    const url = new URL("blob/master/" + path, github + "/")
    const href = url.href.replace(/([^:]\/)\/+/g, "$1")

    items.push(
      <a key="github" className="dropdown-item" href={href}>
        View on GitHub
      </a>
    )
  }

  const handleClick = event => {
    setActive(!active)
    event.stopPropagation()
    event.nativeEvent.stopImmediatePropagation()
  }

  useEffect(() => {
    const onExternalClick = () => {
      setActive(false)
    }
    document.addEventListener("click", onExternalClick)
    return () => {
      document.removeEventListener("click", onExternalClick)
    }
  }, [])

  if (items.length === 0) {
    return <></>
  }

  return (
    <div
      className={`dropdown is-right is-pulled-right ${
        active ? "is-active" : ""
      }`}
    >
      <div className="dropdown-trigger">
        <a className="icon is-small" onClick={handleClick}>
          <FaAngleDown />
        </a>
      </div>
      <div className="dropdown-menu">
        <div className="dropdown-content">{items}</div>
      </div>
    </div>
  )
}
