import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import useClickToggle from "../hooks/useClickToggle"

export default function Nav({ sticky }) {
  const [active, handleActivate] = useClickToggle()

  const data = useStaticQuery(graphql`
    query NavQuery {
      site {
        siteMetadata {
          display
        }
      }

      allNavYaml {
        edges {
          node {
            name
            link
          }
        }
      }
    }
  `)
  const { display } = data.site.siteMetadata
  const items = data.allNavYaml.edges.map(edge => edge.node)

  return (
    <NavBar sticky={sticky}>
      <NavBrand title={display} onToggle={handleActivate} />
      <NavMenu active={active}>
        <NavStart items={items} />
        <NavEnd></NavEnd>
      </NavMenu>
    </NavBar>
  )
}

function NavBar({ children, sticky }) {
  return (
    <nav className={`navbar ${sticky ? "has-shadow is-sticky-custom" : ""}`}>
      <div className="container">{children}</div>
    </nav>
  )
}

function NavBrand({ title, onToggle }) {
  return (
    <div className="navbar-brand">
      <Link to="/" className="navbar-item">
        <span className="is-size-4" style={{ paddingBottom: "0.5rem" }}>
          {title}
        </span>
      </Link>

      <button className="navbar-burger is-not-button-custom" onClick={onToggle}>
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  )
}

function NavMenu({ children, active }) {
  return (
    <div className={`navbar-menu ${active ? "is-active" : ""}`}>{children}</div>
  )
}

function NavStart({ items }) {
  return (
    <div className="navbar-start">
      {items.map((item, index) => {
        if (item.link[0] === "/") {
          // internal links get the link component
          return (
            <Link
              to={item.link}
              key={index}
              className="navbar-item"
              activeClassName="is-active has-text-weight-bold"
            >
              {item.name}
            </Link>
          )
        } else {
          // external links just get the normal anchor tag
          return (
            <a href={item.link} key={index} className="navbar-item">
              {item.name}
            </a>
          )
        }
      })}
    </div>
  )
}

function NavEnd({ children }) {
  return (
    <div className="navbar-end">
      {React.Children.map(children, (child, index) => (
        <span key={index} className="navbar-item">
          {child}
        </span>
      ))}
    </div>
  )
}
