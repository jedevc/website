import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import useClickToggle from "../hooks/useClickToggle"

export default function Nav({ sticky, className = "", ...props }) {
  const [active, handleActivate] = useClickToggle()

  const data = useStaticQuery(graphql`
    query NavQuery {
      site {
        siteMetadata {
          display
        }
      }

      allNavYaml {
        nodes {
          name
          link
        }
      }
    }
  `)
  const { display } = data.site.siteMetadata
  const items = data.allNavYaml.nodes

  return (
    <NavBar sticky={sticky} className={className} {...props}>
      <NavBrand title={display} active={active} onToggle={handleActivate} />
      <NavMenu active={active}>
        <NavStart items={items} />
        <NavEnd></NavEnd>
      </NavMenu>
    </NavBar>
  )
}

function NavBar({ children, sticky, className = "", ...props }) {
  return (
    <nav
      className={`${className} navbar ${
        sticky ? "has-shadow is-sticky-custom" : ""
      }`}
      {...props}
    >
      <div className="container">{children}</div>
    </nav>
  )
}

function NavBrand({ title, active, onToggle, className = "", ...props }) {
  return (
    <div className={`${className} navbar-brand`} {...props}>
      <Link to="/" className="navbar-item">
        <span className="is-size-4 pb-2">{title}</span>
      </Link>

      <button
        className={`navbar-burger is-not-button-custom ${
          active ? "is-active" : ""
        }`}
        onClick={onToggle}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  )
}

function NavMenu({ children, active, className = "", ...props }) {
  return (
    <div
      className={`${className} navbar-menu ${active ? "is-active" : ""}`}
      {...props}
    >
      {children}
    </div>
  )
}

function NavStart({ items, className = "", ...props }) {
  return (
    <div className={`${className} navbar-start`} {...props}>
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

function NavEnd({ children, className = "", ...props }) {
  return (
    <div className={`${className} navbar-end`} {...props}>
      {React.Children.map(children, (child, index) => (
        <span key={index} className="navbar-item">
          {child}
        </span>
      ))}
    </div>
  )
}
