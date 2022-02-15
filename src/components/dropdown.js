import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import { FaAngleDown } from "react-icons/fa"

import useClickToggle from "../hooks/useClickToggle"

export default function Dropdown({ path, className = "", ...props }) {
  const [clicked, handleClick] = useClickToggle()

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
    //
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

  if (items.length === 0) {
    return <></>
  }

  return (
    <div
      className={`${className} dropdown is-right is-pulled-right ${
        clicked ? "is-active" : ""
      }`}
      {...props}
    >
      <div className="dropdown-trigger">
        <button className="is-not-button-custom" onClick={handleClick}>
          <span className="icon is-small">
            <FaAngleDown />
          </span>
        </button>
      </div>
      <div className="dropdown-menu">
        <div className="dropdown-content">{items}</div>
      </div>
    </div>
  )
}
