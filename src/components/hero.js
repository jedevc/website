import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Nav from "./nav"

export default function Hero({ className = "", ...props }) {
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
    <section className={`${className} hero is-primary`} {...props}>
      <div className="hero-head">
        <Nav />
      </div>

      <div className="hero-body">
        <div className="container">
          <div className="columns is-vcentered">
            <div className="column is-one-third is-flex is-justify-content-center">
              <StaticImage
                src="../images/lemon.png"
                alt="A lemon"
                placeholder="tracedSVG"
                className="hero-picture"
              />
            </div>
            <div className="column">
              <h1 className="title">{title}</h1>
              <h2 className="subtitle">{description}</h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
