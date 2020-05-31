import React from "react"
import { useStaticQuery, graphql } from "gatsby"

import Hero from "../components/hero"

export function Layout({ children }) {
  const data = useStaticQuery(graphql`
    query HomeLayoutQuery {
      site {
        siteMetadata {
          title
          description
          author {
            name
          }
        }
      }
    }
  `)
  const { title, description, author } = data.site.siteMetadata

  const pageTitle = `${title} (${author.name})`

  return (
    <>
      <Hero title={pageTitle} subtitle={description} />
      {children}
    </>
  )
}

export function Section({ children }) {
  return (
    <section className="section">
      <div className="container">{children}</div>
    </section>
  )
}
