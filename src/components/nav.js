import React, { useState } from "react"
import { Link, graphql, useStaticQuery } from "gatsby"

import { FaGithub } from "react-icons/fa"

export default function Nav() {
  const [active, setActive] = useState(false)

  const data = useStaticQuery(graphql`
    query NavQuery {
      site {
        siteMetadata {
          title
          social {
            github
          }
        }
      }
    }
  `)
  const { title, social } = data.site.siteMetadata

  const handleToggle = () => {
    setActive(!active)
  }

  const items = [
    { name: "Home", link: "/" },
    { name: "Blog", link: "/blog" },
    { name: "About", link: "/about" },
  ]

  return (
    <NavBar>
      <NavBrand title={title} onToggle={handleToggle} />
      <NavMenu active={active}>
        <NavStart items={items} />
        <NavEnd>
          {social.github && (
            <a
              className="button is-dark"
              href={`https://github.com/${social.github}`}
            >
              <span className="icon">
                <FaGithub />
              </span>
              <span>GitHub</span>
            </a>
          )}
        </NavEnd>
      </NavMenu>
    </NavBar>
  )
}

function NavBar({ children }) {
  return (
    <nav className="navbar">
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

      <span className="navbar-burger" onClick={onToggle}>
        <span></span>
        <span></span>
        <span></span>
      </span>
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
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.link}
          className="navbar-item"
          activeClassName="is-active has-text-weight-bold"
        >
          {item.name}
        </Link>
      ))}
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
