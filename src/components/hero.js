import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Nav from "./nav"

export default function Hero() {
  const data = useStaticQuery(graphql`
    query HomeLayoutQuery {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `)
  const { title, description } = data.site.siteMetadata

  return (
    <section className="hero is-primary is-medium">
      <div className="hero-head">
        <Nav />
      </div>

      <div className="hero-body">
        <div className="container">
          <h1 className="title">{title}</h1>
          <h2 className="subtitle">{description}</h2>
        </div>
      </div>
    </section>
  )
}
